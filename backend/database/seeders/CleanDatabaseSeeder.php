<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Document;
use App\Models\Department;
use App\Models\Category;
use App\Models\DocumentAnalytics;
use App\Models\DocumentReview;
use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\UserActivity;

class CleanDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🧹 Starting clean database setup...');
        
        // Clear all data
        $this->clearAllData();
        
        // Create departments
        $this->createDepartments();
        
        // Create categories
        $this->createCategories();
        
        // Create users (2 for each role)
        $this->createUsers();
        
        $this->command->info('✅ Clean database setup completed!');
        $this->command->info('📊 Database now contains:');
        $this->command->info('   - 10 users (2 for each role)');
        $this->command->info('   - 0 documents');
        $this->command->info('   - Clean, organized structure');
    }
    
    private function clearAllData(): void
    {
        $this->command->info('🗑️  Clearing all existing data...');
        
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
        
        // Clear all tables
        DB::table('document_analytics')->truncate();
        DB::table('document_reviews')->truncate();
        DB::table('audit_logs')->truncate();
        DB::table('notifications')->truncate();
        DB::table('user_activities')->truncate();
        DB::table('documents')->truncate();
        DB::table('users')->truncate();
        DB::table('departments')->truncate();
        DB::table('categories')->truncate();
        
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
        
        // Reset auto-increment counters
        DB::statement('ALTER TABLE users AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE departments AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE categories AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE documents AUTO_INCREMENT = 1');
        
        $this->command->info('✅ All data cleared successfully');
    }
    
    private function createDepartments(): void
    {
        $this->command->info('🏢 Creating departments...');
        
        $departments = [
            ['name' => 'Computer Science', 'code' => 'CS', 'description' => 'Computer Science and Engineering'],
            ['name' => 'Electrical Engineering', 'code' => 'EE', 'description' => 'Electrical and Electronics Engineering'],
            ['name' => 'Mechanical Engineering', 'code' => 'ME', 'description' => 'Mechanical Engineering'],
            ['name' => 'Civil Engineering', 'code' => 'CE', 'description' => 'Civil and Environmental Engineering'],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'Information Technology'],
        ];
        
        foreach ($departments as $dept) {
            Department::create($dept);
        }
        
        $this->command->info('✅ 5 departments created');
    }
    
    private function createCategories(): void
    {
        $this->command->info('📂 Creating document categories...');
        
        $categories = [
            ['name' => 'Lecture Notes', 'description' => 'Course lecture materials'],
            ['name' => 'Assignments', 'description' => 'Homework and project assignments'],
            ['name' => 'Exams', 'description' => 'Previous exam papers and solutions'],
            ['name' => 'Research Papers', 'description' => 'Academic research publications'],
            ['name' => 'Tutorials', 'description' => 'Step-by-step learning guides'],
        ];
        
        foreach ($categories as $cat) {
            Category::create($cat);
        }
        
        $this->command->info('✅ 5 categories created');
    }
    
    private function createUsers(): void
    {
        $this->command->info('👥 Creating users (2 for each role)...');
        
        $departments = Department::all();
        $users = [];
        
        // Student users
        $users[] = [
            'name' => 'Abebe Kebede',
            'email' => 'abebe.kebede@aastu.edu.et',
            'password' => Hash::make('password'),
            'role' => 'student',
            'department_id' => $departments->random()->id,
            'student_id' => 'CS-2024-001',
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        $users[] = [
            'name' => 'Kebede Abebe',
            'email' => 'kebede.abebe@aastu.edu.et',
            'password' => Hash::make('password'),
            'role' => 'student',
            'department_id' => $departments->random()->id,
            'student_id' => 'EE-2024-002',
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Teacher users
        $users[] = [
            'name' => 'Dr. Alemayehu Tadesse',
            'email' => 'alemayehu.tadesse@aastu.edu.et',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'department_id' => $departments->random()->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        $users[] = [
            'name' => 'Dr. Tadesse Alemayehu',
            'email' => 'tadesse.alemayehu@aastu.edu.et',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'department_id' => $departments->random()->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Department Head users
        $users[] = [
            'name' => 'Prof. Mulugeta Haile',
            'email' => 'mulugeta.haile@aastu.edu.et',
            'password' => Hash::make('password'),
            'role' => 'department_head',
            'department_id' => $departments->random()->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        $users[] = [
            'name' => 'Prof. Haile Mulugeta',
            'email' => 'haile.mulugeta@aastu.edu.et',
            'password' => Hash::make('password'),
            'role' => 'department_head',
            'department_id' => $departments->random()->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // College Dean users
        $users[] = [
            'name' => 'Prof. Yohannes Desta',
            'email' => 'yohannes.desta@aastu.edu.et',
            'password' => Hash::make('password'),
            'role' => 'college_dean',
            'department_id' => $departments->random()->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        $users[] = [
            'name' => 'Prof. Desta Yohannes',
            'email' => 'desta.yohannes@aastu.edu.et',
            'password' => Hash::make('password'),
            'role' => 'college_dean',
            'department_id' => $departments->random()->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // IT Manager users
        $users[] = [
            'name' => 'Eng. Tekle Gebre',
            'email' => 'tekle.gebre@aastu.edu.et',
            'password' => Hash::make('password'),
            'role' => 'it_manager',
            'department_id' => $departments->random()->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        $users[] = [
            'name' => 'Eng. Gebre Tekle',
            'email' => 'gebre.tekle@aastu.edu.et',
            'password' => Hash::make('password'),
            'role' => 'it_manager',
            'department_id' => $departments->random()->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Create all users
        foreach ($users as $userData) {
            User::create($userData);
        }
        
        $this->command->info('✅ 10 users created (2 for each role)');
        
        // Display user summary
        $this->displayUserSummary();
    }
    
    private function displayUserSummary(): void
    {
        $this->command->info('📋 User Summary:');
        
        $roles = ['student', 'teacher', 'department_head', 'college_dean', 'it_manager'];
        
        foreach ($roles as $role) {
            $count = User::where('role', $role)->count();
            $users = User::where('role', $role)->get(['name', 'email']);
            
            $this->command->info("   {$role}: {$count} users");
            foreach ($users as $user) {
                $this->command->info("     - {$user->name} ({$user->email})");
            }
        }
        
        $this->command->info('');
        $this->command->info('🔑 All users have password: password');
        $this->command->info('📧 All emails are verified');
        $this->command->info('✅ All users are active');
    }
}
