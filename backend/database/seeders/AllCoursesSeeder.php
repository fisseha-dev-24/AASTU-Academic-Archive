<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class AllCoursesSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing courses
        Course::truncate();

        // All departments courses
        $allCourses = [
            // Architecture (Dept 1)
            1 => [
                ['code' => 'ARCH101', 'name' => 'Architectural Design I', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
                ['code' => 'ARCH102', 'name' => 'Architectural History', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
                ['code' => 'ARCH201', 'name' => 'Building Construction', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
                ['code' => 'ARCH202', 'name' => 'Structural Design', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
                ['code' => 'ARCH301', 'name' => 'Urban Planning', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
                ['code' => 'ARCH302', 'name' => 'Environmental Design', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
                ['code' => 'ARCH401', 'name' => 'Thesis Project', 'credits' => 6, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
            ],
            // Chemical Engineering (Dept 2)
            2 => [
                ['code' => 'CHE101', 'name' => 'Introduction to Chemical Engineering', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
                ['code' => 'CHE102', 'name' => 'Chemical Process Principles', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
                ['code' => 'CHE201', 'name' => 'Thermodynamics', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
                ['code' => 'CHE202', 'name' => 'Heat Transfer', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
                ['code' => 'CHE301', 'name' => 'Process Control', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
                ['code' => 'CHE302', 'name' => 'Plant Design', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
                ['code' => 'CHE401', 'name' => 'Process Optimization', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
            ],
            // Civil Engineering (Dept 3)
            3 => [
                ['code' => 'CIV101', 'name' => 'Introduction to Civil Engineering', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
                ['code' => 'CIV102', 'name' => 'Engineering Mechanics', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
                ['code' => 'CIV201', 'name' => 'Structural Analysis', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
                ['code' => 'CIV202', 'name' => 'Concrete Design', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
                ['code' => 'CIV301', 'name' => 'Steel Design', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
                ['code' => 'CIV302', 'name' => 'Foundation Engineering', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
                ['code' => 'CIV401', 'name' => 'Highway Engineering', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
            ],
            // Electrical and Computer Engineering (Dept 4)
            4 => [
                ['code' => 'ECE101', 'name' => 'Circuit Analysis', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
                ['code' => 'ECE102', 'name' => 'Digital Logic Design', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
                ['code' => 'ECE201', 'name' => 'Electronics I', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
                ['code' => 'ECE202', 'name' => 'Signals and Systems', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
                ['code' => 'ECE301', 'name' => 'Power Systems', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
                ['code' => 'ECE302', 'name' => 'Control Systems', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
                ['code' => 'ECE401', 'name' => 'Power Electronics', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
            ],
            // Electromechanical Engineering (Dept 5)
            5 => [
                ['code' => 'EME101', 'name' => 'Mechanical Systems', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
                ['code' => 'EME102', 'name' => 'Electrical Systems', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
                ['code' => 'EME201', 'name' => 'Control Engineering', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
                ['code' => 'EME202', 'name' => 'Automation Systems', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
                ['code' => 'EME301', 'name' => 'Robotics', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
                ['code' => 'EME302', 'name' => 'Industrial Automation', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
                ['code' => 'EME401', 'name' => 'Mechatronics Design', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
            ],
            // Environmental Engineering (Dept 6)
            6 => [
                ['code' => 'ENV101', 'name' => 'Environmental Science', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
                ['code' => 'ENV102', 'name' => 'Water Resources', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
                ['code' => 'ENV201', 'name' => 'Water Treatment', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
                ['code' => 'ENV202', 'name' => 'Waste Management', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
                ['code' => 'ENV301', 'name' => 'Air Pollution Control', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
                ['code' => 'ENV302', 'name' => 'Environmental Impact Assessment', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
                ['code' => 'ENV401', 'name' => 'Sustainable Engineering', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
            ],
            // Mechanical Engineering (Dept 7)
            7 => [
                ['code' => 'MEC101', 'name' => 'Engineering Mechanics', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
                ['code' => 'MEC102', 'name' => 'Thermodynamics', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
                ['code' => 'MEC201', 'name' => 'Machine Design', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
                ['code' => 'MEC202', 'name' => 'Heat Transfer', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
                ['code' => 'MEC301', 'name' => 'Fluid Mechanics', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
                ['code' => 'MEC302', 'name' => 'Manufacturing Processes', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
                ['code' => 'MEC401', 'name' => 'Advanced Materials', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
            ],
            // Mining Engineering (Dept 8)
            8 => [
                ['code' => 'MIN101', 'name' => 'Introduction to Mining', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
                ['code' => 'MIN102', 'name' => 'Geology for Mining', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
                ['code' => 'MIN201', 'name' => 'Mine Planning', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
                ['code' => 'MIN202', 'name' => 'Rock Mechanics', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
                ['code' => 'MIN301', 'name' => 'Mine Safety', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
                ['code' => 'MIN302', 'name' => 'Mineral Processing', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
                ['code' => 'MIN401', 'name' => 'Mine Economics', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
            ],
            // Software Engineering (Dept 9)
            9 => [
                ['code' => 'CSE101', 'name' => 'Introduction to Computer Science', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
                ['code' => 'CSE102', 'name' => 'Programming Fundamentals', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
                ['code' => 'CSE201', 'name' => 'Data Structures', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
                ['code' => 'CSE202', 'name' => 'Algorithms', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
                ['code' => 'CSE301', 'name' => 'Database Systems', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
                ['code' => 'CSE302', 'name' => 'Software Engineering', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
                ['code' => 'CSE401', 'name' => 'Machine Learning', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
            ],
            // Biotechnology (Dept 10)
            10 => [
                ['code' => 'BIO101', 'name' => 'Cell Biology', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 1],
                ['code' => 'BIO102', 'name' => 'Molecular Biology', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 1],
                ['code' => 'BIO201', 'name' => 'Genetics', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '1', 'year' => 2],
                ['code' => 'BIO202', 'name' => 'Biochemistry', 'credits' => 4, 'level' => 'undergraduate', 'semester' => '2', 'year' => 2],
                ['code' => 'BIO301', 'name' => 'Biotechnology Applications', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 3],
                ['code' => 'BIO302', 'name' => 'Bioinformatics', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '2', 'year' => 3],
                ['code' => 'BIO401', 'name' => 'Biotech Research Methods', 'credits' => 3, 'level' => 'undergraduate', 'semester' => '1', 'year' => 4],
            ],
        ];

        // Create courses for each department
        foreach ($allCourses as $departmentId => $courses) {
            foreach ($courses as $courseData) {
                Course::create([
                    'course_code' => $courseData['code'],
                    'course_name' => $courseData['name'],
                    'description' => "Course description for {$courseData['name']}",
                    'credits' => $courseData['credits'],
                    'level' => $courseData['level'],
                    'semester' => $courseData['semester'],
                    'academic_year' => $courseData['year'],
                    'department_id' => $departmentId,
                    'teacher_id' => null,
                    'is_active' => true,
                ]);
            }
        }

        $this->command->info('All courses created successfully!');
    }
}
