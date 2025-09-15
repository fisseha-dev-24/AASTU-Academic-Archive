<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Department;

class FixCoursesDataSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing courses
        Course::truncate();

        // Civil Engineering courses (Department ID 3)
        $civilCourses = [
            ['code' => 'CIV101', 'name' => 'Introduction to Civil Engineering', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
            ['code' => 'CIV102', 'name' => 'Engineering Mechanics', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
            ['code' => 'CIV201', 'name' => 'Structural Analysis', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
            ['code' => 'CIV202', 'name' => 'Concrete Design', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
            ['code' => 'CIV301', 'name' => 'Steel Design', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
            ['code' => 'CIV302', 'name' => 'Foundation Engineering', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
            ['code' => 'CIV401', 'name' => 'Highway Engineering', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
        ];

        foreach ($civilCourses as $courseData) {
            Course::create([
                'course_code' => $courseData['code'],
                'course_name' => $courseData['name'],
                'description' => "Course description for {$courseData['name']}",
                'credits' => $courseData['credits'],
                'level' => $courseData['level'],
                'semester' => $courseData['semester'],
                'academic_year' => $courseData['year'],
                'department_id' => 3, // Civil Engineering
                'teacher_id' => null,
                'is_active' => true,
            ]);
        }

        // Software Engineering courses (Department ID 9)
        $softwareCourses = [
            ['code' => 'CSE101', 'name' => 'Introduction to Computer Science', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
            ['code' => 'CSE102', 'name' => 'Programming Fundamentals', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
            ['code' => 'CSE201', 'name' => 'Data Structures', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
            ['code' => 'CSE202', 'name' => 'Algorithms', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
            ['code' => 'CSE301', 'name' => 'Database Systems', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
            ['code' => 'CSE302', 'name' => 'Software Engineering', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
            ['code' => 'CSE401', 'name' => 'Machine Learning', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
        ];

        foreach ($softwareCourses as $courseData) {
            Course::create([
                'course_code' => $courseData['code'],
                'course_name' => $courseData['name'],
                'description' => "Course description for {$courseData['name']}",
                'credits' => $courseData['credits'],
                'level' => $courseData['level'],
                'semester' => $courseData['semester'],
                'academic_year' => $courseData['year'],
                'department_id' => 9, // Software Engineering
                'teacher_id' => null,
                'is_active' => true,
            ]);
        }

        $this->command->info('Courses data fixed successfully!');
    }
}