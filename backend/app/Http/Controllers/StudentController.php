<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Document;
use App\Models\DocumentAnalytics;
use App\Models\Bookmark;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    /**
     * Get student dashboard data
     */
    public function dashboard(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }
            
            // Get student statistics
            $stats = [
                'documentsAccessed' => DocumentAnalytics::where('user_id', $user->id)->where('action', 'view')->count(),
                'searchesThisWeek' => DocumentAnalytics::where('user_id', $user->id)
                    ->where('action', 'search_result')
                    ->where('created_at', '>=', now()->subWeek())
                    ->count(),
                'downloads' => DocumentAnalytics::where('user_id', $user->id)->where('action', 'download')->count(),
                'semesterDocuments' => Document::where('status', 'approved')
                    ->where('created_at', '>=', now()->subMonths(6))
                    ->count()
            ];

            // Get recent activity
            $recentActivity = DocumentAnalytics::where('user_id', $user->id)
                ->with(['document' => function($query) {
                    $query->select('id', 'title', 'document_type', 'department_id')
                          ->with(['department:id,name']);
                }])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($activity) {
                    return [
                        'id' => $activity->id,
                        'title' => $activity->document ? $activity->document->title : 'Document Deleted',
                        'type' => $activity->action,
                        'date' => $activity->created_at->format('Y-m-d H:i:s'),
                        'document_id' => $activity->document_id,
                        'department' => $activity->document && $activity->document->department 
                            ? $activity->document->department->name 
                            : 'Unknown'
                    ];
                });

            // Get recently viewed documents
            $recentlyViewedDocuments = DocumentAnalytics::where('user_id', $user->id)
                ->where('action', 'view')
                ->with(['document' => function($query) {
                    $query->select('id', 'title', 'description', 'document_type', 'views', 'downloads', 'department_id')
                          ->with(['department:id,name']);
                }])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($activity) {
                    if (!$activity->document) return null;
                    
                    return [
                        'id' => $activity->document->id,
                        'title' => $activity->document->title,
                        'description' => $activity->document->description,
                        'type' => $activity->document->document_type,
                        'department' => $activity->document->department ? $activity->document->department->name : 'Unknown',
                        'uploaded_by' => 'System', // We don't have uploader info in this query
                        'uploaded_at' => $activity->created_at->format('Y-m-d'),
                        'downloads' => $activity->document->downloads ?? 0,
                        'views' => $activity->document->views ?? 0
                    ];
                })
                ->filter(); // Remove null entries
            
            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user->load('department'),
                    'stats' => $stats,
                    'recentActivity' => $recentActivity,
                    'recentlyViewedDocuments' => $recentlyViewedDocuments
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
     * Get student bookmarks
     */
    public function getBookmarks(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }
            
            // Get bookmarks with document details
            $bookmarks = Bookmark::where('user_id', $user->id)
                ->with(['document' => function($query) {
                    $query->with('department');
                }])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($bookmark) {
                    $doc = $bookmark->document;
                    return [
                        'id' => $bookmark->id,
                        'document_id' => $doc->id,
                        'title' => $doc->title,
                        'author' => $doc->uploaded_by,
                        'department' => $doc->department->name ?? 'Unknown',
                        'type' => $doc->document_type,
                        'year' => date('Y', strtotime($doc->created_at)),
                        'bookmarkDate' => $bookmark->created_at->toISOString(),
                        'downloads' => $doc->downloads ?? 0,
                        'views' => $doc->views ?? 0,
                        'description' => $doc->description ?? 'No description available',
                        'keywords' => $doc->keywords ? json_decode($doc->keywords, true) : [],
                        'status' => $doc->status ?? 'approved'
                    ];
                });
            
            return response()->json([
                'success' => true,
                'data' => $bookmarks
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load bookmarks'
            ], 500);
        }
    }
    
    /**
     * Add bookmark
     */
    public function addBookmark(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }
            
            $request->validate([
                'document_id' => 'required|exists:documents,id'
            ]);
            
            $documentId = $request->document_id;
            
            // Check if bookmark already exists
            $existingBookmark = Bookmark::where('user_id', $user->id)
                ->where('document_id', $documentId)
                ->first();
            
            if ($existingBookmark) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document already bookmarked'
                ], 400);
            }
            
            // Create new bookmark
            Bookmark::create([
                'user_id' => $user->id,
                'document_id' => $documentId
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Bookmark added successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add bookmark'
            ], 500);
        }
    }
    
    /**
     * Remove bookmark
     */
    public function removeBookmark(Request $request, $id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }
            
            // Find and delete the bookmark
            $bookmark = Bookmark::where('id', $id)
                ->where('user_id', $user->id)
                ->first();
            
            if (!$bookmark) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bookmark not found'
                ], 404);
            }
            
            $bookmark->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Bookmark removed successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove bookmark'
            ], 500);
        }
    }
    
    /**
     * Get student history
     */
    public function getHistory(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }
            
            // Get student's document viewing and download history
            $history = DocumentAnalytics::where('user_id', $user->id)
                ->with(['document.department', 'document.category'])
                ->latest('created_at')
                ->get()
                ->map(function ($analytics) {
                    return [
                        'id' => $analytics->id,
                        'document_id' => $analytics->document_id,
                        'title' => $analytics->document->title ?? 'Unknown Document',
                        'department' => $analytics->document->department->name ?? 'Unknown',
                        'type' => $analytics->document->document_type ?? 'Unknown',
                        'action' => $analytics->action ?? 'viewed',
                        'date' => $analytics->created_at ? $analytics->created_at->format('Y-m-d H:i:s') : 'Unknown',
                        'views' => 0, // Not stored in analytics table
                        'downloads' => 0, // Not stored in analytics table
                        'description' => $analytics->document->description ?? 'No description available'
                    ];
                });
            
            return response()->json([
                'success' => true,
                'data' => $history
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load history'
            ], 500);
        }
    }
    
    /**
     * Get student documents
     */
    public function documents(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }
            
            // Get documents available to students
            $documents = Document::where('status', 'approved')
                ->where('department_id', $user->department_id)
                ->with(['user', 'category', 'department'])
                ->latest()
                ->paginate(20);
            
            return response()->json([
                'success' => true,
                'data' => $documents
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load documents'
            ], 500);
        }
    }
    
    /**
     * Preview document
     */
    public function previewDocument(Request $request, $id)
    {
        try {
            $user = Auth::user();
            
            // Find the document
            $document = Document::findOrFail($id);
            
            // Check if file exists
            if (!Storage::disk('public')->exists($document->file_path)) {
                abort(404, 'File not found');
            }
            
            // Increment view count
            $document->increment('views');
            
            // Return the file for preview
            $filePath = Storage::disk('public')->path($document->file_path);
            return response()->file($filePath);
            
        } catch (\Exception $e) {
            abort(404, 'Document not found');
        }
    }

    /**
     * Download document
     */
    public function downloadDocument(Request $request, $id)
    {
        try {
            $user = Auth::user();
            
            // Find the document
            $document = Document::findOrFail($id);
            
            // Check if file exists
            if (!Storage::disk('public')->exists($document->file_path)) {
                abort(404, 'File not found');
            }
            
            // Increment download count
            $document->increment('downloads');
            
            // Return the file for download
            $filePath = Storage::disk('public')->path($document->file_path);
            return response()->download($filePath);
            
        } catch (\Exception $e) {
            abort(404, 'Document not found');
        }
    }

    /**
     * Get student profile
     */
    public function getProfile(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }
            
            // Get user with department
            $userWithDept = $user->load('department');
            
            // Create profile data structure
            $profileData = [
                'id' => $user->student_id ?? $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? null,
                'department' => $userWithDept->department->name ?? null,
                'college' => 'Addis Ababa Science and Technology University',
                'joinDate' => $user->created_at ? $user->created_at->format('Y-m-d') : null,
                'address' => $user->address ?? null,
                'bio' => $user->bio ?? null,
                'status' => $user->status ?? 'active',
                'lastLogin' => $user->last_login_at ? $user->last_login_at->format('Y-m-d H:i:s') : null
            ];
            
            return response()->json([
                'success' => true,
                'data' => $profileData
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load profile data'
            ], 500);
        }
    }

    /**
     * Update student profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }
            
            $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
                'address' => 'sometimes|string|max:500',
                'bio' => 'sometimes|string|max:1000'
            ]);
            
            // Update user fields
            $user->update($request->only(['name', 'phone', 'address', 'bio']));
            
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user->fresh()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile'
            ], 500);
        }
    }

    /**
     * Search documents for students
     */
    public function searchDocuments(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }
            
            // Build query for ALL approved documents (not limited to student's department)
            $query = Document::with(['uploader', 'department', 'category'])
                ->where('status', 'approved');
            
            // Apply search filters
            if ($request->has('search_query') && $request->search_query) {
                $search = $request->search_query;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('author', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('tags', 'like', "%{$search}%");
                });
            }
            
            // Apply document type filter
            if ($request->has('document_type') && $request->document_type !== 'all') {
                $query->where('document_type', $request->document_type);
            }
            
            // Apply department filter (if specified, otherwise show all)
            if ($request->has('department') && $request->department !== 'all') {
                $query->where('department_id', $request->department);
            }
            
            // Apply year filter
            if ($request->has('year') && $request->year !== 'all') {
                $query->where('year', $request->year);
            }
            
            // Apply sorting
            $sortBy = $request->get('sort_by', 'date-desc');
            switch ($sortBy) {
                case 'date-asc':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'date-desc':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'title-asc':
                    $query->orderBy('title', 'asc');
                    break;
                case 'title-desc':
                    $query->orderBy('title', 'desc');
                    break;
                case 'downloads-desc':
                    $query->orderBy('downloads', 'desc');
                    break;
                case 'views-desc':
                    $query->orderBy('views', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
            
            $documents = $query->paginate(20);
            
            // Transform data for frontend
            $transformedDocuments = $documents->getCollection()->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'author' => $doc->author,
                    'department' => $doc->department ? $doc->department->name : 'Unknown',
                    'type' => $doc->document_type,
                    'date' => $doc->created_at->format('Y-m-d'),
                    'year' => $doc->year,
                    'downloads' => $doc->downloads ?? 0,
                    'description' => $doc->description ?? '',
                    'keywords' => $doc->tags ? explode(',', $doc->tags) : [],
                    'fileSize' => $doc->file_size ? $this->formatFileSize($doc->file_size) : null,
                    'views' => $doc->views ?? 0,
                    'approval_status' => $doc->status,
                    'file_format' => $doc->file_type ? strtoupper(pathinfo($doc->file_path, PATHINFO_EXTENSION)) : 'PDF',
                    'uploaded_by' => $doc->uploader ? $doc->uploader->name : 'Unknown',
                    'uploaded_at' => $doc->created_at->format('Y-m-d H:i:s')
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
                'message' => 'Failed to search documents'
            ], 500);
        }
    }

    /**
     * Format file size
     */
    private function formatFileSize($bytes)
    {
        if ($bytes === 0) return "0 Bytes";
        $k = 1024;
        $sizes = ["Bytes", "KB", "MB", "GB"];
        $i = floor(log($bytes) / log($k));
        return round($bytes / pow($k, $i), 2) . " " . $sizes[$i];
    }
}
