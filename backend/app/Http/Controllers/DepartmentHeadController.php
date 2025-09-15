<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentReview;
use App\Models\DocumentComment;
use App\Models\User;
use App\Models\Department;
use App\Models\AuditLog;
use App\Models\VideoUpload;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
            'total_videos' => VideoUpload::where('department_id', $departmentId)->count(),
            'pending_approval' => Document::where('department_id', $departmentId)
                ->where('status', 'pending')
                ->count(),
            'pending_video_approval' => VideoUpload::where('department_id', $departmentId)
                ->where('status', 'pending')
                ->count(),
            'approved_this_month' => Document::where('department_id', $departmentId)
                ->where('status', 'approved')
                ->whereMonth('updated_at', now()->month)
                ->count(),
            'approved_videos_this_month' => VideoUpload::where('department_id', $departmentId)
                ->where('status', 'approved')
                ->whereMonth('updated_at', now()->month)
                ->count(),
            'rejected_this_month' => Document::where('department_id', $departmentId)
                ->where('status', 'rejected')
                ->whereMonth('updated_at', now()->month)
                ->count(),
            'rejected_videos_this_month' => VideoUpload::where('department_id', $departmentId)
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

        // Department heads can only see documents from their own department
        $query = Document::with(['uploader', 'department', 'category'])
            ->where('department_id', $departmentId);

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        } else {
            // Default to showing pending documents
            $query->where('status', 'pending');
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
                'description' => $doc->description ?? '',
                'keywords' => $doc->tags ? explode(',', $doc->tags) : [],
                'views' => $doc->views ?? 0,
                'downloads' => $doc->downloads ?? 0,
                'fileSize' => $doc->file_size ? $this->formatFileSize($doc->file_size) : 'Unknown',
                'uploadDate' => $doc->created_at->format('Y-m-d'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedDocuments
        ]);
    }

    /**
     * Get all documents for the department
     */
    public function getDocuments(Request $request): JsonResponse
    {
        $user = Auth::user();
        $departmentId = $user->department_id;

        if (!$departmentId) {
            return response()->json([
                'success' => false,
                'message' => 'Department not assigned'
            ], 400);
        }

        // Get all documents for the department
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
                'teacher' => $doc->uploader->name ?? 'Unknown',
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
                'description' => $doc->description ?? '',
                'keywords' => $doc->tags ? explode(',', $doc->tags) : [],
                'views' => $doc->views ?? 0,
                'downloads' => $doc->downloads ?? 0,
                'fileSize' => $doc->file_size ? $this->formatFileSize($doc->file_size) : 'Unknown',
                'uploadDate' => $doc->created_at->format('Y-m-d'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedDocuments
        ]);
    }

    /**
     * Update document status
     */
    public function updateDocumentStatus(Request $request, $documentId): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,pending,under_review',
        ]);

        $user = Auth::user();
        $document = Document::where('id', $documentId)->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        // Check if user has permission to update this document
        if ($document->department_id !== $user->department_id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

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
                'comments' => 'Status updated by department head',
            ]
        );

        // Log the action
        AuditLog::create([
            'user_id' => $user->id,
            'document_id' => $document->id,
            'action' => 'document_status_update',
            'details' => "Document status updated to {$request->status} by {$user->name}",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Document status updated successfully",
            'data' => [
                'document_id' => $document->id,
                'status' => $request->status,
                'updated_at' => now(),
            ]
        ]);
    }

    /**
     * Delete a document
     */
    public function deleteDocument($documentId): JsonResponse
    {
        $user = Auth::user();
        $document = Document::where('id', $documentId)->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        // Check if user has permission to delete this document
        if ($document->department_id !== $user->department_id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        // Log the action before deletion
        AuditLog::create([
            'user_id' => $user->id,
            'document_id' => $document->id,
            'action' => 'document_deleted',
            'details' => "Document deleted by {$user->name}",
            'ip_address' => request()->ip(),
        ]);

        // Delete the document
        $document->delete();

        return response()->json([
            'success' => true,
            'message' => "Document deleted successfully",
            'data' => [
                'document_id' => $documentId,
                'deleted_at' => now(),
            ]
        ]);
    }

    /**
     * Preview a document
     */
    public function previewDocument($documentId)
    {
        $user = Auth::user();
        $document = Document::where('id', $documentId)->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        // Check if user has permission to view this document
        if ($document->department_id !== $user->department_id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        // Track the view
        $document->increment('views');

        // Log the action
        AuditLog::create([
            'user_id' => $user->id,
            'document_id' => $document->id,
            'action' => 'document_preview',
            'details' => "Document previewed by {$user->name}",
            'ip_address' => request()->ip(),
        ]);

        // Return the file for preview
        $filePath = Storage::disk('public')->path($document->file_path);
        
        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        }

        return response()->file($filePath);
    }

    /**
     * Download a document
     */
    public function downloadDocument($documentId)
    {
        $user = Auth::user();
        $document = Document::where('id', $documentId)->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        // Check if user has permission to download this document
        if ($document->department_id !== $user->department_id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        // Track the download
        $document->increment('downloads');

        // Log the action
        AuditLog::create([
            'user_id' => $user->id,
            'document_id' => $document->id,
            'action' => 'document_download',
            'details' => "Document downloaded by {$user->name}",
            'ip_address' => request()->ip(),
        ]);

        // Return the file for download
        $filePath = Storage::disk('public')->path($document->file_path);
        
        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        }

        return response()->download($filePath);
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
        $document = Document::where('id', $documentId)->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
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

        // Get all documents regardless of department
        $documents = Document::whereIn('id', $request->document_ids)->get();

        if ($documents->count() !== count($request->document_ids)) {
            return response()->json([
                'success' => false,
                'message' => 'Some documents not found'
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
     * Get department statistics for approvals page
     */
    public function getDepartmentStats(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'department_head') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Department head privileges required.'
                ], 403);
            }

            $departmentId = $user->department_id;

            if (!$departmentId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department not assigned'
                ], 400);
            }

            // Get department statistics
            $stats = [
                'approved_this_month' => Document::where('department_id', $departmentId)
                    ->where('status', 'approved')
                    ->whereMonth('updated_at', now()->month)
                    ->count(),
                'rejected_this_month' => Document::where('department_id', $departmentId)
                    ->where('status', 'rejected')
                    ->whereMonth('updated_at', now()->month)
                    ->count(),
                'pending_approval' => Document::where('department_id', $departmentId)
                    ->where('status', 'pending')
                    ->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch department statistics',
                'error' => $e->getMessage()
            ], 500);
        }
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

    /**
     * Format file size
     */
    private function formatFileSize($bytes, $precision = 2)
    {
        if ($bytes < 1024) {
            return $bytes . ' B';
        } elseif ($bytes < 1048576) {
            return round($bytes / 1024, $precision) . ' KB';
        } elseif ($bytes < 1073741824) {
            return round($bytes / 1048576, $precision) . ' MB';
        } elseif ($bytes < 1099511627776) {
            return round($bytes / 1073741824, $precision) . ' GB';
        } else {
            return round($bytes / 1099511627776, $precision) . ' TB';
        }
    }

    /**
     * Get department head dashboard data
     */
    public function dashboard(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'department_head') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Department head privileges required.'
                ], 403);
            }

            $departmentId = $user->department_id;

            if (!$departmentId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department not assigned'
                ], 400);
            }

            // Get dashboard stats
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

            // Get pending documents
            $pendingDocuments = Document::where('department_id', $departmentId)
                ->where('status', 'pending')
                ->with(['uploader', 'department'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($document) {
                    return [
                        'id' => $document->id,
                        'title' => $document->title,
                        'description' => $document->description,
                        'type' => $document->document_type,
                        'department' => $document->department ? $document->department->name : 'Unknown',
                        'uploaded_by' => $document->uploader ? $document->uploader->name : 'Unknown',
                        'uploaded_at' => $document->created_at->format('Y-m-d'),
                        'status' => $document->status,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => $stats,
                    'pending_documents' => $pendingDocuments,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get department profile
     */
    public function getDepartmentProfile(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'department_head') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Department Head privileges required.'
                ], 403);
            }

            $department = Department::find($user->department_id);
            if (!$department) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department not found'
                ], 404);
            }

            // Get department statistics
            $totalFaculty = User::where('role', 'teacher')->where('department_id', $user->department_id)->count();
            $totalStudents = User::where('role', 'student')->where('department_id', $user->department_id)->count();
            $totalDocuments = Document::where('department_id', $user->department_id)->count();
            $pendingDocuments = Document::where('department_id', $user->department_id)->where('status', 'pending')->count();
            $approvedDocuments = Document::where('department_id', $user->department_id)->where('status', 'approved')->count();
            $approvalRate = $totalDocuments > 0 ? round(($approvedDocuments / $totalDocuments) * 100, 2) : 0;

            $profile = [
                'id' => $department->id,
                'name' => $department->name,
                'code' => $department->code ?? '',
                'description' => $department->description ?? '',
                'email' => $department->email ?? '',
                'phone' => $department->phone ?? '',
                'website' => $department->website ?? '',
                'location' => $department->location ?? '',
                'establishedDate' => $department->created_at->format('Y-m-d'),
                'headOfDepartment' => $user->name,
                'totalFaculty' => $totalFaculty,
                'totalStudents' => $totalStudents,
                'totalDocuments' => $totalDocuments,
                'pendingDocuments' => $pendingDocuments,
                'approvedDocuments' => $approvedDocuments,
                'approvalRate' => $approvalRate,
                'mission' => $department->mission ?? '',
                'vision' => $department->vision ?? '',
                'objectives' => $department->objectives ? json_decode($department->objectives) : []
            ];

            return response()->json([
                'success' => true,
                'data' => $profile
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch department profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pending video uploads for department head's department only
     */
    public function getPendingVideos(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'department_head') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Department Head privileges required.'
            ], 403);
        }

        $videos = VideoUpload::where('department_id', $user->department_id)
            ->where('status', 'pending')
            ->with(['uploader', 'department', 'category'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($video) {
                return [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'video_url' => $video->video_url,
                    'video_platform' => $video->video_platform,
                    'video_id' => $video->video_id,
                    'embed_url' => $video->embed_url,
                    'year' => $video->year,
                    'keywords' => $video->keywords,
                    'created_at' => $video->created_at->toISOString(),
                    'uploader' => $video->uploader ? [
                        'id' => $video->uploader->id,
                        'name' => $video->uploader->name,
                        'email' => $video->uploader->email
                    ] : null,
                    'department' => $video->department ? [
                        'id' => $video->department->id,
                        'name' => $video->department->name
                    ] : null,
                    'category' => $video->category ? [
                        'id' => $video->category->id,
                        'name' => $video->category->name
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $videos
        ]);
    }

    /**
     * Approve a video upload
     */
    public function approveVideo(Request $request, $videoId): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'department_head') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Department Head privileges required.'
            ], 403);
        }

        $video = VideoUpload::where('id', $videoId)
            ->where('department_id', $user->department_id)
            ->where('status', 'pending')
            ->first();

        if (!$video) {
            return response()->json([
                'success' => false,
                'message' => 'Video not found or already processed'
            ], 404);
        }

        try {
            $video->update([
                'status' => 'approved',
                'approved_by' => $user->id,
                'approved_at' => now()
            ]);

            // Log the approval
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'video_approve',
                'details' => 'Video approved: ' . $video->title,
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Video approved successfully',
                'data' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'status' => $video->status
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve video: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject a video upload
     */
    public function rejectVideo(Request $request, $videoId): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'department_head') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Department Head privileges required.'
            ], 403);
        }

        $request->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);

        $video = VideoUpload::where('id', $videoId)
            ->where('department_id', $user->department_id)
            ->where('status', 'pending')
            ->first();

        if (!$video) {
            return response()->json([
                'success' => false,
                'message' => 'Video not found or already processed'
            ], 404);
        }

        try {
            $video->update([
                'status' => 'rejected',
                'rejection_reason' => $request->rejection_reason,
                'approved_by' => $user->id,
                'approved_at' => now()
            ]);

            // Log the rejection
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'video_reject',
                'details' => 'Video rejected: ' . $video->title . ' - Reason: ' . $request->rejection_reason,
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Video rejected successfully',
                'data' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'status' => $video->status,
                    'rejection_reason' => $video->rejection_reason
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject video: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve a document
     */
    public function approveDocument(Request $request, $documentId): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'department_head') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Department Head privileges required.'
            ], 403);
        }

        $document = Document::where('id', $documentId)
            ->where('department_id', $user->department_id)
            ->where('status', 'pending')
            ->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found or already processed'
            ], 404);
        }

        try {
            $document->update([
                'status' => 'approved'
            ]);

            // Log the approval
            AuditLog::create([
                'user_id' => $user->id,
                'document_id' => $document->id,
                'action' => 'document_approve',
                'details' => 'Document approved: ' . $document->title,
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Document approved successfully',
                'data' => [
                    'id' => $document->id,
                    'title' => $document->title,
                    'status' => $document->status
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject a document
     */
    public function rejectDocument(Request $request, $documentId): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'department_head') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Department Head privileges required.'
            ], 403);
        }

        $request->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);

        $document = Document::where('id', $documentId)
            ->where('department_id', $user->department_id)
            ->where('status', 'pending')
            ->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found or already processed'
            ], 404);
        }

        try {
            $document->update([
                'status' => 'rejected'
            ]);

            // Log the rejection
            AuditLog::create([
                'user_id' => $user->id,
                'document_id' => $document->id,
                'action' => 'document_reject',
                'details' => 'Document rejected: ' . $document->title . ' - Reason: ' . $request->rejection_reason,
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Document rejected successfully',
                'data' => [
                    'id' => $document->id,
                    'title' => $document->title,
                    'status' => $document->status
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get department courses
     */
    public function getDepartmentCourses(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'department_head') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Department Head privileges required.'
            ], 403);
        }

        try {
            $courses = Course::where('department_id', $user->department_id)
                ->with(['teacher', 'department'])
                ->orderBy('course_code')
                ->get();
            
            $mappedCourses = $courses->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'course_code' => $course->course_code,
                        'course_name' => $course->course_name,
                        'description' => $course->description,
                        'credits' => $course->credits,
                        'level' => $course->level,
                        'semester' => $course->semester,
                        'academic_year' => $course->academic_year,
                        'teacher' => $course->teacher ? [
                            'id' => $course->teacher->id,
                            'name' => $course->teacher->name,
                            'email' => $course->teacher->email,
                        ] : null,
                        'department' => $course->department ? [
                            'id' => $course->department->id,
                            'name' => $course->department->name,
                        ] : null,
                        'is_active' => $course->is_active,
                        'created_at' => $course->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $course->updated_at->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $mappedCourses
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch courses: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get department analytics
     */
    public function getAnalytics(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'department_head') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Department Head privileges required.'
            ], 403);
        }

        try {
            $departmentId = $user->department_id;
            
            // Get basic statistics
            $totalTeachers = User::where('role', 'teacher')->where('department_id', $departmentId)->count();
            $totalDocuments = Document::where('department_id', $departmentId)->count();
            $pendingDocuments = Document::where('department_id', $departmentId)->where('status', 'pending')->count();
            $approvedDocuments = Document::where('department_id', $departmentId)->where('status', 'approved')->count();
            $rejectedDocuments = Document::where('department_id', $departmentId)->where('status', 'rejected')->count();
            
            // Get monthly statistics
            $approvedThisMonth = Document::where('department_id', $departmentId)
                ->where('status', 'approved')
                ->whereMonth('updated_at', now()->month)
                ->whereYear('updated_at', now()->year)
                ->count();
                
            $rejectedThisMonth = Document::where('department_id', $departmentId)
                ->where('status', 'rejected')
                ->whereMonth('updated_at', now()->month)
                ->whereYear('updated_at', now()->year)
                ->count();

            // Get course statistics
            $totalCourses = Course::where('department_id', $departmentId)->count();
            $activeCourses = Course::where('department_id', $departmentId)->where('is_active', true)->count();

            // Calculate approval rate
            $approvalRate = $totalDocuments > 0 ? round(($approvedDocuments / $totalDocuments) * 100, 2) : 0;

            // Get top performing teachers
            $topTeachers = User::where('role', 'teacher')
                ->where('department_id', $departmentId)
                ->withCount(['documents' => function($query) {
                    $query->where('status', 'approved');
                }])
                ->orderBy('documents_count', 'desc')
                ->limit(3)
                ->get()
                ->map(function($teacher) {
                    return [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'approved_documents' => $teacher->documents_count
                    ];
                });

            $analytics = [
                'total_teachers' => $totalTeachers,
                'total_documents' => $totalDocuments,
                'pending_approvals' => $pendingDocuments,
                'approved_this_month' => $approvedThisMonth,
                'rejected_this_month' => $rejectedThisMonth,
                'active_courses' => $activeCourses,
                'total_courses' => $totalCourses,
                'approval_rate' => $approvalRate,
                'top_teachers' => $topTeachers,
                'monthly_stats' => [
                    'approved' => $approvedThisMonth,
                    'rejected' => $rejectedThisMonth,
                    'pending' => $pendingDocuments
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add a comment to a document
     */
    public function addComment(Request $request, $documentId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'department_head' && $user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Department head privileges required.'
                ], 403);
            }

            $request->validate([
                'comment' => 'required|string|max:1000',
                'type' => 'nullable|in:approval,rejection,general'
            ]);

            $document = Document::findOrFail($documentId);
            
            // Get the teacher who uploaded the document
            $teacher = User::findOrFail($document->user_id);

            // Create the comment
            $comment = DocumentComment::create([
                'document_id' => $documentId,
                'from_user_id' => $user->id,
                'to_user_id' => $teacher->id,
                'comment' => $request->comment,
                'type' => $request->type ?? 'general',
                'is_read' => false
            ]);

            // Log the comment
            AuditLog::create([
                'user_id' => $user->id,
                'document_id' => $documentId,
                'action' => 'comment',
                'details' => 'Comment added: ' . substr($request->comment, 0, 50) . '...',
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Comment sent to teacher successfully',
                'data' => $comment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add comment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get comments for a document
     */
    public function getComments($documentId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'department_head' && $user->role !== 'college_dean' && $user->role !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied.'
                ], 403);
            }

            $comments = DocumentComment::where('document_id', $documentId)
                ->with(['fromUser:id,name,email', 'toUser:id,name,email'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $comments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch comments: ' . $e->getMessage()
            ], 500);
        }
    }
}
