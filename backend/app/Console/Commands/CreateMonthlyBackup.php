<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use App\Models\AuditLog;

class CreateMonthlyBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:monthly';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a monthly backup of the database and files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting monthly backup process...');

        try {
            $backupPath = 'backups/';
            $timestamp = now()->format('Y_m_d_H_i_s');
            $backupName = "aastu_archive_monthly_{$timestamp}.sql";
            
            // Create backup directory if it doesn't exist
            $backupDir = storage_path('app/' . $backupPath);
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
                'user_id' => 1, // System user
                'action' => 'scheduled_backup_created',
                'details' => "Created monthly backup: {$backupName} (Size: {$fileSize})",
                'ip_address' => '127.0.0.1',
            ]);

            $this->info("Monthly backup created successfully: {$backupName}");
            $this->info("Backup size: {$fileSize}");
            $this->info("Backup location: {$backupFile}");

            // Clean up old backups (keep only last 12 months)
            $this->cleanupOldBackups($backupDir);

            return 0;

        } catch (\Exception $e) {
            $this->error('Failed to create monthly backup: ' . $e->getMessage());
            
            // Log the error
            AuditLog::create([
                'user_id' => 1, // System user
                'action' => 'backup_failed',
                'details' => "Monthly backup failed: " . $e->getMessage(),
                'ip_address' => '127.0.0.1',
            ]);

            return 1;
        }
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
     * Clean up old backups (keep only last 12 months)
     */
    private function cleanupOldBackups(string $backupDir): void
    {
        $files = scandir($backupDir);
        $cutoffDate = Carbon::now()->subMonths(12);
        $deletedCount = 0;

        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..' && pathinfo($file, PATHINFO_EXTENSION) === 'sql') {
                $filePath = $backupDir . $file;
                $fileDate = Carbon::createFromTimestamp(filemtime($filePath));
                
                if ($fileDate->lt($cutoffDate)) {
                    unlink($filePath);
                    $deletedCount++;
                    $this->info("Deleted old backup: {$file}");
                }
            }
        }

        if ($deletedCount > 0) {
            $this->info("Cleaned up {$deletedCount} old backup files");
        }
    }
}