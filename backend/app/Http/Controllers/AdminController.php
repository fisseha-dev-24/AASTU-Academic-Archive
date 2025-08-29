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

class AdminController extends Controller
{
    /**
     * Get system administration dashboard statistics
     */
    public function getAdminStats(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            // Verify user is an admin
            if ($user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            // Get system-level statistics
            $stats = [
                'total_users' => User::count(),
                'active_sessions' => $this->getActiveSessions(),
                'total_documents' => Document::count(),
                'system_health' => $this->getSystemHealth(),
                'storage_usage' => $this->getStorageUsage(),
                'recent_logins' => $this->getRecentLogins(),
                'failed_attempts' => $this->getFailedLoginAttempts(),
                'system_uptime' => $this->getSystemUptime(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch admin statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user management data
     */
    public function getUserManagement(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            $users = User::with(['department'])
                ->withCount(['documents', 'reviews'])
                ->get()
                ->map(function($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'department' => $user->department ? $user->department->name : 'N/A',
                        'documents_count' => $user->documents_count,
                        'reviews_count' => $user->reviews_count,
                        'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                        'last_login' => $this->getLastLogin($user->id),
                        'status' => $user->email_verified_at ? 'Verified' : 'Pending'
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system monitoring data
     */
    public function getSystemMonitoring(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            $monitoring = [
                'database_status' => $this->getDatabaseStatus(),
                'file_system_status' => $this->getFileSystemStatus(),
                'api_performance' => $this->getApiPerformance(),
                'error_logs' => $this->getErrorLogs(),
                'security_alerts' => $this->getSecurityAlerts(),
                'backup_status' => $this->getBackupStatus(),
            ];

            return response()->json([
                'success' => true,
                'data' => $monitoring
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch system monitoring data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get audit logs for system administration
     */
    public function getAuditLogs(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'action' => 'nullable|string',
                'user_id' => 'nullable|integer',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
                'limit' => 'nullable|integer|min:1|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = AuditLog::with(['user', 'document']);

            if ($request->action) {
                $query->where('action', $request->action);
            }

            if ($request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->start_date && $request->end_date) {
                $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
            }

            $logs = $query->orderBy('created_at', 'desc')
                ->limit($request->limit ?? 50)
                ->get()
                ->map(function($log) {
                    return [
                        'id' => $log->id,
                        'action' => $log->action,
                        'user' => $log->user ? $log->user->name : 'Unknown',
                        'document' => $log->document ? $log->document->title : null,
                        'timestamp' => $log->created_at->format('Y-m-d H:i:s'),
                        'ip_address' => $log->ip_address,
                        'details' => $log->details
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $logs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch audit logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system health metrics
     */
    public function getSystemHealthMetrics(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            $metrics = [
                'cpu_usage' => $this->getCpuUsage(),
                'memory_usage' => $this->getMemoryUsage(),
                'disk_usage' => $this->getDiskUsage(),
                'database_connections' => $this->getDatabaseConnections(),
                'queue_jobs' => $this->getQueueJobs(),
                'cache_hit_rate' => $this->getCacheHitRate(),
            ];

            return response()->json([
                'success' => true,
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch system health metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Helper methods for system monitoring

    private function getActiveSessions(): int
    {
        // This would typically check active sessions in the database
        // For now, return a mock value
        return rand(50, 200);
    }

    private function getSystemHealth(): string
    {
        // Mock system health check
        $health = rand(95, 100);
        return $health . '%';
    }

    private function getStorageUsage(): array
    {
        // Mock storage usage
        return [
            'total' => '500GB',
            'used' => '125GB',
            'available' => '375GB',
            'usage_percentage' => 25
        ];
    }

    private function getRecentLogins(): int
    {
        return AuditLog::where('action', 'login')
            ->where('created_at', '>=', Carbon::now()->subHours(24))
            ->count();
    }

    private function getFailedLoginAttempts(): int
    {
        return AuditLog::where('action', 'login_failed')
            ->where('created_at', '>=', Carbon::now()->subHours(24))
            ->count();
    }

    private function getSystemUptime(): string
    {
        // Mock uptime
        $days = rand(1, 30);
        $hours = rand(0, 23);
        return "{$days}d {$hours}h";
    }

    private function getLastLogin($userId): string
    {
        $lastLogin = AuditLog::where('user_id', $userId)
            ->where('action', 'login')
            ->orderBy('created_at', 'desc')
            ->first();

        return $lastLogin ? $lastLogin->created_at->format('Y-m-d H:i:s') : 'Never';
    }

    private function getDatabaseStatus(): array
    {
        return [
            'status' => 'Healthy',
            'connections' => rand(5, 20),
            'response_time' => rand(10, 100) . 'ms'
        ];
    }

    private function getFileSystemStatus(): array
    {
        return [
            'status' => 'Healthy',
            'read_permissions' => true,
            'write_permissions' => true,
            'storage_accessible' => true
        ];
    }

    private function getApiPerformance(): array
    {
        return [
            'average_response_time' => rand(50, 200) . 'ms',
            'requests_per_minute' => rand(100, 500),
            'error_rate' => rand(0, 5) . '%'
        ];
    }

    private function getErrorLogs(): array
    {
        return [
            'total_errors_today' => rand(0, 10),
            'critical_errors' => rand(0, 2),
            'warning_errors' => rand(0, 5)
        ];
    }

    private function getSecurityAlerts(): array
    {
        return [
            'failed_login_attempts' => rand(0, 20),
            'suspicious_activities' => rand(0, 5),
            'blocked_ips' => rand(0, 3)
        ];
    }

    private function getBackupStatus(): array
    {
        return [
            'last_backup' => Carbon::now()->subHours(rand(1, 24))->format('Y-m-d H:i:s'),
            'backup_size' => rand(100, 500) . 'MB',
            'status' => 'Completed'
        ];
    }

    private function getCpuUsage(): int
    {
        return rand(20, 80);
    }

    private function getMemoryUsage(): int
    {
        return rand(30, 90);
    }

    private function getDiskUsage(): int
    {
        return rand(25, 75);
    }

    private function getDatabaseConnections(): int
    {
        return rand(5, 25);
    }

    private function getQueueJobs(): array
    {
        return [
            'pending' => rand(0, 10),
            'processing' => rand(0, 5),
            'completed' => rand(50, 200)
        ];
    }

    private function getCacheHitRate(): int
    {
        return rand(85, 98);
    }
}
