<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user (using it_manager role)
        User::updateOrCreate(
            ['email' => 'admin@aastu.edu.et'],
            [
                'name' => 'System Administrator',
                'email' => 'admin@aastu.edu.et',
                'password' => Hash::make('admin123'),
                'role' => 'it_manager',
                'email_verified_at' => now(),
                'college_id' => 1, // Assign to College of Engineering
            ]
        );

        // Create IT Manager user
        User::updateOrCreate(
            ['email' => 'it.manager@aastu.edu.et'],
            [
                'name' => 'IT Manager',
                'email' => 'it.manager@aastu.edu.et',
                'password' => Hash::make('itmanager123'),
                'role' => 'it_manager',
                'email_verified_at' => now(),
                'college_id' => 1, // Assign to College of Engineering
            ]
        );

        $this->command->info('Admin users created successfully!');
        $this->command->info('Admin: admin@aastu.edu.et / admin123');
        $this->command->info('IT Manager: it.manager@aastu.edu.et / itmanager123');
    }
}