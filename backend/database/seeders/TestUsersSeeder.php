<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Keep departments minimal for FK integrity
        if (DB::table('departments')->count() === 0) {
            DB::table('departments')->insert([
                ['name' => 'Computer Science and Engineering', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        $deptId = DB::table('departments')->value('id');

        // Create roles first
        $roles = ['student', 'teacher', 'department_head', 'college_dean', 'it_manager'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $users = [
            ['name' => 'Test Student', 'email' => 'student@test.com', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'STU001', 'department_id' => $deptId],
            ['name' => 'Test Teacher', 'email' => 'teacher@test.com', 'password' => Hash::make('12121212'), 'role' => 'teacher', 'department_id' => $deptId],
            ['name' => 'Test Dept Head', 'email' => 'head@test.com', 'password' => Hash::make('12121212'), 'role' => 'department_head', 'department_id' => $deptId],
            ['name' => 'Test Dean', 'email' => 'dean@test.com', 'password' => Hash::make('12121212'), 'role' => 'college_dean', 'department_id' => $deptId],
            ['name' => 'Test IT Manager', 'email' => 'it@test.com', 'password' => Hash::make('12121212'), 'role' => 'it_manager', 'department_id' => $deptId],
        ];

        foreach ($users as $u) {
            $userId = DB::table('users')->insertGetId(array_merge($u, [
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]));
            
            // Assign role to user
            $user = \App\Models\User::find($userId);
            $user->assignRole($u['role']);
        }
    }
}


