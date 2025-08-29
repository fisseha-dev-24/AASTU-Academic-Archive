<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Document;
use App\Models\Department;
use App\Models\AuditLog;
use App\Models\DocumentReview;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DeanController extends Controller
{
    /**
     * Get college dean dashboard statistics
     */
    public function getDeanStats(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            // Verify user is a dean
            if ($user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dean privileges required.'
                ], 403);
            }

            // Get college-level statistics
            $stats = [
                'total_departments' => Department::count(),
                'total_teachers' => User::where('role', 'teacher')->count(),
                'total_students' => User::where('role', 'student')->count(),
                'total_documents' => Document::count(),
                'pending_approvals' => Document::where('status', 'pending')->count(),
                'approved_this_month' => Document::where('status', 'approved')
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->count(),
                'rejected_this_month' => Document::where('status', 'rejected')
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->count(),
                'total_uploads_this_month' => Document::whereMonth('created_at', Carbon::now()->month)->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dean statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get department performance analytics
     */
    public function getDepartmentAnalytics(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dean privileges required.'
                ], 403);
            }

            $departments = Department::withCount(['users as teacher_count' => function($query) {
                $query->where('role', 'teacher');
            }, 'users as student_count' => function($query) {
                $query->where('role', 'student');
            }, 'documents as total_documents', 'documents as pending_documents' => function($query) {
                $query->where('status', 'pending');
            }, 'documents as approved_documents' => function($query) {
                $query->where('status', 'approved');
            }])->get();

            $analytics = $departments->map(function($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'teacher_count' => $dept->teacher_count,
                    'student_count' => $dept->student_count,
                    'total_documents' => $dept->total_documents,
                    'pending_documents' => $dept->pending_documents,
                    'approved_documents' => $dept->approved_documents,
                    'approval_rate' => $dept->total_documents > 0 
                        ? round(($dept->approved_documents / $dept->total_documents) * 100, 2)
                        : 0
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch department analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get faculty management data
     */
    public function getFacultyManagement(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dean privileges required.'
                ], 403);
            }

            $faculty = User::where('role', 'teacher')
                ->with(['department', 'documents'])
                ->withCount(['documents as total_uploads', 'documents as approved_uploads' => function($query) {
                    $query->where('status', 'approved');
                }])
                ->get()
                ->map(function($teacher) {
                    return [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'department' => $teacher->department ? $teacher->department->name : 'Unknown',
                        'total_uploads' => $teacher->total_uploads,
                        'approved_uploads' => $teacher->approved_uploads,
                        'approval_rate' => $teacher->total_uploads > 0 
                            ? round(($teacher->approved_uploads / $teacher->total_uploads) * 100, 2)
                            : 0,
                        'last_activity' => $teacher->documents->max('created_at') ?? 'No activity'
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $faculty
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch faculty data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get institutional reports
     */
    public function getInstitutionalReports(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dean privileges required.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
                'report_type' => 'nullable|string|in:monthly,quarterly,yearly'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->startOfMonth();
            $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now()->endOfMonth();

            $reports = [
                'document_activity' => [
                    'total_uploads' => Document::whereBetween('created_at', [$startDate, $endDate])->count(),
                    'total_approvals' => DocumentReview::whereBetween('created_at', [$startDate, $endDate])->count(),
                    'approval_rate' => $this->calculateApprovalRate($startDate, $endDate),
                ],
                'user_activity' => [
                    'new_users' => User::whereBetween('created_at', [$startDate, $endDate])->count(),
                    'active_users' => $this->getActiveUsers($startDate, $endDate),
                ],
                'department_performance' => $this->getDepartmentPerformance($startDate, $endDate),
            ];

            return response()->json([
                'success' => true,
                'data' => $reports
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate institutional reports',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent institutional activities
     */
    public function getRecentActivities(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dean privileges required.'
                ], 403);
            }

            $activities = AuditLog::with(['user', 'document'])
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get()
                ->map(function($log) {
                    return [
                        'id' => $log->id,
                        'action' => $log->action,
                        'user' => $log->user ? $log->user->name : 'Unknown',
                        'document' => $log->document ? $log->document->title : null,
                        'timestamp' => $log->created_at->format('Y-m-d H:i:s'),
                        'details' => $log->details
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $activities
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent activities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate approval rate for a date range
     */
    private function calculateApprovalRate($startDate, $endDate): float
    {
        $totalReviews = DocumentReview::whereBetween('created_at', [$startDate, $endDate])->count();
        $approvedReviews = DocumentReview::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'approved')
            ->count();

        return $totalReviews > 0 ? round(($approvedReviews / $totalReviews) * 100, 2) : 0;
    }

    /**
     * Get active users in a date range
     */
    private function getActiveUsers($startDate, $endDate): int
    {
        return AuditLog::whereBetween('created_at', [$startDate, $endDate])
            ->distinct('user_id')
            ->count('user_id');
    }

    /**
     * Get department performance in a date range
     */
    private function getDepartmentPerformance($startDate, $endDate): array
    {
        return Department::withCount(['documents as total_documents' => function($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }, 'documents as approved_documents' => function($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate])
                  ->where('status', 'approved');
        }])->get()
        ->map(function($dept) {
            return [
                'department' => $dept->name,
                'total_documents' => $dept->total_documents,
                'approved_documents' => $dept->approved_documents,
                'approval_rate' => $dept->total_documents > 0 
                    ? round(($dept->approved_documents / $dept->total_documents) * 100, 2)
                    : 0
            ];
        })->toArray();
    }
}
