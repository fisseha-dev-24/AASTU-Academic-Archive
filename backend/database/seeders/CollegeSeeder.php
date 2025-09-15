<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\College;
use App\Models\Department;
use App\Models\User;

class CollegeSeeder extends Seeder
{
    public function run(): void
    {
        // Create colleges
        $colleges = [
            [
                'name' => 'College of Engineering',
                'code' => 'COE',
                'description' => 'College of Engineering and Technology',
                'dean_id' => null, // Will be set later
                'is_active' => true
            ],
            [
                'name' => 'College of Applied Sciences',
                'code' => 'CAS',
                'description' => 'College of Applied Sciences and Technology',
                'dean_id' => null, // Will be set later
                'is_active' => true
            ],
            [
                'name' => 'College of Business and Economics',
                'code' => 'CBE',
                'description' => 'College of Business and Economics',
                'dean_id' => null, // Will be set later
                'is_active' => true
            ]
        ];

        foreach ($colleges as $collegeData) {
            College::create($collegeData);
        }

        // Update existing departments with college assignments
        $departments = [
            'Computer Science and Engineering' => 'COE',
            'Electrical Engineering' => 'COE',
            'Mechanical Engineering' => 'COE',
            'Civil Engineering' => 'COE',
            'Chemical Engineering' => 'COE',
            'Software Engineering' => 'COE',
            'Information Technology' => 'COE',
            'Applied Mathematics' => 'CAS',
            'Applied Physics' => 'CAS',
            'Applied Chemistry' => 'CAS',
            'Applied Biology' => 'CAS',
            'Business Administration' => 'CBE',
            'Economics' => 'CBE',
            'Accounting' => 'CBE',
            'Management' => 'CBE'
        ];

        foreach ($departments as $deptName => $collegeCode) {
            $college = College::where('code', $collegeCode)->first();
            if ($college) {
                Department::where('name', $deptName)->update(['college_id' => $college->id]);
            }
        }

        // Assign college deans (if they exist)
        $deanAssignments = [
            'dean@test.com' => 'COE', // Test dean assigned to College of Engineering
        ];

        foreach ($deanAssignments as $email => $collegeCode) {
            $user = User::where('email', $email)->first();
            $college = College::where('code', $collegeCode)->first();
            
            if ($user && $college) {
                $college->update(['dean_id' => $user->id]);
            }
        }
    }
}