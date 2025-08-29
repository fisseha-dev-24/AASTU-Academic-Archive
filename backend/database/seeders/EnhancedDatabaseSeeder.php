<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class EnhancedDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear tables
        DB::table('document_analytics')->truncate();
        DB::table('notifications')->truncate();
        DB::table('user_activities')->truncate();
        DB::table('document_reviews')->truncate();
        DB::table('documents')->truncate();
        DB::table('users')->truncate();
        DB::table('categories')->truncate();
        DB::table('departments')->truncate();
        DB::table('audit_logs')->truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Seed Departments
        $departments = [
            ['name' => 'Computer Science and Engineering', 'code' => 'CSE', 'description' => 'Computer Science and Engineering Department'],
            ['name' => 'Electrical and Computer Engineering', 'code' => 'ECE', 'description' => 'Electrical and Computer Engineering Department'],
            ['name' => 'Mechanical Engineering', 'code' => 'MECH', 'description' => 'Mechanical Engineering Department'],
            ['name' => 'Civil Engineering', 'code' => 'CIVIL', 'description' => 'Civil Engineering Department'],
            ['name' => 'Chemical Engineering', 'code' => 'CHEM', 'description' => 'Chemical Engineering Department'],
            ['name' => 'Applied Mathematics', 'code' => 'MATH', 'description' => 'Applied Mathematics Department'],
            ['name' => 'Applied Physics', 'code' => 'PHYS', 'description' => 'Applied Physics Department'],
            ['name' => 'Applied Chemistry', 'code' => 'CHEM_APP', 'description' => 'Applied Chemistry Department'],
            ['name' => 'Applied Biology', 'code' => 'BIO', 'description' => 'Applied Biology Department'],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'Information Technology Department'],
            ['name' => 'Software Engineering', 'code' => 'SWE', 'description' => 'Software Engineering Department'],
            ['name' => 'Biomedical Engineering', 'code' => 'BME', 'description' => 'Biomedical Engineering Department'],
        ];

        foreach ($departments as $dept) {
            DB::table('departments')->insert([
                'name' => $dept['name'],
                'code' => $dept['code'],
                'description' => $dept['description'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Categories
        $categories = [
            ['name' => 'Lecture Notes', 'description' => 'Course lecture materials', 'icon' => 'book-open', 'color' => '#3B82F6'],
            ['name' => 'Assignments', 'description' => 'Course assignments and homework', 'icon' => 'file-text', 'color' => '#10B981'],
            ['name' => 'Research Papers', 'description' => 'Academic research papers', 'icon' => 'search', 'color' => '#F59E0B'],
            ['name' => 'Lab Manuals', 'description' => 'Laboratory manuals and guides', 'icon' => 'flask', 'color' => '#8B5CF6'],
            ['name' => 'Exams', 'description' => 'Examination papers and solutions', 'icon' => 'clipboard-check', 'color' => '#EF4444'],
            ['name' => 'Presentations', 'description' => 'PowerPoint presentations', 'icon' => 'presentation', 'color' => '#06B6D4'],
            ['name' => 'Reports', 'description' => 'Technical reports and documentation', 'icon' => 'file-document', 'color' => '#84CC16'],
            ['name' => 'Theses', 'description' => 'Graduate theses and dissertations', 'icon' => 'academic-cap', 'color' => '#EC4899'],
            ['name' => 'Projects', 'description' => 'Student and faculty projects', 'icon' => 'folder', 'color' => '#F97316'],
            ['name' => 'Tutorials', 'description' => 'Tutorial materials and guides', 'icon' => 'academic-cap', 'color' => '#6366F1'],
            ['name' => 'Syllabi', 'description' => 'Course syllabi and outlines', 'icon' => 'document-text', 'color' => '#14B8A6'],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->insert([
                'name' => $cat['name'],
                'description' => $cat['description'],
                'icon' => $cat['icon'],
                'color' => $cat['color'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Users
        $users = [
            // Students
            ['name' => 'Abebe Kebede', 'email' => 'abebe.kebede@aastustudent.edu.et', 'role' => 'student', 'department_id' => 1, 'student_id' => 'CSE001'],
            ['name' => 'Kebede Alemu', 'email' => 'kebede.alemu@aastustudent.edu.et', 'role' => 'student', 'department_id' => 1, 'student_id' => 'CSE002'],
            ['name' => 'Tigist Haile', 'email' => 'tigist.haile@aastustudent.edu.et', 'role' => 'student', 'department_id' => 2, 'student_id' => 'ECE001'],
            ['name' => 'Yohannes Tesfaye', 'email' => 'yohannes.tesfaye@aastustudent.edu.et', 'role' => 'student', 'department_id' => 3, 'student_id' => 'MECH001'],
            ['name' => 'Bethel Tadesse', 'email' => 'bethel.tadesse@aastustudent.edu.et', 'role' => 'student', 'department_id' => 4, 'student_id' => 'CIVIL001'],
            
            // Teachers
            ['name' => 'Dr. Firaol Nigusse', 'email' => 'firaol.nigusse@aastu.edu.et', 'role' => 'teacher', 'department_id' => 1],
            ['name' => 'Dr. Alemayehu Mamo', 'email' => 'alemayehu.mamo@aastu.edu.et', 'role' => 'teacher', 'department_id' => 1],
            ['name' => 'Dr. Bethlehem Tekle', 'email' => 'bethlehem.tekle@aastu.edu.et', 'role' => 'teacher', 'department_id' => 2],
            ['name' => 'Dr. Dawit Assefa', 'email' => 'dawit.assefa@aastu.edu.et', 'role' => 'teacher', 'department_id' => 3],
            ['name' => 'Dr. Eden Worku', 'email' => 'eden.worku@aastu.edu.et', 'role' => 'teacher', 'department_id' => 4],
            
            // Department Heads
            ['name' => 'Dr. Burka Labsi', 'email' => 'burka.labsi@aastu.edu.et', 'role' => 'department_head', 'department_id' => 1],
            ['name' => 'Dr. Kidist Solomon', 'email' => 'kidist.solomon@aastu.edu.et', 'role' => 'department_head', 'department_id' => 2],
            ['name' => 'Dr. Mulugeta Desta', 'email' => 'mulugeta.desta@aastu.edu.et', 'role' => 'department_head', 'department_id' => 3],
            ['name' => 'Dr. Rahel Bekele', 'email' => 'rahel.bekele@aastu.edu.et', 'role' => 'department_head', 'department_id' => 4],
            
            // College Dean
            ['name' => 'Dr. Henok Tademe', 'email' => 'henoktademe@gmail.com', 'role' => 'college_dean', 'department_id' => 1],
            
            // IT Manager
            ['name' => 'Gemechu Merara', 'email' => 'gemechu.merara@aastu.edu.et', 'role' => 'it_manager', 'department_id' => 10],
        ];

        foreach ($users as $user) {
            DB::table('users')->insert([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password123'),
                'role' => $user['role'],
                'student_id' => $user['student_id'] ?? null,
                'department_id' => $user['department_id'],
                'is_active' => true,
                'last_login_at' => Carbon::now()->subDays(rand(0, 30)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Update department heads
        DB::table('departments')->where('id', 1)->update(['head_id' => 11]); // CSE
        DB::table('departments')->where('id', 2)->update(['head_id' => 12]); // ECE
        DB::table('departments')->where('id', 3)->update(['head_id' => 13]); // MECH
        DB::table('departments')->where('id', 4)->update(['head_id' => 14]); // CIVIL

        // Seed Documents
        $documentTypes = ['Lecture Notes', 'Assignments', 'Research Papers', 'Lab Manuals', 'Exams', 'Presentations', 'Reports', 'Theses', 'Projects', 'Tutorials', 'Syllabi'];
        $years = [2020, 2021, 2022, 2023, 2024, 2025];
        $statuses = ['pending', 'approved', 'rejected'];
        
        for ($i = 1; $i <= 50; $i++) {
            $userId = rand(6, 10); // Teachers only
            $categoryId = rand(1, 11);
            $departmentId = rand(1, 12);
            $status = $statuses[array_rand($statuses)];
            
            DB::table('documents')->insert([
                'title' => 'Document ' . $i . ' - ' . $documentTypes[array_rand($documentTypes)],
                'description' => 'This is a sample document description for document ' . $i,
                'author' => DB::table('users')->where('id', $userId)->value('name'),
                'department_id' => $departmentId,
                'category_id' => $categoryId,
                'year' => $years[array_rand($years)],
                'supervisor' => 'Dr. Supervisor',
                'document_type' => $documentTypes[array_rand($documentTypes)],
                'keywords' => 'sample, document, academic, ' . $documentTypes[array_rand($documentTypes)],
                'file_path' => 'documents/sample_document_' . $i . '.pdf',
                'file_size' => rand(100000, 5000000), // 100KB to 5MB
                'file_type' => 'pdf',
                'version' => '1.0',
                'is_featured' => rand(0, 1),
                'status' => $status,
                'views' => rand(0, 1000),
                'downloads' => rand(0, 500),
                'user_id' => $userId,
                'created_at' => Carbon::now()->subDays(rand(0, 365)),
                'updated_at' => Carbon::now()->subDays(rand(0, 365)),
            ]);
        }

        // Seed Document Reviews
        $documents = DB::table('documents')->where('status', '!=', 'pending')->get();
        $reviewers = DB::table('users')->where('role', 'department_head')->pluck('id')->toArray();
        
        foreach ($documents as $document) {
            if ($document->status !== 'pending') {
                DB::table('document_reviews')->insert([
                    'document_id' => $document->id,
                    'reviewer_id' => $reviewers[array_rand($reviewers)],
                    'status' => $document->status,
                    'comments' => 'This document has been reviewed and ' . $document->status,
                    'created_at' => $document->created_at,
                    'updated_at' => $document->updated_at,
                ]);
            }
        }

        // Seed Document Analytics
        $documents = DB::table('documents')->get();
        $users = DB::table('users')->pluck('id')->toArray();
        $actions = ['view', 'download', 'preview', 'search_result'];
        
        foreach ($documents as $document) {
            $numAnalytics = rand(5, 50);
            for ($i = 0; $i < $numAnalytics; $i++) {
                DB::table('document_analytics')->insert([
                    'document_id' => $document->id,
                    'user_id' => $users[array_rand($users)],
                    'action' => $actions[array_rand($actions)],
                    'ip_address' => '192.168.1.' . rand(1, 255),
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'session_id' => 'session_' . rand(1000, 9999),
                    'metadata' => json_encode(['search_term' => 'sample', 'filter' => 'all']),
                    'created_at' => Carbon::now()->subDays(rand(0, 30)),
                ]);
            }
        }

        // Seed Notifications
        $users = DB::table('users')->pluck('id')->toArray();
        $notificationTypes = ['document_approved', 'document_rejected', 'system_alert', 'new_document', 'deadline_reminder'];
        
        for ($i = 0; $i < 100; $i++) {
            DB::table('notifications')->insert([
                'user_id' => $users[array_rand($users)],
                'type' => $notificationTypes[array_rand($notificationTypes)],
                'title' => 'Notification ' . ($i + 1),
                'message' => 'This is a sample notification message for notification ' . ($i + 1),
                'data' => json_encode(['document_id' => rand(1, 50), 'action' => 'sample']),
                'priority' => ['low', 'medium', 'high', 'urgent'][array_rand(['low', 'medium', 'high', 'urgent'])],
                'is_read' => rand(0, 1),
                'read_at' => rand(0, 1) ? Carbon::now()->subDays(rand(0, 7)) : null,
                'created_at' => Carbon::now()->subDays(rand(0, 30)),
                'updated_at' => Carbon::now()->subDays(rand(0, 30)),
            ]);
        }

        // Seed User Activities
        $users = DB::table('users')->pluck('id')->toArray();
        $actions = ['login', 'logout', 'session_start', 'session_end', 'password_change', 'profile_update'];
        
        for ($i = 0; $i < 200; $i++) {
            DB::table('user_activities')->insert([
                'user_id' => $users[array_rand($users)],
                'action' => $actions[array_rand($actions)],
                'ip_address' => '192.168.1.' . rand(1, 255),
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'session_id' => 'session_' . rand(1000, 9999),
                'metadata' => json_encode(['browser' => 'Chrome', 'device' => 'Desktop']),
                'success' => rand(0, 10) > 1, // 90% success rate
                'failure_reason' => rand(0, 10) <= 1 ? 'Invalid credentials' : null,
                'created_at' => Carbon::now()->subDays(rand(0, 30)),
            ]);
        }

        // Seed Audit Logs
        $users = DB::table('users')->pluck('id')->toArray();
        $actions = ['document_upload', 'document_view', 'document_download', 'document_review', 'user_login', 'user_logout', 'system_backup', 'user_created', 'user_updated'];
        
        for ($i = 0; $i < 150; $i++) {
            DB::table('audit_logs')->insert([
                'user_id' => $users[array_rand($users)],
                'action' => $actions[array_rand($actions)],
                'details' => 'Audit log entry ' . ($i + 1) . ' for action: ' . $actions[array_rand($actions)],
                'ip_address' => '192.168.1.' . rand(1, 255),
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'session_id' => 'session_' . rand(1000, 9999),
                'severity' => ['low', 'medium', 'high', 'critical'][array_rand(['low', 'medium', 'high', 'critical'])],
                'created_at' => Carbon::now()->subDays(rand(0, 30)),
                'updated_at' => Carbon::now()->subDays(rand(0, 30)),
            ]);
        }

        $this->command->info('Enhanced database seeding completed successfully!');
        $this->command->info('Created:');
        $this->command->info('- ' . count($departments) . ' departments');
        $this->command->info('- ' . count($categories) . ' categories');
        $this->command->info('- ' . count($users) . ' users');
        $this->command->info('- 50 documents');
        $this->command->info('- Document reviews');
        $this->command->info('- Document analytics');
        $this->command->info('- Notifications');
        $this->command->info('- User activities');
        $this->command->info('- Audit logs');
    }
}
