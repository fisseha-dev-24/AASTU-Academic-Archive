<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create default roles
        collect([
            'student',
            'teacher',
            'department_head',
            'college_dean',
            'admin'
        ])->each(function ($role) {
            Role::firstOrCreate(
                ['name' => $role, 'guard_name' => 'web']
            );
        });

        // 2. Create example admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password123'),
                'department_id' => null
            ]
        );

        // 3. Assign admin role if not already assigned
        $admin->syncRoles(['admin']); // Ensures only 'admin' is assigned
    }
}
