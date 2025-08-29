<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API Documentation
Route::get('/', function () {
    return response()->json([
        'message' => 'AASTU Academic Archive API',
        'version' => '1.0.0',
        'status' => 'running',
        'frontend_url' => 'http://localhost:3000',
        'documentation' => [
            'authentication' => 'Use POST /api/login with email and password',
            'student_endpoints' => [
                'GET /api/student/search-documents' => 'Search and browse documents',
                'GET /api/student/exam-materials' => 'Get exam materials',
                'GET /api/student/videos' => 'Get educational videos',
                'GET /api/student/suggestions' => 'Get personalized suggestions',
                'GET /api/student/stats' => 'Get student dashboard stats'
            ],
            'teacher_endpoints' => [
                'GET /api/teacher/documents' => 'Get teacher documents',
                'POST /api/teacher/upload-document' => 'Upload new document',
                'GET /api/teacher/stats' => 'Get teacher dashboard stats'
            ],
            'department_head_endpoints' => [
                'GET /api/department/pending-documents' => 'Get pending documents for approval',
                'POST /api/department/review-document/{id}' => 'Approve/reject document',
                'GET /api/department/stats' => 'Get department dashboard stats'
            ],
            'document_endpoints' => [
                'GET /api/documents/{id}/preview' => 'Preview document (requires auth)',
                'GET /api/documents/{id}/download' => 'Download document (requires auth)'
            ]
        ]
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// User profile endpoint
Route::middleware('auth:sanctum')->get('/user/profile', function (Request $request) {
    $user = $request->user()->load('department');
    return response()->json([
        'success' => true,
        'data' => $user
    ]);
});

// Authentication API routes
Route::post('/login', [AuthenticatedSessionController::class, 'apiLogin']);
Route::post('/register', [RegisteredUserController::class, 'apiRegister']);
Route::post('/logout', [AuthenticatedSessionController::class, 'apiLogout'])->middleware('auth:sanctum');

// Get departments for registration
Route::get('/departments', function () {
    return \App\Models\Department::all();
});

// Student dashboard API routes (protected by auth)
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard routes
    Route::get('/student/stats', [App\Http\Controllers\DocumentController::class, 'getStudentStats']);
    Route::get('/student/recent-activity', [App\Http\Controllers\DocumentController::class, 'getStudentRecentActivity']);
    Route::get('/student/recent-documents', [App\Http\Controllers\DocumentController::class, 'getRecentlyAddedDocuments']);
    Route::get('/student/recently-viewed-documents', [App\Http\Controllers\DocumentController::class, 'getRecentlyViewedDocuments']);
    Route::get('/student/department-documents', [App\Http\Controllers\DocumentController::class, 'getDepartmentDocuments']);
    
    // Browse routes
    Route::get('/student/search-documents', [App\Http\Controllers\DocumentController::class, 'searchDocuments']);
    
    // Exam materials routes
    Route::get('/student/exam-materials', [App\Http\Controllers\DocumentController::class, 'getExamMaterials']);
    
    // Suggestions routes
    Route::get('/student/suggestions', [App\Http\Controllers\DocumentController::class, 'getSuggestions']);
    
    // Video library routes
    Route::get('/student/videos', [App\Http\Controllers\DocumentController::class, 'getVideos']);
    
    // Study groups routes
    Route::get('/student/study-groups', [App\Http\Controllers\DocumentController::class, 'getStudyGroups']);
    
    // Calendar routes
    Route::get('/student/calendar-events', [App\Http\Controllers\DocumentController::class, 'getCalendarEvents']);
    
    // Profile routes
    Route::get('/student/profile', [App\Http\Controllers\DocumentController::class, 'getStudentProfile']);
    Route::put('/student/profile', [App\Http\Controllers\DocumentController::class, 'updateStudentProfile']);
    
    // Tracking routes
    Route::post('/track/view', [App\Http\Controllers\DocumentController::class, 'trackDocumentView']);
    Route::post('/track/download', [App\Http\Controllers\DocumentController::class, 'trackDocumentDownload']);
    Route::post('/track/search', [App\Http\Controllers\DocumentController::class, 'trackSearch']);
});

// Teacher API routes (protected by auth)
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard routes
    Route::get('/teacher/stats', [App\Http\Controllers\TeacherController::class, 'getTeacherStats']);
    Route::get('/teacher/documents', [App\Http\Controllers\TeacherController::class, 'getTeacherDocuments']);
    Route::get('/teacher/pending-approval', [App\Http\Controllers\TeacherController::class, 'getTeacherPendingApproval']);
    
    // Upload routes
    Route::post('/teacher/upload-document', [App\Http\Controllers\TeacherController::class, 'uploadDocument']);
    Route::get('/teacher/categories', [App\Http\Controllers\TeacherController::class, 'getTeacherCategories']);
    Route::get('/teacher/departments', [App\Http\Controllers\TeacherController::class, 'getTeacherDepartments']);
    
    // Document management routes
    Route::put('/teacher/documents/{id}', [App\Http\Controllers\TeacherController::class, 'updateDocument']);
    Route::delete('/teacher/documents/{id}', [App\Http\Controllers\TeacherController::class, 'deleteDocument']);
    
    // Analytics routes
    Route::get('/teacher/analytics', [App\Http\Controllers\TeacherController::class, 'getTeacherAnalytics']);
    
    // Reviews routes
    Route::get('/teacher/reviews', [App\Http\Controllers\TeacherController::class, 'getTeacherReviews']);
    
    // Schedule routes
    Route::get('/teacher/schedule', [App\Http\Controllers\TeacherController::class, 'getTeacherSchedule']);
    Route::post('/teacher/schedule', [App\Http\Controllers\TeacherController::class, 'addScheduleItem']);
    Route::post('/teacher/deadline', [App\Http\Controllers\TeacherController::class, 'addDeadline']);
    Route::post('/teacher/office-hour', [App\Http\Controllers\TeacherController::class, 'addOfficeHour']);
    
    // Student feedback routes
    Route::get('/teacher/student-feedback', [App\Http\Controllers\TeacherController::class, 'getTeacherStudentFeedback']);
});

// Department Head API routes (protected by auth)
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard routes
    Route::get('/department/stats', [App\Http\Controllers\DepartmentHeadController::class, 'getDashboardStats']);
    
    // Document approval routes
    Route::get('/department/pending-documents', [App\Http\Controllers\DepartmentHeadController::class, 'getPendingDocuments']);
    Route::post('/department/review-document/{id}', [App\Http\Controllers\DepartmentHeadController::class, 'reviewDocument']);
    Route::post('/department/bulk-review-documents', [App\Http\Controllers\DepartmentHeadController::class, 'bulkReviewDocuments']);
    
    // Faculty management routes
    Route::get('/department/faculty', [App\Http\Controllers\DepartmentHeadController::class, 'getDepartmentFaculty']);
    
    // Analytics routes
    Route::get('/department/analytics', [App\Http\Controllers\DepartmentHeadController::class, 'getDepartmentAnalytics']);
    
    // Reports routes
    Route::get('/department/reports', [App\Http\Controllers\DepartmentHeadController::class, 'getDepartmentReports']);
});

// Document preview/download route (protected by auth)
Route::middleware('auth:sanctum')->get('/documents/{id}/preview', [App\Http\Controllers\DocumentController::class, 'previewDocument']);
Route::middleware('auth:sanctum')->get('/documents/{id}/download', [App\Http\Controllers\DocumentController::class, 'downloadDocument']);
