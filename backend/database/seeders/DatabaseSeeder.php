<?php  

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Department;
use App\Models\Document;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create default roles
        $roles = ['student', 'teacher', 'department_head', 'college_dean', 'admin'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // 2. Create sample departments
        $cs = Department::firstOrCreate(['name' => 'Computer Science']);
        $ee = Department::firstOrCreate(['name' => 'Electrical Engineering']);

        // 3. Create users for each role
        $users = [
            'student' => User::firstOrCreate(
                ['email' => 'student@example.com'],
                [
                    'name' => 'Student User',
                    'password' => Hash::make('password123'),
                    'department_id' => $cs->id
                ]
            ),
            'teacher' => User::firstOrCreate(
                ['email' => 'teacher@example.com'],
                [
                    'name' => 'Teacher User',
                    'password' => Hash::make('password123'),
                    'department_id' => $cs->id
                ]
            ),
            'department_head' => User::firstOrCreate(
                ['email' => 'head@example.com'],
                [
                    'name' => 'Department Head',
                    'password' => Hash::make('password123'),
                    'department_id' => $cs->id
                ]
            ),
            'college_dean' => User::firstOrCreate(
                ['email' => 'dean@example.com'],
                [
                    'name' => 'College Dean',
                    'password' => Hash::make('password123'),
                    'department_id' => $ee->id
                ]
            ),
            'admin' => User::firstOrCreate(
                ['email' => 'admin@example.com'],
                [
                    'name' => 'System Admin',
                    'password' => Hash::make('password123'),
                    'department_id' => null
                ]
            )
        ];

        // 4. Assign roles
        foreach ($users as $role => $user) {
            $user->syncRoles([$role]); // each user gets their role
        }

        // 5. Create sample documents
        Document::firstOrCreate([
            'title' => 'AI in Education',
            'author' => 'John Student',
            'department_id' => $cs->id,
            'user_id' => $users['student']->id,
            'category_id' => null,
            'year' => 2023,
            'supervisor' => 'Prof. Teacher',
            'document_type' => 'thesis',
            'keywords' => 'AI, Education',
            'file_path' => 'documents/sample_ai.pdf',
            'status' => 'pending'
        ]);

        Document::firstOrCreate([
            'title' => 'Smart Grids Research',
            'author' => 'Jane Teacher',
            'department_id' => $ee->id,
            'user_id' => $users['teacher']->id,
            'category_id' => null,
            'year' => 2024,
            'supervisor' => 'Head User',
            'document_type' => 'project',
            'keywords' => 'Energy, Smart Grid',
            'file_path' => 'documents/sample_grid.pdf',
            'status' => 'approved'
        ]);
    }
}
