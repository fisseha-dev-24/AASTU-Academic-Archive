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
use App\Models\College;
use App\Models\VideoUpload;
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

            // Get the dean's college
            $college = College::where('dean_id', $user->id)->first();
            if (!$college) {
                return response()->json([
                    'success' => false,
                    'message' => 'College not assigned to this dean'
                ], 400);
            }

            // Get college-level statistics (restricted to dean's college only)
            $collegeDepartmentIds = Department::where('college_id', $college->id)->pluck('id');
            
            $stats = [
                'college_name' => $college->name,
                'college_code' => $college->code,
                'total_departments' => $collegeDepartmentIds->count(),
                'total_teachers' => User::whereIn('role', ['teacher', 'department_head'])->where('college_id', $college->id)->count(),
                'total_students' => User::where('role', 'student')->where('college_id', $college->id)->count(),
                'total_documents' => Document::whereIn('department_id', $collegeDepartmentIds)->count(),
                'total_videos' => VideoUpload::whereIn('department_id', $collegeDepartmentIds)->count(),
                'pending_approvals' => Document::whereIn('department_id', $collegeDepartmentIds)->where('status', 'pending')->count(),
                'pending_video_approvals' => VideoUpload::whereIn('department_id', $collegeDepartmentIds)->where('status', 'pending')->count(),
                'approved_this_month' => Document::whereIn('department_id', $collegeDepartmentIds)
                    ->where('status', 'approved')
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->count(),
                'approved_videos_this_month' => VideoUpload::whereIn('department_id', $collegeDepartmentIds)
                    ->where('status', 'approved')
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->count(),
                'rejected_this_month' => Document::whereIn('department_id', $collegeDepartmentIds)
                    ->where('status', 'rejected')
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->count(),
                'rejected_videos_this_month' => VideoUpload::whereIn('department_id', $collegeDepartmentIds)
                    ->where('status', 'rejected')
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->count(),
                'total_uploads_this_month' => Document::whereIn('department_id', $collegeDepartmentIds)
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->count(),
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

            // Get the dean's college first
            $college = College::where('dean_id', $user->id)->first();
            if (!$college) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dean not assigned to any college'
                ], 404);
            }

            $departments = Department::where('college_id', $college->id)
                ->withCount(['users as teacher_count' => function($query) {
                    $query->whereIn('role', ['teacher', 'department_head']);
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

            // Get the dean's college
            $college = \App\Models\College::where('dean_id', $user->id)->first();
            if (!$college) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dean not assigned to any college'
                ], 404);
            }

            // Get all teachers and department heads in the dean's college
            $faculty = User::whereIn('role', ['teacher', 'department_head'])
                ->where('college_id', $college->id)
                ->with(['department', 'documents'])
                ->withCount(['documents as total_uploads', 'documents as approved_uploads' => function($query) {
                    $query->where('status', 'approved');
                }])
                ->get()
                ->map(function($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'email' => $member->email,
                        'role' => $member->role,
                        'department' => $member->department ? $member->department->name : 'Unknown',
                        'department_id' => $member->department ? $member->department->id : null,
                        'total_uploads' => $member->total_uploads,
                        'approved_uploads' => $member->approved_uploads,
                        'approval_rate' => $member->total_uploads > 0 
                            ? round(($member->approved_uploads / $member->total_uploads) * 100, 2)
                            : 0,
                        'last_activity' => $member->documents->max('created_at') ?? 'No activity',
                        'created_at' => $member->created_at
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
     * Get all documents for Dean (including pending and rejected)
     */
    public function getAllDocuments(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dean privileges required.'
                ], 403);
            }

            $query = Document::with(['user', 'department']);

            // Apply filters
            if ($request->has('query') && $request->query) {
                $query->where(function($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->query . '%')
                      ->orWhere('description', 'like', '%' . $request->query . '%')
                      ->orWhereHas('user', function($userQuery) use ($request) {
                          $userQuery->where('name', 'like', '%' . $request->query . '%');
                      })
                      ->orWhereHas('department', function($deptQuery) use ($request) {
                          $deptQuery->where('name', 'like', '%' . $request->query . '%');
                      });
                });
            }

            if ($request->has('document_type') && $request->document_type !== 'all') {
                $query->where('document_type', $request->document_type);
            }

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->has('year') && $request->year !== 'all') {
                $query->where('year', $request->year);
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 20);
            $documents = $query->paginate($perPage);

            $formattedDocuments = $documents->map(function ($document) {
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'author' => $document->user->name,
                    'department' => $document->department->name ?? 'Unknown',
                    'type' => $document->document_type,
                    'date' => $document->created_at->format('Y-m-d'),
                    'year' => $document->year,
                    'downloads' => 0, // Will be updated when we have download tracking
                    'description' => $document->description ?? '',
                    'keywords' => $document->keywords ? explode(',', $document->keywords) : [],
                    'fileSize' => '1.5 MB', // Mock for now
                    'pages' => 0, // Mock for now
                    'status' => $document->status,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedDocuments,
                'pagination' => [
                    'current_page' => $documents->currentPage(),
                    'last_page' => $documents->lastPage(),
                    'per_page' => $documents->perPage(),
                    'total' => $documents->total(),
                    'from' => $documents->firstItem(),
                    'to' => $documents->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch documents',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all documents for dean review
     */
    public function getDocuments(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dean privileges required.'
                ], 403);
            }

            // Build query for all documents
            $query = Document::with(['uploader', 'department', 'category'])
                ->latest();

            // Apply search filter
            if ($request->has('query') && $request->query) {
                $search = $request->query;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('author', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('tags', 'like', "%{$search}%");
                });
            }

            // Apply status filter
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Apply department filter
            if ($request->has('document_type') && $request->document_type !== 'all') {
                $query->whereHas('department', function($q) use ($request) {
                    $q->where('name', $request->document_type);
                });
            }

            $documents = $query->paginate(50);

            // Transform data for frontend
            $transformedDocuments = $documents->getCollection()->map(function ($doc) {
                // Get the reviewer (department head who approved/rejected)
                $reviewer = null;
                if ($doc->status === 'approved' || $doc->status === 'rejected') {
                    $review = \App\Models\DocumentReview::where('document_id', $doc->id)
                        ->whereIn('status', ['approved', 'rejected'])
                        ->with('reviewer')
                        ->first();
                    if ($review && $review->reviewer) {
                        $reviewer = [
                            'name' => $review->reviewer->name,
                            'email' => $review->reviewer->email,
                            'role' => $review->reviewer->role
                        ];
                    }
                }

                // Get comments for this document
                $comments = \App\Models\DocumentComment::where('document_id', $doc->id)
                    ->with('fromUser')
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function ($comment) {
                        return [
                            'id' => $comment->id,
                            'comment' => $comment->comment,
                            'type' => $comment->type,
                            'from_user' => $comment->fromUser ? $comment->fromUser->name : 'Unknown',
                            'created_at' => $comment->created_at->format('Y-m-d H:i:s')
                        ];
                    });

                return [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'author' => $doc->author,
                    'uploader' => $doc->uploader ? [
                        'name' => $doc->uploader->name,
                        'email' => $doc->uploader->email,
                        'role' => $doc->uploader->role
                    ] : null,
                    'department' => $doc->department ? $doc->department->name : 'Unknown',
                    'department_id' => $doc->department ? $doc->department->id : null,
                    'type' => $doc->document_type,
                    'year' => $doc->year,
                    'date' => $doc->created_at->format('Y-m-d'),
                    'downloads' => $doc->downloads ?? 0,
                    'views' => $doc->views ?? 0,
                    'status' => $doc->status,
                    'description' => $doc->description ?? '',
                    'keywords' => $doc->tags ? explode(',', $doc->tags) : [],
                    'reviewer' => $reviewer,
                    'comments' => $comments,
                    'file_size' => $doc->file_size ?? 'Unknown',
                    'file_path' => $doc->file_path ?? ''
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedDocuments,
                'pagination' => [
                    'current_page' => $documents->currentPage(),
                    'last_page' => $documents->lastPage(),
                    'per_page' => $documents->perPage(),
                    'total' => $documents->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch documents',
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

    /**
     * Get all departments for registration
     */
    public function getDepartments(): JsonResponse
    {
        try {
            $departments = Department::select('id', 'name', 'code', 'description')->get();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'departments' => $departments
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch departments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Preview document for dean
     */
    public function previewDocument($id)
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dean privileges required.'
                ], 403);
            }

            // Get the dean's college
            $college = College::where('dean_id', $user->id)->first();
            if (!$college) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dean not assigned to any college'
                ], 404);
            }

            $document = Document::findOrFail($id);
            
            // Check if document belongs to dean's college
            $collegeDepartmentIds = Department::where('college_id', $college->id)->pluck('id');
            if (!in_array($document->department_id, $collegeDepartmentIds->toArray())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Document not in your college.'
                ], 403);
            }

            // Track the view
            $document->increment('views');

            // Log the action
            \App\Models\AuditLog::create([
                'user_id' => $user->id,
                'document_id' => $document->id,
                'action' => 'document_preview',
                'details' => "Document previewed by dean {$user->name}",
                'ip_address' => request()->ip(),
            ]);

            // Return the file for preview
            $filePath = \Illuminate\Support\Facades\Storage::disk('public')->path($document->file_path);
            
            if (!file_exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }

            return response()->file($filePath);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to preview document',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download document for dean
     */
    public function downloadDocument($id)
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dean privileges required.'
                ], 403);
            }

            // Get the dean's college
            $college = College::where('dean_id', $user->id)->first();
            if (!$college) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dean not assigned to any college'
                ], 404);
            }

            $document = Document::findOrFail($id);
            
            // Check if document belongs to dean's college
            $collegeDepartmentIds = Department::where('college_id', $college->id)->pluck('id');
            if (!in_array($document->department_id, $collegeDepartmentIds->toArray())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Document not in your college.'
                ], 403);
            }

            // Track the download
            $document->increment('downloads');

            // Log the action
            \App\Models\AuditLog::create([
                'user_id' => $user->id,
                'document_id' => $document->id,
                'action' => 'document_download',
                'details' => "Document downloaded by dean {$user->name}",
                'ip_address' => request()->ip(),
            ]);

            // Return the file for download
            $filePath = \Illuminate\Support\Facades\Storage::disk('public')->path($document->file_path);
            
            if (!file_exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }

            return response()->download($filePath);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download document',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get college dean dashboard data
     */
    public function dashboard(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'college_dean') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. College dean privileges required.'
                ], 403);
            }

            // Get the dean's college
            $college = College::where('dean_id', $user->id)->first();
            if (!$college) {
                return response()->json([
                    'success' => false,
                    'message' => 'College not assigned to this dean'
                ], 400);
            }

            // Get college-level statistics (restricted to dean's college only)
            $collegeDepartmentIds = Department::where('college_id', $college->id)->pluck('id');
            
            $stats = [
                'total_departments' => $collegeDepartmentIds->count(),
                'total_teachers' => User::whereIn('role', ['teacher', 'department_head'])->where('college_id', $college->id)->count(),
                'total_students' => User::where('role', 'student')->where('college_id', $college->id)->count(),
                'total_documents' => Document::whereIn('department_id', $collegeDepartmentIds)->count(),
                'pending_approvals' => Document::whereIn('department_id', $collegeDepartmentIds)->where('status', 'pending')->count(),
                'approved_this_month' => Document::whereIn('department_id', $collegeDepartmentIds)
                    ->where('status', 'approved')
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->count(),
                'rejected_this_month' => Document::whereIn('department_id', $collegeDepartmentIds)
                    ->where('status', 'rejected')
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->count(),
                'total_uploads_this_month' => Document::whereIn('department_id', $collegeDepartmentIds)->whereMonth('created_at', Carbon::now()->month)->count(),
            ];

            // Get department analytics for the dean's college only
            $departmentAnalytics = Department::where('college_id', $college->id)
                ->withCount(['users as teacher_count' => function($query) {
                $query->whereIn('role', ['teacher', 'department_head']);
            }, 'users as student_count' => function($query) {
                $query->where('role', 'student');
            }, 'documents as total_documents', 'documents as pending_documents' => function($query) {
                $query->where('status', 'pending');
            }, 'documents as approved_documents' => function($query) {
                $query->where('status', 'approved');
            }])->get()
            ->map(function($dept) {
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
                'data' => [
                    'stats' => $stats,
                    'department_analytics' => $departmentAnalytics,
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
}
