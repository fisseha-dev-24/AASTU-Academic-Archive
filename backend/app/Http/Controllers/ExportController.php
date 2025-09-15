<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Document;
use App\Models\Department;
use App\Models\DocumentAnalytics;

class ExportController extends Controller
{
    /**
     * Export users data
     */
    public function exportUsers(Request $request)
    {
        try {
            $this->authorize('export', User::class);
            
            $query = User::with('department');
            
            // Apply filters
            if ($request->has('role') && $request->role !== 'all') {
                $query->where('role', $request->role);
            }
            
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            
            if ($request->has('department_id') && $request->department_id !== 'all') {
                $query->where('department_id', $request->department_id);
            }
            
            $users = $query->get();
            
            $format = $request->get('format', 'csv');
            
            switch ($format) {
                case 'csv':
                    return $this->exportUsersToCSV($users);
                case 'excel':
                    return $this->exportUsersToExcel($users);
                case 'json':
                    return $this->exportUsersToJSON($users);
                default:
                    return $this->exportUsersToCSV($users);
            }
            
        } catch (\Exception $e) {
            \Log::error('Users export error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Export failed'
            ], 500);
        }
    }
    
    /**
     * Export documents data
     */
    public function exportDocuments(Request $request)
    {
        try {
            $this->authorize('export', Document::class);
            
            $query = Document::with(['user', 'department', 'category']);
            
            // Apply filters
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            
            if ($request->has('department_id') && $request->department_id !== 'all') {
                $query->where('department_id', $request->department_id);
            }
            
            if ($request->has('category_id') && $request->category_id !== 'all') {
                $query->where('category_id', $request->category_id);
            }
            
            if ($request->has('date_from')) {
                $query->where('created_at', '>=', $request->date_from);
            }
            
            if ($request->has('date_to')) {
                $query->where('created_at', '<=', $request->date_to);
            }
            
            $documents = $query->get();
            
            $format = $request->get('format', 'csv');
            
            switch ($format) {
                case 'csv':
                    return $this->exportDocumentsToCSV($documents);
                case 'excel':
                    return $this->exportDocumentsToExcel($documents);
                case 'json':
                    return $this->exportDocumentsToJSON($documents);
                default:
                    return $this->exportDocumentsToCSV($documents);
            }
            
        } catch (\Exception $e) {
            \Log::error('Documents export error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Export failed'
            ], 500);
        }
    }
    
    /**
     * Export analytics data
     */
    public function exportAnalytics(Request $request)
    {
        try {
            $this->authorize('export', DocumentAnalytics::class);
            
            $dateRange = $request->get('date_range', 'last_month');
            $departmentId = $request->get('department_id');
            
            $query = DocumentAnalytics::query();
            
            // Apply date range
            switch ($dateRange) {
                case 'last_week':
                    $query->where('created_at', '>=', now()->subWeek());
                    break;
                case 'last_month':
                    $query->where('created_at', '>=', now()->subMonth());
                    break;
                case 'last_quarter':
                    $query->where('created_at', '>=', now()->subQuarter());
                    break;
                case 'last_year':
                    $query->where('created_at', '>=', now()->subYear());
                    break;
            }
            
            if ($departmentId && $departmentId !== 'all') {
                $query->where('department_id', $departmentId);
            }
            
            $analytics = $query->get();
            
            $format = $request->get('format', 'excel');
            
            switch ($format) {
                case 'csv':
                    return $this->exportAnalyticsToCSV($analytics);
                case 'excel':
                    return $this->exportAnalyticsToExcel($analytics);
                case 'json':
                    return $this->exportAnalyticsToJSON($analytics);
                default:
                    return $this->exportAnalyticsToExcel($analytics);
            }
            
        } catch (\Exception $e) {
            \Log::error('Analytics export error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Export failed'
            ], 500);
        }
    }
    
    /**
     * Export specific report type
     */
    public function exportReport(Request $request, $type)
    {
        try {
            $this->authorize('export', Document::class);
            
            switch ($type) {
                case 'department_performance':
                    return $this->exportDepartmentPerformance($request);
                case 'user_activity':
                    return $this->exportUserActivity($request);
                case 'document_trends':
                    return $this->exportDocumentTrends($request);
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Unknown report type'
                    ], 400);
            }
            
        } catch (\Exception $e) {
            \Log::error("Report export error ({$type}): " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Export failed'
            ], 500);
        }
    }
    
    // Private helper methods for different export formats
    
    private function exportUsersToCSV($users)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="users_export_' . date('Y-m-d') . '.csv"',
        ];
        
        $callback = function() use ($users) {
            $file = fopen('php://output', 'w');
            
            // Headers
            fputcsv($file, [
                'ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'Created At', 'Last Login'
            ]);
            
            // Data
            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->role,
                    $user->department?->name ?? 'N/A',
                    $user->status,
                    $user->created_at->format('Y-m-d H:i:s'),
                    $user->last_login ? $user->last_login->format('Y-m-d H:i:s') : 'Never'
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
    
    private function exportUsersToExcel($users)
    {
        // Implementation for Excel export using PhpSpreadsheet or similar
        // For now, return CSV as fallback
        return $this->exportUsersToCSV($users);
    }
    
    private function exportUsersToJSON($users)
    {
        return response()->json([
            'success' => true,
            'data' => $users,
            'export_info' => [
                'timestamp' => now()->toISOString(),
                'total_records' => $users->count(),
                'format' => 'json'
            ]
        ]);
    }
    
    private function exportDocumentsToCSV($documents)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="documents_export_' . date('Y-m-d') . '.csv"',
        ];
        
        $callback = function() use ($documents) {
            $file = fopen('php://output', 'w');
            
            // Headers
            fputcsv($file, [
                'ID', 'Title', 'Author', 'Department', 'Category', 'Status', 'Upload Date', 'Downloads', 'Views'
            ]);
            
            // Data
            foreach ($documents as $document) {
                fputcsv($file, [
                    $document->id,
                    $document->title,
                    $document->user?->name ?? 'N/A',
                    $document->department?->name ?? 'N/A',
                    $document->category?->name ?? 'N/A',
                    $document->status,
                    $document->created_at->format('Y-m-d H:i:s'),
                    $document->downloads ?? 0,
                    $document->views ?? 0
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
    
    private function exportDocumentsToExcel($documents)
    {
        // Implementation for Excel export
        return $this->exportDocumentsToCSV($documents);
    }
    
    private function exportDocumentsToJSON($documents)
    {
        return response()->json([
            'success' => true,
            'data' => $documents,
            'export_info' => [
                'timestamp' => now()->toISOString(),
                'total_records' => $documents->count(),
                'format' => 'json'
            ]
        ]);
    }
    
    private function exportAnalyticsToCSV($analytics)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="analytics_export_' . date('Y-m-d') . '.csv"',
        ];
        
        $callback = function() use ($analytics) {
            $file = fopen('php://output', 'w');
            
            // Headers
            fputcsv($file, [
                'Date', 'Department', 'Documents Uploaded', 'Documents Approved', 'Total Views', 'Total Downloads'
            ]);
            
            // Data
            foreach ($analytics as $analytic) {
                fputcsv($file, [
                    $analytic->created_at->format('Y-m-d'),
                    $analytic->department?->name ?? 'N/A',
                    $analytic->documents_uploaded ?? 0,
                    $analytic->documents_approved ?? 0,
                    $analytic->total_views ?? 0,
                    $analytic->total_downloads ?? 0
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
    
    private function exportAnalyticsToExcel($analytics)
    {
        // Implementation for Excel export
        return $this->exportAnalyticsToCSV($analytics);
    }
    
    private function exportAnalyticsToJSON($analytics)
    {
        return response()->json([
            'success' => true,
            'data' => $analytics,
            'export_info' => [
                'timestamp' => now()->toISOString(),
                'total_records' => $analytics->count(),
                'format' => 'json'
            ]
        ]);
    }
    
    // Report-specific export methods
    
    private function exportDepartmentPerformance($request)
    {
        $departments = Department::withCount(['users', 'documents'])
            ->withSum('documents', 'views')
            ->withSum('documents', 'downloads')
            ->get();
            
        return $this->exportAnalyticsToCSV($departments);
    }
    
    private function exportUserActivity($request)
    {
        $users = User::withCount(['documents', 'documentViews', 'documentDownloads'])
            ->get();
            
        return $this->exportUsersToCSV($users);
    }
    
    private function exportDocumentTrends($request)
    {
        $trends = Document::selectRaw('
                DATE(created_at) as date,
                COUNT(*) as uploads,
                SUM(CASE WHEN status = "approved" THEN 1 ELSE 0 END) as approved,
                SUM(views) as total_views,
                SUM(downloads) as total_downloads
            ')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
            
        return $this->exportAnalyticsToCSV($trends);
    }
}
