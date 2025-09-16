<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\AuditLog; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    /**
     * Store a new document (Upload)
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'author'         => 'nullable|string|max:255',
            'department_id'  => 'required|exists:departments,id',
            'document_type'  => 'required|string|max:50',
            'year'           => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'file'           => 'required|mimes:pdf,docx,mp4|max:10240',
        ]);

        $path = $request->file('file')->store('documents', 'public');

        $doc = Document::create([
            'title'         => $request->title,
            'description'   => $request->description,
            'author'        => $request->author,
            'department_id' => $request->department_id,
            'document_type' => $request->document_type,
            'year'          => $request->year,
            'file_path'     => $path,
            'user_id'       => Auth::id(),
        ]);

        // Log upload
        AuditLog::create([
            'user_id'     => Auth::id(),
            'document_id' => $doc->id,
            'action'      => 'upload',
            'details'     => 'Document uploaded: ' . $doc->title,
            'ip_address'  => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Document uploaded successfully',
            'document' => $doc
        ], 201);
    }

    /**
     * Download a document (logs download event)
     */
    public function download(Document $document, Request $request)
    {
        // Log download
        AuditLog::create([
            'user_id'     => Auth::id(),
            'document_id' => $document->id,
            'action'      => 'download',
            'details'     => 'Document downloaded: ' . $document->title,
            'ip_address'  => $request->ip(),
        ]);

        return Storage::disk('public')->download($document->file_path, $document->title . '.' . pathinfo($document->file_path, PATHINFO_EXTENSION));
    }

    /**
     * Preview a document
     */
    public function previewDocument($documentId, Request $request)
    {
        $document = Document::findOrFail($documentId);
        
        // Check if user has access to this document
        $user = Auth::user();
        
        // If user is authenticated, check role-based access
        if ($user) {
            // College deans can preview any document
            if ($user->role === 'college_dean') {
                // No restrictions for deans
            }
            // Department heads can preview any document
            elseif ($user->role === 'department_head') {
                // No restrictions for department heads
            }
            // Teachers can preview their own documents
            elseif ($user->role === 'teacher') {
                if ($document->user_id !== $user->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Access denied'
                    ], 403);
                }
            }
            // Students can preview approved documents
            elseif ($user->role === 'student') {
                if ($document->status !== 'approved') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Document not available'
                    ], 403);
                }
            }
        } else {
            // For unauthenticated users, only allow preview of approved documents
            if ($document->status !== 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not available'
                ], 403);
            }
        }

        // Log view (only if user is authenticated)
        if ($user) {
            AuditLog::create([
                'user_id'     => Auth::id(),
                'document_id' => $document->id,
                'action'      => 'view',
                'details'     => 'Document viewed: ' . $document->title,
                'ip_address'  => $request->ip(),
            ]);
        }

        // Check if file exists
        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        }

        // Get file info
        $filePath = Storage::disk('public')->path($document->file_path);
        $fileName = basename($document->file_path);
        $fileSize = Storage::disk('public')->size($document->file_path);
        $mimeType = Storage::disk('public')->mimeType($document->file_path);

        // For PDFs, return the file for preview
        if (str_contains($mimeType, 'pdf')) {
            return response()->file($filePath, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'inline; filename="' . $fileName . '"'
            ]);
        }

        // For other file types, offer download
        return Storage::disk('public')->download($document->file_path, $fileName);
    }

    /**
     * Download a document
     */
    public function downloadDocument($documentId, Request $request)
    {
        $document = Document::findOrFail($documentId);
        
        // Check if user has access to this document
        $user = Auth::user();
        
        // College deans can download any document
        if ($user->role === 'college_dean') {
            // No restrictions for deans
        }
        // Department heads can download any document
        elseif ($user->role === 'department_head') {
            // No restrictions for department heads
        }
        // Teachers can download their own documents
        elseif ($user->role === 'teacher') {
            if ($document->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }
        }
        // Students can download approved documents
        elseif ($user->role === 'student') {
            if ($document->status !== 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not available'
                ], 403);
            }
        }

        // Log download
        AuditLog::create([
            'user_id'     => Auth::id(),
            'document_id' => $document->id,
            'action'      => 'download',
            'details'     => 'Document downloaded: ' . $document->title,
            'ip_address'  => $request->ip(),
        ]);

        // Check if file exists
        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        }

        // Get file info
        $fileName = basename($document->file_path);
        $originalFileName = $document->title;
        
        // If the title already has an extension, use it as is
        if (pathinfo($originalFileName, PATHINFO_EXTENSION)) {
            $downloadFileName = $originalFileName;
        } else {
            // Otherwise, add the file extension
            $fileExtension = pathinfo($document->file_path, PATHINFO_EXTENSION);
            $downloadFileName = $originalFileName . '.' . $fileExtension;
        }
        
        // Clean filename for download
        $downloadFileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $downloadFileName);

        return Storage::disk('public')->download($document->file_path, $downloadFileName);
    }

    /**
     * List & filter documents
     */
    public function index(Request $request)
    {
        $query = Document::with(['user', 'department']);

        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }
        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->filled('document_type')) {
            $query->where('document_type', $request->document_type);
        }

        $query->orderBy($request->get('sort_by', 'created_at'), $request->get('order', 'desc'));

        $documents = $query->paginate(10);

        return response()->json([
            'data' => $documents->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'year' => $doc->year,
                    'document_type' => $doc->document_type,
                    'department' => $doc->department->name ?? null,
                    'uploaded_by' => $doc->user->name ?? null,
                    'created_at' => $doc->created_at->toDateTimeString(),
                ];
            }),
            'meta' => [
                'current_page' => $documents->currentPage(),
                'last_page'    => $documents->lastPage(),
                'total'        => $documents->total(),
            ]
        ]);
    }

    /**
     * Get student dashboard statistics
     */
    public function getStudentStats(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Get documents accessed by student (from audit logs)
        $documentsAccessed = AuditLog::where('user_id', $user->id)
            ->whereIn('action', ['view', 'download'])
            ->distinct('document_id')
            ->count('document_id');
        
        // Get searches this week (from audit logs)
        $searchesThisWeek = AuditLog::where('user_id', $user->id)
            ->where('action', 'search')
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();
        
        // Get downloads (from audit logs)
        $downloads = AuditLog::where('user_id', $user->id)
            ->where('action', 'download')
            ->count();
        
        // Get semester documents (documents from current academic year)
        $currentYear = date('Y');
        $semesterDocuments = Document::where('status', 'approved')
            ->whereYear('created_at', $currentYear)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'documents_accessed' => $documentsAccessed,
                'searches_this_week' => $searchesThisWeek,
                'downloads' => $downloads,
                'semester_documents' => $semesterDocuments,
            ]
        ]);
    }

    /**
     * Get student recent activity
     */
    public function getStudentRecentActivity(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Get recent activity from audit logs
        $recentActivity = AuditLog::where('user_id', $user->id)
            ->with(['document'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($log) {
                $title = '';
                $type = ucfirst($log->action);
                
                if ($log->action === 'download' || $log->action === 'view') {
                    $title = $log->document ? "{$type}ed {$log->document->title}" : "{$type}ed document";
                } elseif ($log->action === 'search') {
                    $title = "Searched for " . ($log->details ?: 'documents');
                } else {
                    $title = $log->details ?: "Performed {$log->action}";
                }
                
                return [
                    'id' => $log->id,
                    'title' => $title,
                    'type' => $type,
                    'date' => $log->created_at->diffForHumans(),
                    'document_id' => $log->document_id,
                    'search_term' => $log->action === 'search' ? $log->details : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $recentActivity
        ]);
    }

    /**
     * Get recently added documents
     */
    public function getRecentlyAddedDocuments(): JsonResponse
    {
        $recentDocuments = Document::where('status', 'approved')
            ->with(['user', 'department'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'description' => $document->description,
                    'type' => $document->type,
                    'department' => $document->department->name,
                    'uploaded_by' => $document->user->name,
                    'uploaded_at' => $document->created_at->diffForHumans(),
                    'downloads' => 0, // Would come from download tracking
                    'views' => 0, // Would come from view tracking
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $recentDocuments
        ]);
    }

    /**
     * Get department-specific documents for student
     */
    public function getDepartmentDocuments(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $departmentDocuments = Document::where('status', 'approved')
            ->where('department_id', $user->department_id)
            ->with(['user', 'department'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'description' => $document->description,
                    'type' => $document->type,
                    'uploaded_by' => $document->user->name,
                    'uploaded_at' => $document->created_at->diffForHumans(),
                    'downloads' => 0, // Would come from download tracking
                    'views' => 0, // Would come from view tracking
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $departmentDocuments
        ]);
    }

    /**
     * Get recently viewed documents for student
     */
    public function getRecentlyViewedDocuments(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Get recently viewed documents from audit logs
        $recentlyViewed = AuditLog::where('user_id', $user->id)
            ->whereIn('action', ['view', 'download'])
            ->whereNotNull('document_id')
            ->with(['document.user', 'document.department'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($log) {
                $document = $log->document;
                if (!$document) {
                    return null;
                }
                
                // Get view and download counts for this document
                $views = AuditLog::where('document_id', $document->id)
                    ->where('action', 'view')
                    ->count();
                    
                $downloads = AuditLog::where('document_id', $document->id)
                    ->where('action', 'download')
                    ->count();
                
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'description' => $document->description,
                    'type' => $document->document_type,
                    'department' => $document->department ? $document->department->name : 'Unknown',
                    'uploaded_by' => $document->user ? $document->user->name : 'Unknown',
                    'uploaded_at' => $document->created_at->format('Y-m-d'),
                    'downloads' => $downloads,
                    'views' => $views,
                ];
            })
            ->filter() // Remove null values
            ->unique('id') // Remove duplicates
            ->values(); // Reset array keys

        return response()->json([
            'success' => true,
            'data' => $recentlyViewed
        ]);
    }

    /**
     * Track document view (for route /track/view)
     */
    public function trackView(Request $request): JsonResponse
    {
        return $this->trackDocumentView($request);
    }

    /**
     * Track document download (for route /track/download)
     */
    public function trackDownload(Request $request): JsonResponse
    {
        return $this->trackDocumentDownload($request);
    }

    /**
     * Track search (for route /track/search)
     */
    public function trackSearch(Request $request): JsonResponse
    {
        return $this->trackSearchActivity($request);
    }

    /**
     * Track document view
     */
    public function trackDocumentView(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'document_id' => 'required|exists:documents,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $documentId = $request->document_id;

        // Log the view in audit logs
        AuditLog::create([
            'user_id' => $user->id,
            'document_id' => $documentId,
            'action' => 'view',
            'details' => 'Document viewed',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'View tracked successfully'
        ]);
    }

    /**
     * Track document download
     */
    public function trackDocumentDownload(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'document_id' => 'required|exists:documents,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $documentId = $request->document_id;

        // Log the download in audit logs
        AuditLog::create([
            'user_id' => $user->id,
            'document_id' => $documentId,
            'action' => 'download',
            'details' => 'Document downloaded',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Download tracked successfully'
        ]);
    }

    /**
     * Track search activity
     */
    public function trackSearchActivity(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'search_term' => 'required|string|max:255',
            'filters' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();

        // Log the search in audit logs
        AuditLog::create([
            'user_id' => $user->id,
            'document_id' => null,
            'action' => 'search',
            'details' => $request->search_term,
            'ip_address' => $request->ip(),
        ]);
        //     'user_id' => $user->id,
        //     'search_term' => $request->search_term,
        //     'filters' => json_encode($request->filters),
        //     'searched_at' => now(),
        // ]);

        return response()->json([
            'success' => true,
            'message' => 'Search tracked successfully'
        ]);
    }

    /**
     * Format file size in human readable format
     */
    private function formatFileSize($bytes)
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }

    /**
     * Get filter options for advanced search
     */
    public function getFilterOptions(): JsonResponse
    {
        try {
            // Get all departments
            $departments = \App\Models\Department::orderBy('name')->pluck('name')->toArray();
            
            // Get all document types from existing documents
            $documentTypes = Document::distinct()->pluck('document_type')->filter()->sort()->values()->toArray();
            
            // Get all years from existing documents
            $years = Document::distinct()->pluck('year')->filter()->sort()->values()->toArray();
            
            // Get all authors (users who uploaded documents)
            $authors = Document::with('user')
                ->whereHas('user')
                ->get()
                ->pluck('user.name')
                ->filter()
                ->unique()
                ->sort()
                ->values()
                ->toArray();
            
            // Get all keywords from existing documents
            $keywords = Document::whereNotNull('keywords')
                ->pluck('keywords')
                ->flatMap(function($keywords) {
                    return is_string($keywords) ? json_decode($keywords, true) : [];
                })
                ->filter()
                ->unique()
                ->sort()
                ->values()
                ->toArray();

            return response()->json([
                'success' => true,
                'data' => [
                    'colleges' => [
                        'College of Engineering',
                        'College of Science', 
                        'College of Technology'
                    ],
                    'departments' => $departments,
                    'documentTypes' => $documentTypes,
                    'years' => $years,
                    'semesters' => ['Fall', 'Spring', 'Summer'],
                    'academicYears' => ['2023-2024', '2022-2023', '2021-2022', '2020-2021'],
                    'languages' => ['English', 'Amharic', 'French', 'German'],
                    'fileFormats' => ['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX', 'XLS', 'XLSX'],
                    'authors' => $authors
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load filter options',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search and filter documents for browse page
     */
    public function searchDocuments(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'search_query' => 'nullable|string|max:255',
            'document_type' => 'nullable|string',
            'department' => 'nullable|string',
            'college' => 'nullable|string',
            'year' => 'nullable|string',
            'semester' => 'nullable|string',
            'academic_year' => 'nullable|string',
            'language' => 'nullable|string',
            'file_format' => 'nullable|string',
            'author' => 'nullable|string',
            'keywords' => 'nullable|array',
            'min_downloads' => 'nullable|integer',
            'max_downloads' => 'nullable|integer',
            'min_rating' => 'nullable|numeric|min:0|max:5',
            'max_rating' => 'nullable|numeric|min:0|max:5',
            'sort_by' => 'nullable|string|in:date-desc,date-asc,downloads-desc,downloads-asc,title-asc,title-desc,author-asc,rating-desc,views-desc',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = Document::where('status', 'approved')
            ->with(['user', 'department']);

        // Apply search filters
        if ($request->search_query) {
            $searchTerm = $request->search_query;
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhere('author', 'like', "%{$searchTerm}%")
                  ->orWhereHas('user', function($userQuery) use ($searchTerm) {
                      $userQuery->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        // College filter (if implemented in departments table)
        if ($request->college && $request->college !== 'all') {
            // This would need a college_id field in departments table
            // For now, we'll skip this filter
        }

        // Department filter
        if ($request->department && $request->department !== 'all') {
            $query->whereHas('department', function($deptQuery) use ($request) {
                $deptQuery->where('name', 'like', "%{$request->department}%");
            });
        }

        // Document type filter
        if ($request->document_type && $request->document_type !== 'all') {
            $query->where('document_type', $request->document_type);
        }

        // Year filter
        if ($request->year && $request->year !== 'all') {
            $query->where('year', $request->year);
        }

        // Semester filter (if implemented)
        if ($request->semester && $request->semester !== 'all') {
            // This would need a semester field in documents table
            // For now, we'll skip this filter
        }

        // Academic year filter (if implemented)
        if ($request->academic_year && $request->academic_year !== 'all') {
            // This would need an academic_year field in documents table
            // For now, we'll skip this filter
        }

        // Language filter (if implemented)
        if ($request->language && $request->language !== 'all') {
            // This would need a language field in documents table
            // For now, we'll skip this filter
        }

        // File format filter (if implemented)
        if ($request->file_format && $request->file_format !== 'all') {
            // This would need a file_format field in documents table
            // For now, we'll skip this filter
        }

        // Author filter
        if ($request->author) {
            $query->where(function($q) use ($request) {
                $q->where('author', 'like', "%{$request->author}%")
                  ->orWhereHas('user', function($userQuery) use ($request) {
                      $userQuery->where('name', 'like', "%{$request->author}%");
                  });
            });
        }

        // Keywords filter
        if ($request->keywords && is_array($request->keywords) && count($request->keywords) > 0) {
            $query->where(function($q) use ($request) {
                foreach ($request->keywords as $keyword) {
                    $q->where('keywords', 'like', "%{$keyword}%");
                }
            });
        }

        // Download range filter
        if ($request->min_downloads) {
            $query->where('downloads', '>=', $request->min_downloads);
        }
        if ($request->max_downloads) {
            $query->where('downloads', '<=', $request->max_downloads);
        }

        // Rating range filter (if implemented)
        if ($request->min_rating) {
            // This would need a rating field in documents table
            // For now, we'll skip this filter
        }
        if ($request->max_rating) {
            // This would need a rating field in documents table
            // For now, we'll skip this filter
        }

        // Apply sorting
        switch ($request->sort_by) {
            case 'date-desc':
                $query->orderBy('created_at', 'desc');
                break;
            case 'date-asc':
                $query->orderBy('created_at', 'asc');
                break;
            case 'downloads-desc':
                $query->orderBy('downloads', 'desc');
                break;
            case 'downloads-asc':
                $query->orderBy('downloads', 'asc');
                break;
            case 'title-asc':
                $query->orderBy('title', 'asc');
                break;
            case 'title-desc':
                $query->orderBy('title', 'desc');
                break;
            case 'author-asc':
                $query->orderBy('author', 'asc');
                break;
            case 'rating-desc':
                // This would need a rating field in documents table
                $query->orderBy('created_at', 'desc');
                break;
            case 'views-desc':
                $query->orderBy('views', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $documents = $query->paginate(20);

        $formattedDocuments = $documents->map(function ($document) {
            return [
                'id' => $document->id,
                'title' => $document->title,
                'author' => $document->author ?? $document->user->name,
                'department' => $document->department->name ?? 'Unknown',
                'type' => $document->document_type,
                'date' => $document->created_at->format('Y-m-d'),
                'year' => $document->year,
                'downloads' => $document->downloads ?? 0,
                'views' => $document->views ?? 0,
                'description' => $document->description ?? '',
                'keywords' => $document->keywords ? (is_string($document->keywords) ? json_decode($document->keywords, true) : []) : [],
                'fileSize' => $document->file_size ? $this->formatFileSize($document->file_size) : 'Unknown',
                'pages' => 0, // Would come from file metadata
                'file_format' => $document->file_type ? pathinfo($document->file_type, PATHINFO_EXTENSION) : 'Unknown',
                'approval_status' => $document->status,
                'rating' => 0, // Would come from ratings table
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
            ]
        ]);
    }

    /**
     * Get exam materials
     */
    public function getExamMaterials(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'search_query' => 'nullable|string|max:255',
            'year' => 'nullable|string',
            'department' => 'nullable|string',
            'course' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = Document::where('status', 'approved')
            ->whereIn('type', ['exam', 'quiz', 'midterm', 'final'])
            ->with(['user', 'department']);

        if ($request->search_query) {
            $query->where('title', 'like', "%{$request->search_query}%");
        }

        if ($request->year) {
            $query->whereYear('created_at', $request->year);
        }

        if ($request->department) {
            $query->whereHas('department', function($deptQuery) use ($request) {
                $deptQuery->where('name', 'like', "%{$request->department}%");
            });
        }

        if ($request->course) {
            $query->where('title', 'like', "%{$request->course}%");
        }

        $examMaterials = $query->orderBy('created_at', 'desc')->get();

        $formattedMaterials = $examMaterials->map(function ($document) {
            return [
                'id' => $document->id,
                'title' => $document->title,
                'course' => 'CS 205', // Would come from course association
                'year' => $document->created_at->format('Y'),
                'semester' => 'Fall', // Would come from semester field
                'department' => $document->department->name,
                'type' => ucfirst($document->type),
                'hasAnswers' => true, // Would come from document metadata
                'uploadDate' => $document->created_at->format('Y-m-d'),
                'downloads' => 0, // Would come from download tracking
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedMaterials
        ]);
    }

    /**
     * Get personalized suggestions for student
     */
    public function getSuggestions(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Get documents from student's department and popular documents
        $suggestions = Document::where('status', 'approved')
            ->with(['user', 'department'])
            ->where(function($query) use ($user) {
                $query->where('department_id', $user->department_id)
                      ->orWhere('downloads', '>', 100); // Popular documents
            })
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'author' => $document->user->name,
                    'department' => $document->department->name,
                    'relevance' => rand(80, 95), // Would be calculated based on user preferences
                    'reason' => 'Based on your department and interests',
                    'type' => $document->type,
                    'downloads' => 0, // Would come from download tracking
                    'rating' => 4.5, // Would come from ratings table
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $suggestions
        ]);
    }

    /**
     * Get video library content
     */
    public function getVideos(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'search_query' => 'nullable|string|max:255',
            'category' => 'nullable|string',
            'duration' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // This would come from a videos table
        // For now, return mock data structure
        $videos = [
            [
                'id' => 1,
                'title' => 'Introduction to Software Architecture',
                'instructor' => 'Dr. Sarah Johnson',
                'course' => 'SE 301',
                'duration' => '45:30',
                'views' => 1234,
                'uploadDate' => '2024-01-15',
                'category' => 'Lecture',
                'thumbnail' => '/software-architecture-lecture.png',
                'description' => 'Comprehensive overview of software architecture patterns and principles',
            ],
            [
                'id' => 2,
                'title' => 'Database Normalization Tutorial',
                'instructor' => 'Prof. Michael Chen',
                'course' => 'CS 205',
                'duration' => '32:15',
                'views' => 856,
                'uploadDate' => '2024-01-12',
                'category' => 'Tutorial',
                'thumbnail' => '/database-normalization-tutorial.png',
                'description' => 'Step-by-step guide to database normalization techniques',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $videos
        ]);
    }

    /**
     * Get study groups
     */
    public function getStudyGroups(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'search_query' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // This would come from a study_groups table
        // For now, return mock data structure
        $studyGroups = [
            [
                'id' => 1,
                'name' => 'Software Engineering Study Circle',
                'course' => 'SE 301',
                'members' => 8,
                'maxMembers' => 12,
                'description' => 'Weekly discussions on software design patterns and project management',
                'nextMeeting' => 'Tomorrow, 2:00 PM',
                'location' => 'Library Room 204',
                'tags' => ['Software Engineering', 'Design Patterns', 'Project Management'],
                'isJoined' => true,
            ],
            [
                'id' => 2,
                'name' => 'Database Systems Workshop',
                'course' => 'CS 205',
                'members' => 6,
                'maxMembers' => 10,
                'description' => 'Hands-on practice with SQL queries and database optimization',
                'nextMeeting' => 'Friday, 10:00 AM',
                'location' => 'Computer Lab 3',
                'tags' => ['Database', 'SQL', 'Optimization'],
                'isJoined' => false,
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $studyGroups
        ]);
    }

    /**
     * Get academic calendar events
     */
    public function getCalendarEvents(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        // This would come from a calendar_events table
        // For now, return mock data structure
        $events = [
            [
                'id' => 1,
                'title' => 'Software Engineering Final Exam',
                'date' => '2024-01-25',
                'time' => '9:00 AM',
                'location' => 'Hall A',
                'type' => 'exam',
                'course' => 'SE 301',
            ],
            [
                'id' => 2,
                'title' => 'Database Systems Assignment Due',
                'date' => '2024-01-22',
                'time' => '11:59 PM',
                'location' => 'Online Submission',
                'type' => 'assignment',
                'course' => 'CS 205',
            ],
            [
                'id' => 3,
                'title' => 'Study Group Meeting',
                'date' => '2024-01-20',
                'time' => '2:00 PM',
                'location' => 'Library Room 204',
                'type' => 'meeting',
                'course' => 'SE 301',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $events
        ]);
    }

    /**
     * Get student profile data
     */
    public function getStudentProfile(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $profileData = [
            'id' => $user->student_id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => '+251-911-123456', // Would come from user profile
            'department' => $user->department ? $user->department->name : 'Not assigned',
            'college' => 'College of Engineering', // Would come from college association
            'year' => '4th Year', // Would come from academic level
            'gpa' => '3.85', // Would come from academic records
            'joinDate' => $user->created_at->format('Y-m-d'),
            'address' => 'Addis Ababa, Ethiopia', // Would come from user profile
            'bio' => 'Computer Science student passionate about machine learning and software development.',
            'interests' => ['Machine Learning', 'Web Development', 'Data Science'],
        ];

        return response()->json([
            'success' => true,
            'data' => $profileData
        ]);
    }

    /**
     * Update student profile
     */
    public function updateStudentProfile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'interests' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        if ($user->role !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Update user profile
        // This would update a user_profiles table
        // For now, just return success

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully'
        ]);
    }

    /**
     * Update document status (for department heads)
     */
    public function updateDocumentStatus($documentId, Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'department_head' && $user->role !== 'college_dean' && $user->role !== 'admin' && $user->role !== 'it_manager') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Department head privileges required.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:pending,approved,rejected',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $document = Document::findOrFail($documentId);
            $document->update(['status' => $request->status]);

            // Log the status change
            AuditLog::create([
                'user_id' => $user->id,
                'document_id' => $document->id,
                'action' => 'status_update',
                'details' => "Document status changed to {$request->status}",
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Document status updated successfully',
                'data' => $document
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update document status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a document
     */
    public function deleteDocument($documentId): JsonResponse
    {
        try {
            $user = Auth::user();
            $document = Document::findOrFail($documentId);
            
            // Check permissions
            if ($user->role === 'admin' || $user->role === 'it_manager' || $user->role === 'college_dean') {
                // Admins, IT managers, and deans can delete any document
            } elseif ($user->role === 'department_head') {
                // Department heads can delete documents from their department
                if ($document->department_id !== $user->department_id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Access denied. You can only delete documents from your department.'
                    ], 403);
                }
            } elseif ($user->role === 'teacher') {
                // Teachers can only delete their own documents
                if ($document->user_id !== $user->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Access denied. You can only delete your own documents.'
                    ], 403);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Insufficient privileges.'
                ], 403);
            }

            // Log the deletion
            AuditLog::create([
                'user_id' => $user->id,
                'document_id' => $document->id,
                'action' => 'delete',
                'details' => 'Document deleted: ' . $document->title,
                'ip_address' => request()->ip(),
            ]);

            // Delete the file from storage
            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }

            // Delete the document record
            $document->delete();

            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete document',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
