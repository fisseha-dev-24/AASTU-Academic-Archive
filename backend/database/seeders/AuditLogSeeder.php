<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AuditLog;
use App\Models\User;
use App\Models\Document;

class AuditLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a student user
        $student = User::where('role', 'student')->first();
        
        if (!$student) {
            $this->command->info('No student user found. Skipping audit log seeding.');
            return;
        }

        // Get some documents
        $documents = Document::where('status', 'approved')->take(5)->get();
        
        if ($documents->isEmpty()) {
            $this->command->info('No approved documents found. Skipping audit log seeding.');
            return;
        }

        // Create sample audit log entries
        $actions = ['view', 'download', 'search'];
        $searchTerms = ['Database Systems', 'Software Engineering', 'Machine Learning', 'Data Structures', 'Computer Networks'];
        
        foreach ($documents as $document) {
            // Add view logs
            AuditLog::create([
                'user_id' => $student->id,
                'document_id' => $document->id,
                'action' => 'view',
                'details' => 'Document viewed: ' . $document->title,
                'ip_address' => '127.0.0.1',
                'created_at' => now()->subDays(rand(1, 7)),
            ]);

            // Add download logs (less frequent than views)
            if (rand(1, 3) === 1) {
                AuditLog::create([
                    'user_id' => $student->id,
                    'document_id' => $document->id,
                    'action' => 'download',
                    'details' => 'Document downloaded: ' . $document->title,
                    'ip_address' => '127.0.0.1',
                    'created_at' => now()->subDays(rand(1, 5)),
                ]);
            }
        }

        // Add search logs
        foreach ($searchTerms as $term) {
            AuditLog::create([
                'user_id' => $student->id,
                'document_id' => null,
                'action' => 'search',
                'details' => $term,
                'ip_address' => '127.0.0.1',
                'created_at' => now()->subDays(rand(1, 7)),
            ]);
        }

        $this->command->info('Audit log entries created successfully!');
    }
}
