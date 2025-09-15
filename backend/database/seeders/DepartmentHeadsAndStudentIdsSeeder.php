<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DepartmentHeadsAndStudentIdsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, update existing department heads to have proper department assignments
        $departmentHeads = [
            ['user_id' => 6, 'department_id' => 1, 'name' => 'Prof. Yonas Tadesse', 'email' => 'yonas.tadesse@aastu.edu.et'],
            ['user_id' => 7, 'department_id' => 3, 'name' => 'Prof. Genet Assefa', 'email' => 'genet.assefa@aastu.edu.et'],
            ['user_id' => 8, 'department_id' => 9, 'name' => 'Prof. Daniel Mekonnen', 'email' => 'daniel.mekonnen@aastu.edu.et'],
            ['user_id' => 9, 'department_id' => 10, 'name' => 'Prof. Bethlehem Hailu', 'email' => 'bethlehem.hailu@aastu.edu.et'],
        ];

        // Create additional department heads for remaining departments
        $additionalDepartmentHeads = [
            ['department_id' => 2, 'name' => 'Prof. Mesfin Worku', 'email' => 'mesfin.worku@aastu.edu.et'],
            ['department_id' => 4, 'name' => 'Prof. Getachew Tadesse', 'email' => 'getachew.tadesse@aastu.edu.et'],
            ['department_id' => 5, 'name' => 'Prof. Assefa Mekonnen', 'email' => 'assefa.mekonnen@aastu.edu.et'],
            ['department_id' => 6, 'name' => 'Prof. Gebre Hailu', 'email' => 'gebre.hailu@aastu.edu.et'],
            ['department_id' => 7, 'name' => 'Prof. Kebede Tesfaye', 'email' => 'kebede.tesfaye@aastu.edu.et'],
            ['department_id' => 8, 'name' => 'Prof. Tesfaye Getachew', 'email' => 'tesfaye.getachew@aastu.edu.et'],
            ['department_id' => 11, 'name' => 'Prof. Getachew Assefa', 'email' => 'getachew.assefa@aastu.edu.et'],
            ['department_id' => 12, 'name' => 'Prof. Assefa Hailu', 'email' => 'assefa.hailu@aastu.edu.et'],
            ['department_id' => 13, 'name' => 'Prof. Hailu Mekonnen', 'email' => 'hailu.mekonnen@aastu.edu.et'],
            ['department_id' => 14, 'name' => 'Prof. Mekonnen Tadesse', 'email' => 'mekonnen.tadesse@aastu.edu.et'],
            ['department_id' => 15, 'name' => 'Prof. Tadesse Worku', 'email' => 'tadesse.worku@aastu.edu.et'],
            ['department_id' => 16, 'name' => 'Prof. Worku Gebre', 'email' => 'worku.gebre@aastu.edu.et'],
        ];

        // Insert additional department heads
        foreach ($additionalDepartmentHeads as $head) {
            $userId = DB::table('users')->insertGetId([
                'name' => $head['name'],
                'email' => $head['email'],
                'password' => Hash::make('12121212'),
                'role' => 'department_head',
                'department_id' => $head['department_id'],
                'student_id' => null,
                'is_active' => 1,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            // Assign role in Spatie Permission
            DB::table('model_has_roles')->insert([
                'role_id' => 3, // department_head role
                'model_type' => 'App\\Models\\User',
                'model_id' => $userId,
            ]);
        }

        // Update student IDs to AASTU format
        $students = DB::table('users')->where('role', 'student')->get();
        
        foreach ($students as $index => $student) {
            // Generate AASTU student ID format: ETS + 4 digits + / + 2 digits
            $year = 14 + ($index % 3); // Years 14, 15, 16
            $studentNumber = str_pad(675 + $index, 4, '0', STR_PAD_LEFT);
            $studentId = "ETS{$studentNumber}/{$year}";
            
            DB::table('users')
                ->where('id', $student->id)
                ->update(['student_id' => $studentId]);
        }

        // Update department head_id in departments table
        $allDepartmentHeads = DB::table('users')
            ->where('role', 'department_head')
            ->get()
            ->keyBy('department_id');

        foreach ($allDepartmentHeads as $departmentId => $head) {
            DB::table('departments')
                ->where('id', $departmentId)
                ->update(['head_id' => $head->id]);
        }

        $this->command->info('Department heads assigned and student IDs updated successfully!');
    }
}
