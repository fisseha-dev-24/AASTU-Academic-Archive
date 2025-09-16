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
use App\Models\VideoUpload;
use App\Models\College;
use App\Models\DocumentComment;
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
        
        if ($user->role !== 'teacher') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }
        
        $stats = [
            'totalDocuments' => Document::where('user_id', $user->id)->count(),
            'totalVideos' => VideoUpload::where('user_id', $user->id)->count(),
            'pendingApproval' => Document::where('user_id', $user->id)->where('status', 'pending')->count(),
            'pendingVideoApproval' => VideoUpload::where('user_id', $user->id)->where('status', 'pending')->count(),
            'approvedDocuments' => Document::where('user_id', $user->id)->where('status', 'approved')->count(),
            'approvedVideos' => VideoUpload::where('user_id', $user->id)->where('status', 'approved')->count(),
            'rejectedDocuments' => Document::where('user_id', $user->id)->where('status', 'rejected')->count(),
            'rejectedVideos' => VideoUpload::where('user_id', $user->id)->where('status', 'rejected')->count(),
            'monthlyUploads' => Document::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->count(),
            'monthlyVideoUploads' => VideoUpload::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get teacher dashboard data
     */
    public function dashboard(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'teacher') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        try {
            // Get user with department
            $userWithDept = $user->load('department');
            
            // Get statistics
            $stats = [
                'totalDocuments' => Document::where('user_id', $user->id)->count(),
                'totalVideos' => VideoUpload::where('user_id', $user->id)->count(),
                'pendingApproval' => Document::where('user_id', $user->id)->where('status', 'pending')->count(),
                'pendingVideoApproval' => VideoUpload::where('user_id', $user->id)->where('status', 'pending')->count(),
                'approvedDocuments' => Document::where('user_id', $user->id)->where('status', 'approved')->count(),
                'approvedVideos' => VideoUpload::where('user_id', $user->id)->where('status', 'approved')->count(),
                'rejectedDocuments' => Document::where('user_id', $user->id)->where('status', 'rejected')->count(),
                'rejectedVideos' => VideoUpload::where('user_id', $user->id)->where('status', 'rejected')->count(),
                'monthlyUploads' => Document::where('user_id', $user->id)
                    ->whereMonth('created_at', now()->month)
                    ->count(),
                'monthlyVideoUploads' => VideoUpload::where('user_id', $user->id)
                    ->whereMonth('created_at', now()->month)
                    ->count(),
            ];

            // Get recent documents
            $recentDocuments = Document::where('user_id', $user->id)
                ->with(['department', 'category'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($document) {
                    return [
                        'id' => $document->id,
                        'title' => $document->title,
                        'document_type' => $document->document_type,
                        'status' => $document->status,
                        'created_at' => $document->created_at->format('Y-m-d H:i:s'),
                        'views' => $document->views ?? 0,
                        'downloads' => $document->downloads ?? 0,
                        'department' => $document->department ? $document->department->name : 'Unknown'
                    ];
                });

            // Get recent videos
            $recentVideos = VideoUpload::where('user_id', $user->id)
                ->with(['department', 'category'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'video_platform' => $video->video_platform,
                        'status' => $video->status,
                        'created_at' => $video->created_at->format('Y-m-d H:i:s'),
                        'views' => $video->views,
                        'department' => $video->department ? $video->department->name : 'Unknown'
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $userWithDept,
                    'stats' => $stats,
                    'recentDocuments' => $recentDocuments,
                    'recentVideos' => $recentVideos
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard data'
            ], 500);
        }
    }

    /**
     * Get teacher's documents
     */
    public function getTeacherDocuments(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'teacher') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }
        
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
                    'file_size' => $document->file_size,
                    'file_type' => $document->file_type,
                    'year' => $document->year,
                    'keywords' => $document->keywords,
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
        $user = Auth::user();
        
        // Check if user is a teacher
        if ($user->role !== 'teacher') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only teachers can upload documents.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'category_id' => 'required|exists:categories,id',
            'document_type' => 'required|string|max:50',
            'year' => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'semester' => 'required|string|in:1,2,Summer,Winter',
            'academic_year' => 'required|string|in:1st Year,2nd Year,3rd Year,4th Year,5th Year,Final Year,Graduate,Post Graduate,PhD,General',
            'tags' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,docx,doc,ppt,pptx,xls,xlsx,txt|max:51200',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Restrict teachers to upload only for their own department
            if ($request->department_id != $user->department_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only upload documents for your own department.'
                ], 403);
            }
            
            // Debug: Log the received data
            \Log::info('Document upload request received', [
                'user_id' => $user->id,
                'request_data' => $request->all(),
                'files' => $request->allFiles()
            ]);
            
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
                'semester' => $request->semester,
                'academic_year' => $request->academic_year,
                'keywords' => $request->tags, // Map tags to keywords
                'file_path' => $filePath,
                'file_size' => $file->getSize(),
                'file_type' => $file->getClientMimeType(),
                'version' => '1.0',
                'is_featured' => false,
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
            \Log::error('Document upload failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
                'debug' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Upload a new video
     */
    public function uploadVideo(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        // Check if user is a teacher
        if ($user->role !== 'teacher') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only teachers can upload videos.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_url' => 'required|url',
            'department_id' => 'required|exists:departments,id',
            'category_id' => 'nullable|exists:categories,id',
            'year' => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'keywords' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Restrict teachers to upload only for their own department
            if ($request->department_id != $user->department_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only upload videos for your own department.'
                ], 403);
            }

            // Extract video platform and ID
            $videoPlatform = VideoUpload::getVideoPlatform($request->video_url);
            $videoId = null;
            
            if ($videoPlatform === 'youtube') {
                $videoId = VideoUpload::extractYouTubeId($request->video_url);
            } elseif ($videoPlatform === 'vimeo') {
                $videoId = VideoUpload::extractVimeoId($request->video_url);
            }

            if (!$videoId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid video URL. Please provide a valid YouTube or Vimeo URL.'
                ], 422);
            }

            // Create the video upload
            $videoUpload = VideoUpload::create([
                'title' => $request->title,
                'description' => $request->description,
                'video_url' => $request->video_url,
                'video_platform' => $videoPlatform,
                'video_id' => $videoId,
                'department_id' => $request->department_id,
                'category_id' => $request->category_id,
                'user_id' => $user->id,
                'year' => $request->year,
                'keywords' => $request->keywords,
                'status' => 'pending',
            ]);

            // Log the upload
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'video_upload',
                'details' => 'Video uploaded: ' . $videoUpload->title,
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Video uploaded successfully and sent for review',
                'data' => [
                    'id' => $videoUpload->id,
                    'title' => $videoUpload->title,
                    'status' => $videoUpload->status,
                    'video_platform' => $videoUpload->video_platform,
                ]
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Video upload failed: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
                'debug' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Get teacher's video uploads
     */
    public function getTeacherVideos(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'teacher') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }
        
        $videos = VideoUpload::where('user_id', $user->id)
            ->with(['department', 'category'])
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
                    'status' => $video->status,
                    'rejection_reason' => $video->rejection_reason,
                    'created_at' => $video->created_at->toISOString(),
                    'updated_at' => $video->updated_at->toISOString(),
                    'views' => $video->views,
                    'likes' => $video->likes,
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


    /**
     * Get teacher analytics data
     */
    public function getAnalytics(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Teacher privileges required.'
                ], 403);
            }

            // Get teacher's documents
            $documents = Document::where('user_id', $user->id);
            $totalDocuments = $documents->count();
            $approvedDocuments = $documents->where('status', 'approved')->count();
            $pendingDocuments = $documents->where('status', 'pending')->count();
            $rejectedDocuments = $documents->where('status', 'rejected')->count();
            
            // Calculate approval rate
            $approvalRate = $totalDocuments > 0 ? round(($approvedDocuments / $totalDocuments) * 100, 1) : 0;
            
            // Get total views and downloads
            $totalViews = $documents->sum('views') ?? 0;
            $totalDownloads = $documents->where('status', 'approved')->sum('downloads') ?? 0;
            
            // Get monthly uploads for current year
            $monthlyUploads = [];
            for ($i = 1; $i <= 12; $i++) {
                $monthlyUploads[] = Document::where('user_id', $user->id)
                    ->whereYear('created_at', date('Y'))
                    ->whereMonth('created_at', $i)
                    ->count();
            }
            
            // Get department ranking (simplified - just return current month rank)
            $departmentRanking = Document::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->count();
            
            // Get top performing documents
            $topDocuments = Document::where('user_id', $user->id)
                ->where('status', 'approved')
                ->orderBy('downloads', 'desc')
                ->orderBy('views', 'desc')
                ->take(5)
                ->get()
                ->map(function ($doc) {
                    return [
                        'id' => $doc->id,
                        'title' => $doc->title,
                        'downloads' => $doc->downloads ?? 0,
                        'views' => $doc->views ?? 0,
                        'rating' => 4.5 // Placeholder rating
                    ];
                });

            // Calculate average response time (simplified)
            $averageResponseTime = 2; // Placeholder - 2 days average

            $analytics = [
                'totalDocuments' => $totalDocuments,
                'approvedDocuments' => $approvedDocuments,
                'pendingDocuments' => $pendingDocuments,
                'rejectedDocuments' => $rejectedDocuments,
                'totalDownloads' => $totalDownloads,
                'totalViews' => $totalViews,
                'approvalRate' => $approvalRate,
                'averageResponseTime' => $averageResponseTime,
                'monthlyUploads' => $monthlyUploads,
                'departmentRanking' => $departmentRanking,
                'topDocuments' => $topDocuments
            ];

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get categories for teacher upload form
     */
    public function getTeacherCategories(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Teacher privileges required.'
                ], 403);
            }

            $categories = Category::select('id', 'name', 'description')->get();

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get departments for teacher upload form
     */
    public function getTeacherDepartments(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Teacher privileges required.'
                ], 403);
            }

            $departments = Department::select('id', 'name', 'code')->get();

            return response()->json([
                'success' => true,
                'data' => $departments
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
     * Get teacher profile
     */
    public function getTeacherProfile(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Teacher privileges required.'
                ], 403);
            }

            // Get teacher statistics
            $totalDocuments = Document::where('user_id', $user->id)->count();
            $approvedDocuments = Document::where('user_id', $user->id)->where('status', 'approved')->count();
            $approvalRate = $totalDocuments > 0 ? round(($approvedDocuments / $totalDocuments) * 100, 2) : 0;

            $profile = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'department' => $user->department->name ?? '',
                'position' => $user->position ?? 'Teacher',
                'qualification' => $user->qualification ?? '',
                'specialization' => $user->specialization ?? '',
                'joinDate' => $user->created_at->format('Y-m-d'),
                'bio' => $user->bio ?? '',
                'officeLocation' => $user->office_location ?? '',
                'officeHours' => $user->office_hours ?? '',
                'totalDocuments' => $totalDocuments,
                'approvedDocuments' => $approvedDocuments,
                'approvalRate' => $approvalRate,
                'lastActivity' => $user->last_login_at ?? $user->updated_at->format('c')
            ];

            return response()->json([
                'success' => true,
                'data' => $profile
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch teacher profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Preview a document (for teachers)
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
        // Teachers can preview documents they uploaded OR documents they received feedback on
        $canPreview = false;
        
        // Check if user uploaded the document
        if ($document->user_id == $user->id) {
            $canPreview = true;
        }
        
        // Check if user received feedback on this document
        if (!$canPreview) {
            $hasFeedback = \App\Models\DocumentComment::where('document_id', $documentId)
                ->where('to_user_id', $user->id)
                ->exists();
            if ($hasFeedback) {
                $canPreview = true;
            }
        }
        
        // Log for debugging
        \Log::info('Teacher preview authorization check', [
            'user_id' => $user->id,
            'document_id' => $documentId,
            'document_user_id' => $document->user_id,
            'can_preview' => $canPreview,
            'is_uploader' => $document->user_id == $user->id
        ]);
        
        if (!$canPreview) {
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
            'details' => "Document previewed by teacher {$user->name}",
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
     * Download a document (for teachers)
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
        // Teachers can download documents they uploaded OR documents they received feedback on
        $canDownload = false;
        
        // Check if user uploaded the document
        if ($document->user_id == $user->id) {
            $canDownload = true;
        }
        
        // Check if user received feedback on this document
        if (!$canDownload) {
            $hasFeedback = \App\Models\DocumentComment::where('document_id', $documentId)
                ->where('to_user_id', $user->id)
                ->exists();
            if ($hasFeedback) {
                $canDownload = true;
            }
        }
        
        if (!$canDownload) {
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
            'details' => "Document downloaded by teacher {$user->name}",
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
     * Update teacher profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'teacher') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only teachers can update their profile.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'phone' => 'nullable|string|max:20',
            'qualification' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'officeLocation' => 'nullable|string|max:255',
            'officeHours' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->update([
                'phone' => $request->phone,
                'qualification' => $request->qualification,
                'specialization' => $request->specialization,
                'bio' => $request->bio,
                'office_location' => $request->officeLocation,
                'office_hours' => $request->officeHours,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'qualification' => $user->qualification,
                    'specialization' => $user->specialization,
                    'bio' => $user->bio,
                    'officeLocation' => $user->office_location,
                    'officeHours' => $user->office_hours,
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Profile update failed: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Profile update failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get comments for teacher's documents
     */
    public function getComments(): JsonResponse
    {
        $user = auth()->user();
        
        $comments = DocumentComment::where('to_user_id', $user->id)
            ->with(['document', 'fromUser'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    /**
     * Mark comment as read
     */
    public function markCommentAsRead($commentId): JsonResponse
    {
        $user = auth()->user();
        
        $comment = DocumentComment::where('id', $commentId)
            ->where('to_user_id', $user->id)
            ->first();

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found'
            ], 404);
        }

        $comment->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Comment marked as read'
        ]);
    }
}
