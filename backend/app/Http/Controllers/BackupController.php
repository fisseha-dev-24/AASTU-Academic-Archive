<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Carbon\Carbon;
use App\Models\AuditLog;

class BackupController extends Controller
{
    private $backupPath = 'backups/';

    /**
     * Get all backups
     */
    public function getBackups(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'admin' && $user->role !== 'it_manager') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            $backups = $this->getBackupList();

            return response()->json([
                'success' => true,
                'data' => $backups
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch backups',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new backup
     */
    public function createBackup(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'admin' && $user->role !== 'it_manager') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            $type = $request->input('type', 'full');
            $backupName = $this->generateBackupName($type);
            
            // Create backup directory if it doesn't exist
            $backupDir = storage_path('app/' . $this->backupPath);
            if (!file_exists($backupDir)) {
                mkdir($backupDir, 0755, true);
            }

            $backupFile = $backupDir . $backupName;
            
            // Create database backup
            $this->createDatabaseBackup($backupFile);
            
            // Get file size
            $fileSize = $this->formatFileSize(filesize($backupFile));
            
            // Log the backup creation
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'backup_created',
                'details' => "Created {$type} backup: {$backupName}",
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => "Backup created successfully",
                'data' => [
                    'name' => $backupName,
                    'type' => $type,
                    'size' => $fileSize,
                    'created_at' => now()->format('Y-m-d H:i:s'),
                    'status' => 'completed'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create backup',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download a backup file
     */
    public function downloadBackup(Request $request, $filename): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'admin' && $user->role !== 'it_manager') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            $backupPath = storage_path('app/' . $this->backupPath . $filename);
            
            if (!file_exists($backupPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Backup file not found'
                ], 404);
            }

            // Log the download
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'backup_download',
                'details' => "Downloaded backup: {$filename}",
                'ip_address' => $request->ip(),
            ]);

            return response()->download($backupPath);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download backup',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a backup file
     */
    public function deleteBackup(Request $request, $filename): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'admin' && $user->role !== 'it_manager') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            $backupPath = storage_path('app/' . $this->backupPath . $filename);
            
            if (!file_exists($backupPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Backup file not found'
                ], 404);
            }

            unlink($backupPath);

            // Log the deletion
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'backup_deleted',
                'details' => "Deleted backup: {$filename}",
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Backup deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete backup',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get backup settings
     */
    public function getBackupSettings(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if ($user->role !== 'admin' && $user->role !== 'it_manager') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            $settings = [
                'auto_backup_enabled' => true,
                'backup_frequency' => 'monthly',
                'backup_time' => '02:00',
                'retention_days' => 365, // Keep backups for 1 year (12 monthly backups)
                'backup_location' => storage_path('app/' . $this->backupPath),
                'include_files' => true,
                'include_database' => true,
                'compression_enabled' => true,
                'last_monthly_backup' => $this->getLastMonthlyBackup(),
                'next_scheduled_backup' => $this->getNextScheduledBackup()
            ];

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch backup settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get backup list from storage
     */
    private function getBackupList(): array
    {
        $backupDir = storage_path('app/' . $this->backupPath);
        $backups = [];

        if (file_exists($backupDir)) {
            $files = scandir($backupDir);
            
            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..' && pathinfo($file, PATHINFO_EXTENSION) === 'sql') {
                    $filePath = $backupDir . $file;
                    $fileSize = filesize($filePath);
                    $createdAt = date('Y-m-d H:i:s', filemtime($filePath));
                    
                    // Determine backup type from filename
                    $type = 'full';
                    if (strpos($file, 'incremental') !== false) {
                        $type = 'incremental';
                    } elseif (strpos($file, 'differential') !== false) {
                        $type = 'differential';
                    }

                    $backups[] = [
                        'id' => count($backups) + 1,
                        'name' => $file,
                        'type' => $type,
                        'size' => $this->formatFileSize($fileSize),
                        'created_at' => $createdAt,
                        'status' => 'completed',
                        'location' => $file
                    ];
                }
            }
        }

        // Sort by creation date (newest first)
        usort($backups, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return $backups;
    }

    /**
     * Generate backup filename
     */
    private function generateBackupName(string $type): string
    {
        $timestamp = now()->format('Y_m_d_H_i_s');
        return "aastu_archive_{$type}_{$timestamp}.sql";
    }

    /**
     * Create database backup
     */
    private function createDatabaseBackup(string $backupFile): void
    {
        $database = config('database.connections.mysql.database');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $host = config('database.connections.mysql.host');
        $port = config('database.connections.mysql.port');

        $command = "mysqldump --host={$host} --port={$port} --user={$username}";
        
        if ($password) {
            $command .= " --password={$password}";
        }
        
        $command .= " --single-transaction --routines --triggers {$database} > {$backupFile}";

        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            throw new \Exception('Database backup failed');
        }
    }

    /**
     * Format file size
     */
    private function formatFileSize(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, 2) . ' ' . $units[$pow];
    }

    /**
     * Get last monthly backup info
     */
    private function getLastMonthlyBackup(): ?array
    {
        $backupDir = storage_path('app/' . $this->backupPath);
        
        if (!file_exists($backupDir)) {
            return null;
        }

        $files = scandir($backupDir);
        $monthlyBackups = [];

        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..' && 
                pathinfo($file, PATHINFO_EXTENSION) === 'sql' &&
                strpos($file, 'monthly') !== false) {
                $filePath = $backupDir . $file;
                $monthlyBackups[] = [
                    'name' => $file,
                    'created_at' => date('Y-m-d H:i:s', filemtime($filePath)),
                    'size' => $this->formatFileSize(filesize($filePath))
                ];
            }
        }

        if (empty($monthlyBackups)) {
            return null;
        }

        // Sort by creation date and get the latest
        usort($monthlyBackups, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return $monthlyBackups[0];
    }

    /**
     * Get next scheduled backup date
     */
    private function getNextScheduledBackup(): string
    {
        // Calculate next month's first day at 2:00 AM
        $nextMonth = Carbon::now()->addMonth()->startOfMonth()->setTime(2, 0, 0);
        return $nextMonth->format('Y-m-d H:i:s');
    }
}