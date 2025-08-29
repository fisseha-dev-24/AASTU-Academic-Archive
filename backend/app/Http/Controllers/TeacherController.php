<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Document;
use App\Models\Category;
use App\Models\Department;
use App\Models\User;
use App\Models\AuditLog;
use App\Models\Feedback;
use App\Models\Schedule;
use App\Models\Deadline;
use App\Models\OfficeHour;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
    /**
     * Get teacher dashboard statistics
     */
    public function getTeacherStats(): JsonResponse
    {
        $user = Auth::user();
        
        $stats = [
            'total_documents' => Document::where('user_id', $user->id)->count(),
            'pending_approval' => Document::where('user_id', $user->id)->where('status', 'pending')->count(),
            'approved_documents' => Document::where('user_id', $user->id)->where('status', 'approved')->count(),
            'rejected_documents' => Document::where('user_id', $user->id)->where('status', 'rejected')->count(),
            'total_views' => Document::where('user_id', $user->id)->sum('views'),
            'total_downloads' => Document::where('user_id', $user->id)->sum('downloads'),
            'monthly_uploads' => Document::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->count(),
            'department_documents' => Document::where('user_id', $user->id)
                ->where('department_id', $user->department_id)
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get teacher's documents
     */
    public function getTeacherDocuments(): JsonResponse
    {
        $user = Auth::user();
        
        $documents = Document::where('user_id', $user->id)
            ->with(['department', 'category'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'author' => $document->author,
                    'description' => $document->description,
                    'document_type' => $document->document_type,
                    'status' => $document->status,
                    'file_path' => $document->file_path,
                    'created_at' => $document->created_at->toISOString(),
                    'updated_at' => $document->updated_at->toISOString(),
                    'views' => $document->views ?? 0,
                    'downloads' => $document->downloads ?? 0,
                    'department' => $document->department ? [
                        'id' => $document->department->id,
                        'name' => $document->department->name
                    ] : null,
                    'category' => $document->category ? [
                        'id' => $document->category->id,
                        'name' => $document->category->name
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $documents
        ]);
    }

    /**
     * Get teacher's pending approval documents
     */
    public function getTeacherPendingApproval(): JsonResponse
    {
        $user = Auth::user();
        
        $documents = Document::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'under_review', 'approved', 'rejected'])
            ->with(['department', 'category'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'author' => $document->author,
                    'description' => $document->description,
                    'document_type' => $document->document_type,
                    'status' => $document->status,
                    'file_path' => $document->file_path,
                    'created_at' => $document->created_at->toISOString(),
                    'updated_at' => $document->updated_at->toISOString(),
                    'views' => $document->views ?? 0,
                    'downloads' => $document->downloads ?? 0,
                    'department' => $document->department ? [
                        'id' => $document->department->id,
                        'name' => $document->department->name
                    ] : null,
                    'category' => $document->category ? [
                        'id' => $document->category->id,
                        'name' => $document->category->name
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $documents
        ]);
    }

    /**
     * Upload a new document
     */
    public function uploadDocument(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'category_id' => 'required|exists:categories,id',
            'document_type' => 'required|string|max:50',
            'year' => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'tags' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,docx,doc,ppt,pptx,xls,xlsx,txt|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            
            // Store the file
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('documents', $fileName, 'public');

            // Create the document
            $document = Document::create([
                'title' => $request->title,
                'author' => $request->author,
                'description' => $request->description,
                'department_id' => $request->department_id,
                'category_id' => $request->category_id,
                'document_type' => $request->document_type,
                'year' => $request->year,
                'keywords' => $request->tags,
                'file_path' => $filePath,
                'status' => 'pending',
                'user_id' => $user->id,
            ]);

            // Log the upload
            AuditLog::create([
                'user_id' => $user->id,
                'document_id' => $document->id,
                'action' => 'upload',
                'details' => 'Document uploaded: ' . $document->title,
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'data' => [
                    'id' => $document->id,
                    'title' => $document->title,
                    'status' => $document->status,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get categories for teacher upload
     */
    public function getTeacherCategories(): JsonResponse
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get departments for teacher upload
     */
    public function getTeacherDepartments(): JsonResponse
    {
        $departments = Department::orderBy('name')->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $departments
        ]);
    }

    /**
     * Update a document
     */
    public function updateDocument(Request $request, $documentId): JsonResponse
    {
        $user = Auth::user();
        
        $document = Document::where('id', $documentId)
            ->where('user_id', $user->id)
            ->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'sometimes|required|string|max:255',
            'department_id' => 'sometimes|required|exists:departments,id',
            'category_id' => 'sometimes|required|exists:categories,id',
            'document_type' => 'sometimes|required|string|max:50',
            'year' => 'sometimes|required|digits:4|integer|min:1900|max:' . date('Y'),
            'tags' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $document->update($request->only([
            'title', 'description', 'author', 'department_id', 
            'category_id', 'document_type', 'year', 'keywords'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Document updated successfully'
        ]);
    }

    /**
     * Delete a document
     */
    public function deleteDocument($documentId): JsonResponse
    {
        $user = Auth::user();
        
        $document = Document::where('id', $documentId)
            ->where('user_id', $user->id)
            ->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        // Delete the file
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully'
        ]);
    }

    /**
     * Get teacher analytics
     */
    public function getTeacherAnalytics(): JsonResponse
    {
        $user = Auth::user();
        
        $analytics = [
            'monthly_uploads' => $this->getMonthlyUploads($user->id),
            'document_views' => $this->getDocumentViews($user->id),
            'document_downloads' => $this->getDocumentDownloads($user->id),
            'status_distribution' => $this->getStatusDistribution($user->id),
            'department_performance' => $this->getDepartmentPerformance($user->id),
        ];

        return response()->json([
            'success' => true,
            'data' => $analytics
        ]);
    }

    /**
     * Get teacher reviews
     */
    public function getTeacherReviews(): JsonResponse
    {
        $user = Auth::user();
        
        $reviews = Document::where('user_id', $user->id)
            ->whereHas('reviews')
            ->with(['reviews.reviewer'])
            ->get()
            ->map(function ($document) {
                return [
                    'document_id' => $document->id,
                    'document_title' => $document->title,
                    'reviews' => $document->reviews->map(function ($review) {
                        return [
                            'id' => $review->id,
                            'reviewer' => $review->reviewer->name,
                            'rating' => $review->rating,
                            'comment' => $review->comment,
                            'reviewed_at' => $review->created_at->format('Y-m-d H:i:s'),
                        ];
                    })
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    /**
     * Get teacher schedule
     */
    public function getTeacherSchedule(): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Get weekly schedule
            $schedule = Schedule::where('teacher_id', $user->id)
                ->where('is_active', true)
                ->orderByRaw("FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')")
                ->orderBy('time')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'code' => $item->code,
                        'type' => $item->type,
                        'day' => $item->day,
                        'time' => $item->time,
                        'location' => $item->location,
                        'students' => $item->students,
                        'color' => $item->color_class,
                    ];
                });

            // Get upcoming deadlines
            $deadlines = Deadline::where('teacher_id', $user->id)
                ->upcoming()
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'course' => $item->course_code,
                        'dueDate' => $item->due_date->format('Y-m-d'),
                        'type' => $item->type,
                        'priority' => $item->priority,
                        'description' => $item->description,
                        'is_completed' => $item->is_completed,
                    ];
                });

            // Get office hours
            $officeHours = OfficeHour::where('teacher_id', $user->id)
                ->active()
                ->orderByRaw("FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')")
                ->orderBy('time')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'day' => $item->day,
                        'time' => $item->time,
                        'location' => $item->location,
                        'type' => $item->type,
                        'notes' => $item->notes,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'schedule' => $schedule,
                    'deadlines' => $deadlines,
                    'officeHours' => $officeHours,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch schedule: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add new schedule item
     */
    public function addScheduleItem(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'code' => 'required|string|max:50',
                'type' => 'required|in:lecture,lab,tutorial,exam,office_hours',
                'day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'time' => 'required|string|max:50',
                'location' => 'required|string|max:255',
                'students' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $schedule = Schedule::create([
                'teacher_id' => $user->id,
                'title' => $request->title,
                'code' => $request->code,
                'type' => $request->type,
                'day' => $request->day,
                'time' => $request->time,
                'location' => $request->location,
                'students' => $request->students ?? 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Schedule item added successfully',
                'data' => $schedule
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add schedule item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add new deadline
     */
    public function addDeadline(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'course_code' => 'required|string|max:50',
                'type' => 'required|in:assignment,exam,project,presentation,report',
                'priority' => 'required|in:low,medium,high',
                'due_date' => 'required|date|after:today',
                'description' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $deadline = Deadline::create([
                'teacher_id' => $user->id,
                'title' => $request->title,
                'course_code' => $request->course_code,
                'type' => $request->type,
                'priority' => $request->priority,
                'due_date' => $request->due_date,
                'description' => $request->description,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Deadline added successfully',
                'data' => $deadline
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add deadline: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add new office hour
     */
    public function addOfficeHour(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'time' => 'required|string|max:50',
                'location' => 'required|string|max:255',
                'type' => 'required|in:regular,online,by_appointment',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $officeHour = OfficeHour::create([
                'teacher_id' => $user->id,
                'day' => $request->day,
                'time' => $request->time,
                'location' => $request->location,
                'type' => $request->type,
                'notes' => $request->notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Office hour added successfully',
                'data' => $officeHour
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add office hour: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get teacher student feedback
     */
    public function getTeacherStudentFeedback(): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Get feedback for this teacher's documents
            $feedback = Feedback::with(['student', 'document'])
                ->where('teacher_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'student' => $item->student->name ?? 'Anonymous',
                        'student_id' => $item->student->student_id ?? 'N/A',
                        'course' => $item->course_name,
                        'document' => $item->document->title ?? 'Unknown Document',
                        'rating' => $item->rating,
                        'comment' => $item->comment,
                        'submitted_at' => $item->created_at->format('Y-m-d H:i:s'),
                        'helpful' => $item->is_helpful,
                    ];
                });

            // Calculate overall stats
            $totalFeedback = $feedback->count();
            $averageRating = $totalFeedback > 0 ? $feedback->avg('rating') : 0;
            $positiveRating = $totalFeedback > 0 ? ($feedback->where('rating', '>=', 4)->count() / $totalFeedback) * 100 : 0;
            $helpfulPercentage = $totalFeedback > 0 ? ($feedback->where('helpful', true)->count() / $totalFeedback) * 100 : 0;

            // Get unique courses for filtering
            $courses = $feedback->pluck('course')->unique()->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'feedback' => $feedback,
                    'stats' => [
                        'averageRating' => round($averageRating, 1),
                        'totalFeedback' => $totalFeedback,
                        'positiveRating' => round($positiveRating, 1),
                        'helpfulPercentage' => round($helpfulPercentage, 1),
                    ],
                    'courses' => $courses,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch feedback: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method to format file size
     */
    private function formatFileSize($bytes)
    {
        if ($bytes === 0) return "0 Bytes";
        $k = 1024;
        $sizes = ["Bytes", "KB", "MB", "GB"];
        $i = floor(log($bytes) / log($k));
        return round($bytes / pow($k, $i), 2) . " " . $sizes[$i];
    }

    /**
     * Helper method to get monthly uploads
     */
    private function getMonthlyUploads($userId)
    {
        return Document::where('user_id', $userId)
            ->whereYear('created_at', now()->year)
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();
    }

    /**
     * Helper method to get document views
     */
    private function getDocumentViews($userId)
    {
        return Document::where('user_id', $userId)
            ->sum('views');
    }

    /**
     * Helper method to get document downloads
     */
    private function getDocumentDownloads($userId)
    {
        return Document::where('user_id', $userId)
            ->sum('downloads');
    }

    /**
     * Helper method to get status distribution
     */
    private function getStatusDistribution($userId)
    {
        return Document::where('user_id', $userId)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    /**
     * Helper method to get department performance
     */
    private function getDepartmentPerformance($userId)
    {
        return Document::where('user_id', $userId)
            ->with('department')
            ->selectRaw('department_id, COUNT(*) as count')
            ->groupBy('department_id')
            ->get()
            ->map(function ($item) {
                return [
                    'department' => $item->department?->name ?? 'Unknown',
                    'count' => $item->count
                ];
            })
            ->toArray();
    }
}
