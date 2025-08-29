<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentReview;
use App\Models\User;
use App\Models\Department;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DepartmentHeadController extends Controller
{
    /**
     * Get department head dashboard statistics
     */
    public function getDashboardStats(): JsonResponse
    {
        $user = Auth::user();
        $departmentId = $user->department_id;

        if (!$departmentId) {
            return response()->json([
                'success' => false,
                'message' => 'Department not assigned'
            ], 400);
        }

        // Get department statistics
        $stats = [
            'total_documents' => Document::where('department_id', $departmentId)->count(),
            'pending_approval' => Document::where('department_id', $departmentId)
                ->where('status', 'pending')
                ->count(),
            'approved_this_month' => Document::where('department_id', $departmentId)
                ->where('status', 'approved')
                ->whereMonth('updated_at', now()->month)
                ->count(),
            'rejected_this_month' => Document::where('department_id', $departmentId)
                ->where('status', 'rejected')
                ->whereMonth('updated_at', now()->month)
                ->count(),
            'total_faculty' => User::where('department_id', $departmentId)
                ->where('role', 'teacher')
                ->count(),
            'total_students' => User::where('department_id', $departmentId)
                ->where('role', 'student')
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get pending documents for approval
     */
    public function getPendingDocuments(Request $request): JsonResponse
    {
        $user = Auth::user();
        $departmentId = $user->department_id;

        if (!$departmentId) {
            return response()->json([
                'success' => false,
                'message' => 'Department not assigned'
            ], 400);
        }

        $query = Document::with(['uploader', 'department', 'category'])
            ->where('department_id', $departmentId);

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('document_type', 'like', "%{$search}%");
            });
        }

        $documents = $query->orderBy('created_at', 'desc')->get();

        // Transform data for frontend
        $transformedDocuments = $documents->map(function ($doc) {
            return [
                'id' => $doc->id,
                'title' => $doc->title,
                'teacher' => $doc->uploader->name,
                'type' => $doc->document_type,
                'submittedDate' => $doc->created_at->format('Y-m-d'),
                'status' => $doc->status,
                'priority' => $this->determinePriority($doc),
                'author' => $doc->author,
                'department' => $doc->department->name ?? 'Unknown',
                'category' => $doc->category->name ?? 'Uncategorized',
                'year' => $doc->year,
                'file_path' => $doc->file_path,
                'uploader_id' => $doc->user_id,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedDocuments
        ]);
    }

    /**
     * Approve or reject a document
     */
    public function reviewDocument(Request $request, $documentId): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'comment' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();
        $document = Document::where('id', $documentId)
            ->where('department_id', $user->department_id)
            ->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found or not in your department'
            ], 404);
        }

        // Log the action for debugging
        \Log::info('Document review request', [
            'document_id' => $documentId,
            'user_id' => $user->id,
            'department_id' => $user->department_id,
            'document_department_id' => $document->department_id,
            'old_status' => $document->status,
            'new_status' => $request->status,
            'comment' => $request->comment
        ]);

        // Update document status
        $document->status = $request->status;
        $document->save();

        // Create or update review record
        DocumentReview::updateOrCreate(
            [
                'document_id' => $document->id,
                'reviewer_id' => $user->id,
            ],
            [
                'status' => $request->status,
                'comments' => $request->comment,
            ]
        );

        // Log the action
        AuditLog::create([
            'user_id' => $user->id,
            'document_id' => $document->id,
            'action' => 'document_review',
            'details' => "Document {$request->status} by {$user->name}",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Document {$request->status} successfully",
            'data' => [
                'document_id' => $document->id,
                'status' => $request->status,
                'reviewed_at' => now(),
            ]
        ]);
    }

    /**
     * Bulk approve/reject documents
     */
    public function bulkReviewDocuments(Request $request): JsonResponse
    {
        $request->validate([
            'document_ids' => 'required|array',
            'document_ids.*' => 'exists:documents,id',
            'status' => 'required|in:approved,rejected',
            'comment' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();
        $departmentId = $user->department_id;

        // Verify all documents belong to the department head's department
        $documents = Document::whereIn('id', $request->document_ids)
            ->where('department_id', $departmentId)
            ->get();

        if ($documents->count() !== count($request->document_ids)) {
            return response()->json([
                'success' => false,
                'message' => 'Some documents not found or not in your department'
            ], 400);
        }

        DB::transaction(function () use ($documents, $request, $user) {
            foreach ($documents as $document) {
                // Update document status
                $document->status = $request->status;
                $document->save();

                // Create or update review record
                DocumentReview::updateOrCreate(
                    [
                        'document_id' => $document->id,
                        'reviewer_id' => $user->id,
                    ],
                    [
                        'status' => $request->status,
                        'comments' => $request->comment,
                    ]
                );

                // Log the action
                AuditLog::create([
                    'user_id' => $user->id,
                    'document_id' => $document->id,
                    'action' => 'bulk_document_review',
                    'details' => "Document {$request->status} in bulk by {$user->name}",
                    'ip_address' => $request->ip(),
                ]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => "Bulk {$request->status} completed successfully",
            'data' => [
                'processed_count' => $documents->count(),
                'status' => $request->status,
            ]
        ]);
    }

    /**
     * Get department faculty members
     */
    public function getDepartmentFaculty(): JsonResponse
    {
        $user = Auth::user();
        $departmentId = $user->department_id;

        if (!$departmentId) {
            return response()->json([
                'success' => false,
                'message' => 'Department not assigned'
            ], 400);
        }

        $faculty = User::where('department_id', $departmentId)
            ->where('role', 'teacher')
            ->with(['department'])
            ->get()
            ->map(function ($teacher) {
                $documentStats = Document::where('user_id', $teacher->id)
                    ->selectRaw('
                        COUNT(*) as total_documents,
                        COUNT(CASE WHEN status = "approved" THEN 1 END) as approved_documents,
                        COUNT(CASE WHEN status = "pending" THEN 1 END) as pending_documents,
                        COUNT(CASE WHEN status = "rejected" THEN 1 END) as rejected_documents
                    ')
                    ->first();

                return [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'email' => $teacher->email,
                    'department' => $teacher->department->name ?? 'Unknown',
                    'created_at' => $teacher->created_at->format('Y-m-d'),
                    'stats' => [
                        'total_documents' => $documentStats->total_documents,
                        'approved_documents' => $documentStats->approved_documents,
                        'pending_documents' => $documentStats->pending_documents,
                        'rejected_documents' => $documentStats->rejected_documents,
                    ]
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $faculty
        ]);
    }

    /**
     * Get department analytics
     */
    public function getDepartmentAnalytics(): JsonResponse
    {
        $user = Auth::user();
        $departmentId = $user->department_id;

        if (!$departmentId) {
            return response()->json([
                'success' => false,
                'message' => 'Department not assigned'
            ], 400);
        }

        // Monthly document submissions
        $monthlySubmissions = Document::where('department_id', $departmentId)
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Document status distribution
        $statusDistribution = Document::where('department_id', $departmentId)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Top contributors
        $topContributors = Document::where('department_id', $departmentId)
            ->with('uploader')
            ->selectRaw('user_id, COUNT(*) as document_count')
            ->groupBy('user_id')
            ->orderByDesc('document_count')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'teacher_name' => $item->uploader->name,
                    'document_count' => $item->document_count,
                ];
            });

        // Recent activity
        $recentActivity = AuditLog::whereHas('document', function ($query) use ($departmentId) {
            $query->where('department_id', $departmentId);
        })
        ->with(['user', 'document'])
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get()
        ->map(function ($log) {
            return [
                'id' => $log->id,
                'action' => $log->action,
                'details' => $log->details,
                'user_name' => $log->user->name,
                'document_title' => $log->document->title ?? 'Unknown',
                'created_at' => $log->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'monthly_submissions' => $monthlySubmissions,
                'status_distribution' => $statusDistribution,
                'top_contributors' => $topContributors,
                'recent_activity' => $recentActivity,
            ]
        ]);
    }

    /**
     * Get department reports
     */
    public function getDepartmentReports(Request $request): JsonResponse
    {
        $user = Auth::user();
        $departmentId = $user->department_id;

        if (!$departmentId) {
            return response()->json([
                'success' => false,
                'message' => 'Department not assigned'
            ], 400);
        }

        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->endOfMonth()->format('Y-m-d'));

        $reports = [
            'document_approval_summary' => [
                'total_submitted' => Document::where('department_id', $departmentId)
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->count(),
                'approved' => Document::where('department_id', $departmentId)
                    ->where('status', 'approved')
                    ->whereBetween('updated_at', [$startDate, $endDate])
                    ->count(),
                'rejected' => Document::where('department_id', $departmentId)
                    ->where('status', 'rejected')
                    ->whereBetween('updated_at', [$startDate, $endDate])
                    ->count(),
                'pending' => Document::where('department_id', $departmentId)
                    ->where('status', 'pending')
                    ->count(),
            ],
            'faculty_performance' => User::where('department_id', $departmentId)
                ->where('role', 'teacher')
                ->withCount(['documents as total_documents'])
                ->get()
                ->map(function ($teacher) use ($startDate, $endDate) {
                    $approvedCount = Document::where('user_id', $teacher->id)
                        ->where('status', 'approved')
                        ->whereBetween('updated_at', [$startDate, $endDate])
                        ->count();

                    return [
                        'teacher_name' => $teacher->name,
                        'total_documents' => $teacher->total_documents,
                        'approved_documents' => $approvedCount,
                        'approval_rate' => $teacher->total_documents > 0 
                            ? round(($approvedCount / $teacher->total_documents) * 100, 2) 
                            : 0,
                    ];
                }),
        ];

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }

    /**
     * Determine document priority based on various factors
     */
    private function determinePriority($document): string
    {
        // Simple priority logic - can be enhanced
        $daysSinceSubmission = now()->diffInDays($document->created_at);
        
        if ($daysSinceSubmission > 7) {
            return 'high';
        } elseif ($daysSinceSubmission > 3) {
            return 'medium';
        } else {
            return 'low';
        }
    }
}
