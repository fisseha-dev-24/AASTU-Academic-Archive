<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DeanController;
use App\Http\Controllers\DepartmentHeadController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\WebSocketController;
use App\Http\Controllers\BackupController;

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

// Public routes
Route::post('/auth/login', [AuthenticatedSessionController::class, 'apiLogin']);
// Registration disabled for security - users are created by administrators only
Route::post('/auth/register', function () {
    return response()->json([
        'success' => false,
        'message' => 'Registration is disabled. Users are created by administrators only.',
        'error' => 'Contact your system administrator to create an account.'
    ], 403);
});
Route::post('/auth/refresh', [AuthenticatedSessionController::class, 'apiRefresh']);
Route::get('/departments', [DeanController::class, 'getDepartments']);

// Public upload route removed - now protected in teacher group

// Public preview and download routes (no authentication required)
Route::get('/documents/{id}/preview', [StudentController::class, 'previewDocument']);
Route::get('/documents/{id}/download', [StudentController::class, 'downloadDocument']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // User profile
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });
    
    // WebSocket token
    Route::get('/websocket/token', [WebSocketController::class, 'getToken']);
    
    // Student routes
    Route::prefix('student')->group(function () {
        Route::get('/profile', [StudentController::class, 'getProfile']);
        Route::put('/profile', [StudentController::class, 'updateProfile']);
        Route::get('/dashboard', [StudentController::class, 'dashboard']);
        Route::get('/documents', [StudentController::class, 'documents']);
        Route::get('/search-documents', [StudentController::class, 'searchDocuments']);
        Route::get('/history', [StudentController::class, 'getHistory']);
        Route::get('/bookmarks', [StudentController::class, 'getBookmarks']);
        Route::post('/bookmarks', [StudentController::class, 'addBookmark']);
        Route::delete('/bookmarks/{id}', [StudentController::class, 'removeBookmark']);
    });
    
    // Teacher routes
    Route::prefix('teacher')->group(function () {
        Route::get('/profile', [TeacherController::class, 'getProfile']);
        Route::put('/profile', [TeacherController::class, 'updateProfile']);
        Route::get('/analytics', [TeacherController::class, 'getAnalytics']);
        Route::get('/dashboard', [TeacherController::class, 'dashboard']);
        Route::post('/upload-document', [TeacherController::class, 'uploadDocument']);
        Route::get('/documents', [TeacherController::class, 'getTeacherDocuments']);
        Route::get('/pending-approval', [TeacherController::class, 'getTeacherPendingApproval']);
        Route::put('/documents/{id}', [TeacherController::class, 'updateDocument']);
        Route::delete('/documents/{id}', [TeacherController::class, 'deleteDocument']);
        Route::get('/categories', [TeacherController::class, 'getTeacherCategories']);
        Route::get('/departments', [TeacherController::class, 'getTeacherDepartments']);
        Route::get('/profile', [TeacherController::class, 'getTeacherProfile']);
        Route::put('/profile', [TeacherController::class, 'updateProfile']);
        Route::post('/upload-video', [TeacherController::class, 'uploadVideo']);
        Route::get('/videos', [TeacherController::class, 'getTeacherVideos']);
        Route::get('/documents/{id}/preview', [TeacherController::class, 'previewDocument']);
        Route::get('/documents/{id}/download', [TeacherController::class, 'downloadDocument']);
        Route::get('/schedule', [TeacherController::class, 'getTeacherSchedule']);
        Route::post('/schedule', [TeacherController::class, 'addScheduleItem']);
        Route::post('/deadline', [TeacherController::class, 'addDeadline']);
        Route::post('/office-hour', [TeacherController::class, 'addOfficeHour']);
        Route::get('/comments', [TeacherController::class, 'getComments']);
        Route::put('/comments/{id}/read', [TeacherController::class, 'markCommentAsRead']);
    });

    // Department Head routes
    Route::prefix('department')->group(function () {
        Route::get('/dashboard', [DepartmentHeadController::class, 'dashboard']);
        Route::get('/profile', [DepartmentHeadController::class, 'getDepartmentProfile']);
        Route::put('/profile', [DepartmentHeadController::class, 'updateProfile']);
        Route::get('/documents', [DepartmentHeadController::class, 'getDocuments']);
        Route::get('/pending-documents', [DepartmentHeadController::class, 'getPendingDocuments']);
        Route::get('/analytics', [DepartmentHeadController::class, 'getAnalytics']);
        Route::get('/documents/{id}/preview', [DepartmentHeadController::class, 'previewDocument']);
        Route::get('/documents/{id}/download', [DepartmentHeadController::class, 'downloadDocument']);
        Route::post('/documents/{id}/approve', [DepartmentHeadController::class, 'approveDocument']);
        Route::post('/documents/{id}/reject', [DepartmentHeadController::class, 'rejectDocument']);
        Route::put('/documents/{id}/status', [DepartmentHeadController::class, 'updateDocumentStatus']);
        Route::delete('/documents/{id}', [DepartmentHeadController::class, 'deleteDocument']);
        Route::post('/review-document/{id}', [DepartmentHeadController::class, 'reviewDocument']);
        Route::post('/bulk-review-documents', [DepartmentHeadController::class, 'bulkReviewDocuments']);
        Route::get('/stats', [DepartmentHeadController::class, 'getDepartmentStats']);
        Route::get('/pending-videos', [DepartmentHeadController::class, 'getPendingVideos']);
        Route::post('/videos/{id}/approve', [DepartmentHeadController::class, 'approveVideo']);
        Route::post('/videos/{id}/reject', [DepartmentHeadController::class, 'rejectVideo']);
        Route::get('/courses', [DepartmentHeadController::class, 'getDepartmentCourses']);
        Route::get('/faculty', [DepartmentHeadController::class, 'getDepartmentFaculty']);
        Route::post('/documents/{id}/comment', [DepartmentHeadController::class, 'addComment']);
        Route::get('/documents/{id}/comments', [DepartmentHeadController::class, 'getComments']);
    });
    
    // Dean routes
    Route::prefix('dean')->group(function () {
        Route::get('/dashboard', [DeanController::class, 'dashboard']);
        Route::get('/faculty', [DeanController::class, 'getFacultyManagement']);
        Route::get('/documents', [DeanController::class, 'getDocuments']);
        Route::get('/documents/{id}/preview', [DeanController::class, 'previewDocument']);
        Route::get('/documents/{id}/download', [DeanController::class, 'downloadDocument']);
        Route::get('/stats', [DeanController::class, 'getDeanStats']);
        Route::get('/analytics', [DeanController::class, 'getDepartmentAnalytics']);
        Route::post('/departments', [DeanController::class, 'createDepartment']);
        Route::put('/departments/{id}', [DeanController::class, 'updateDepartment']);
        Route::delete('/departments/{id}', [DeanController::class, 'deleteDepartment']);
    });

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/stats', [AdminController::class, 'getAdminStats']);
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/user-management', [AdminController::class, 'getUserManagement']);
        Route::post('/users', [AdminController::class, 'createUser']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::post('/users/{id}/status', [AdminController::class, 'updateUserStatus']);
        Route::get('/system', [AdminController::class, 'getSystemMonitoring']);
        Route::get('/system-metrics', [AdminController::class, 'getSystemMetrics']);
        Route::get('/audit-logs', [AdminController::class, 'getAuditLogs']);
        Route::put('/system/alerts/{id}/resolve', [AdminController::class, 'resolveSystemAlert']);
        Route::post('/import/students', [AdminController::class, 'importStudents']);
        Route::get('/system-health', [AdminController::class, 'getSystemHealth']);
        Route::post('/maintenance/cleanup', [AdminController::class, 'performSystemCleanup']);
        
        // Backup routes
        Route::get('/backups', [BackupController::class, 'getBackups']);
        Route::post('/backups', [BackupController::class, 'createBackup']);
        Route::get('/backups/{filename}/download', [BackupController::class, 'downloadBackup']);
        Route::delete('/backups/{filename}', [BackupController::class, 'deleteBackup']);
        Route::get('/backup-settings', [BackupController::class, 'getBackupSettings']);
    });
    
    // General document routes (for all users)
    Route::prefix('documents')->group(function () {
        Route::get('/', [DocumentController::class, 'index']);
        Route::get('/{id}', [DocumentController::class, 'show']);
        Route::post('/', [DocumentController::class, 'store']);
        Route::put('/{id}', [DocumentController::class, 'update']);
        Route::delete('/{id}', [DocumentController::class, 'destroy']);
        Route::put('/{id}/status', [DocumentController::class, 'updateDocumentStatus']);
    });
    
    // Export routes
    Route::prefix('export')->group(function () {
        Route::get('/users', [ExportController::class, 'exportUsers']);
        Route::get('/documents', [ExportController::class, 'exportDocuments']);
        Route::get('/analytics', [ExportController::class, 'exportAnalytics']);
        Route::get('/reports/{type}', [ExportController::class, 'exportReport']);
    });
    
    // Search routes
    Route::post('/search/advanced', [DocumentController::class, 'advancedSearch']);
    
    // Tracking routes
    Route::post('/track/view', [DocumentController::class, 'trackView']);
    Route::post('/track/download', [DocumentController::class, 'trackDownload']);
    Route::post('/track/search', [DocumentController::class, 'trackSearch']);
    
    // Logout
    Route::post('/auth/logout', [AuthenticatedSessionController::class, 'apiLogout']);
});

