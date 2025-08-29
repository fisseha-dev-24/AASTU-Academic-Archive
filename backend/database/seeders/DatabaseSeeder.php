<?php  

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Department;
use App\Models\Category;
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
        $departments = [
            'Computer Science',
            'Electrical Engineering', 
            'Mechanical Engineering',
            'Civil Engineering',
            'Architecture',
            'Computer Science and Engineering',
            'Electrical and Computer Engineering',
            'Chemical Engineering',
            'Applied Mathematics',
            'Applied Physics',
            'Applied Chemistry',
            'Applied Biology'
        ];
        
        foreach ($departments as $deptName) {
            Department::firstOrCreate(['name' => $deptName]);
        }
        
        // Create categories
        $categories = [
            'Thesis',
            'Senior Project',
            'Research Paper',
            'Course Material',
            'Past Exam',
            'Lecture Notes',
            'Assignments',
            'Lab Manuals',
            'Exams',
            'Presentations',
            'Reports'
        ];
        
        foreach ($categories as $catName) {
            Category::firstOrCreate(['name' => $catName]);
        }
        
        $cs = Department::where('name', 'Computer Science and Engineering')->first();
        $ee = Department::where('name', 'Electrical Engineering')->first();
        $thesis = Category::where('name', 'Thesis')->first();
        $lectureNotes = Category::where('name', 'Lecture Notes')->first();

        // 3. Create users for each role
        $users = [
            'student' => User::firstOrCreate(
                ['email' => 'fisseha.akele@aastustudent.edu.et'],
                [
                    'name' => 'fisseha akele',
                    'password' => Hash::make('password123'),
                    'department_id' => $cs->id,
                    'student_id' => 'ETS0675/14',
                    'role' => 'student'
                ]
            ),
            'teacher' => User::firstOrCreate(
                ['email' => 'firaol.nigusse@aastustudent.edu.et'],
                [
                    'name' => 'firaol nigusse',
                    'password' => Hash::make('password123'),
                    'department_id' => $cs->id,
                    'role' => 'teacher'
                ]
            ),
            'department_head' => User::firstOrCreate(
                ['email' => 'burka.labsi@aastustudent.edu.et'],
                [
                    'name' => 'burka labsi',
                    'password' => Hash::make('password123'),
                    'department_id' => $cs->id,
                    'role' => 'department_head'
                ]
            ),
            'college_dean' => User::firstOrCreate(
                ['email' => 'henoktademe@gmail.com'],
                [
                    'name' => 'henok tademe',
                    'password' => Hash::make('password123'),
                    'department_id' => $ee->id,
                    'role' => 'college_dean'
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
            'author' => 'fisseha akele',
            'department_id' => $cs->id,
            'user_id' => $users['student']->id,
            'category_id' => $thesis->id,
            'year' => 2023,
            'supervisor' => 'Prof. Teacher',
            'document_type' => 'thesis',
            'keywords' => 'AI, Education',
            'file_path' => 'documents/sample_ai.pdf',
            'status' => 'pending'
        ]);

        Document::firstOrCreate([
            'title' => 'Smart Grids Research',
            'author' => 'firaol nigusse',
            'department_id' => $ee->id,
            'user_id' => $users['teacher']->id,
            'category_id' => $lectureNotes->id,
            'year' => 2024,
            'supervisor' => 'Head User',
            'document_type' => 'lecture_notes',
            'keywords' => 'Energy, Smart Grid',
            'file_path' => 'documents/sample_grid.pdf',
            'status' => 'approved'
        ]);

        // 6. Create additional teacher documents for feedback
        Document::firstOrCreate([
            'title' => 'Introduction to Trees and Graphs',
            'author' => 'firaol nigusse',
            'department_id' => $cs->id,
            'user_id' => $users['teacher']->id,
            'category_id' => $lectureNotes->id,
            'year' => 2024,
            'supervisor' => 'Head User',
            'document_type' => 'lecture_notes',
            'keywords' => 'Data Structures, Trees, Graphs',
            'file_path' => 'documents/trees_graphs.pdf',
            'status' => 'approved'
        ]);

        Document::firstOrCreate([
            'title' => 'Database Normalization Tutorial',
            'author' => 'firaol nigusse',
            'department_id' => $cs->id,
            'user_id' => $users['teacher']->id,
            'category_id' => $lectureNotes->id,
            'year' => 2024,
            'supervisor' => 'Head User',
            'document_type' => 'lecture_notes',
            'keywords' => 'Database, Normalization',
            'file_path' => 'documents/normalization.pdf',
            'status' => 'approved'
        ]);

        Document::firstOrCreate([
            'title' => 'Agile Development Methodology',
            'author' => 'firaol nigusse',
            'department_id' => $cs->id,
            'user_id' => $users['teacher']->id,
            'category_id' => $lectureNotes->id,
            'year' => 2024,
            'supervisor' => 'Head User',
            'document_type' => 'lecture_notes',
            'keywords' => 'Agile, Software Development',
            'file_path' => 'documents/agile.pdf',
            'status' => 'approved'
        ]);

        Document::firstOrCreate([
            'title' => 'React Hooks Deep Dive',
            'author' => 'firaol nigusse',
            'department_id' => $cs->id,
            'user_id' => $users['teacher']->id,
            'category_id' => $lectureNotes->id,
            'year' => 2024,
            'supervisor' => 'Head User',
            'document_type' => 'lecture_notes',
            'keywords' => 'React, Hooks, Web Development',
            'file_path' => 'documents/react_hooks.pdf',
            'status' => 'approved'
        ]);

        // 7. Create sample feedback for different documents
        $documents = Document::where('user_id', $users['teacher']->id)->get();
        $courses = [
            'Data Structures & Algorithms',
            'Database Systems', 
            'Software Engineering',
            'Web Development'
        ];

        foreach ($documents as $index => $doc) {
            if ($index < count($courses)) {
                \App\Models\Feedback::firstOrCreate([
                    'document_id' => $doc->id,
                    'student_id' => $users['student']->id,
                    'teacher_id' => $users['teacher']->id,
                    'course_name' => $courses[$index],
                    'rating' => rand(3, 5),
                    'comment' => 'Sample feedback for ' . $courses[$index] . ' course.',
                    'is_helpful' => rand(0, 1),
                ]);
            }
        }

        // 8. Create sample schedule data
        \App\Models\Schedule::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'title' => 'Data Structures & Algorithms',
            'code' => 'CS301',
            'type' => 'lecture',
            'day' => 'Monday',
            'time' => '09:00 - 11:00',
            'location' => 'Room 201, Building A',
            'students' => 32,
        ]);

        \App\Models\Schedule::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'title' => 'Database Systems',
            'code' => 'CS302',
            'type' => 'lecture',
            'day' => 'Tuesday',
            'time' => '14:00 - 16:00',
            'location' => 'Room 305, Building B',
            'students' => 28,
        ]);

        \App\Models\Schedule::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'title' => 'Data Structures Lab',
            'code' => 'CS301L',
            'type' => 'lab',
            'day' => 'Wednesday',
            'time' => '10:00 - 12:00',
            'location' => 'Computer Lab 1',
            'students' => 16,
        ]);

        \App\Models\Schedule::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'title' => 'Software Engineering',
            'code' => 'CS401',
            'type' => 'lecture',
            'day' => 'Thursday',
            'time' => '11:00 - 13:00',
            'location' => 'Room 102, Building C',
            'students' => 25,
        ]);

        \App\Models\Schedule::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'title' => 'Database Systems Lab',
            'code' => 'CS302L',
            'type' => 'lab',
            'day' => 'Friday',
            'time' => '08:00 - 10:00',
            'location' => 'Computer Lab 2',
            'students' => 14,
        ]);

        // 9. Create sample deadlines
        \App\Models\Deadline::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'title' => 'Assignment 3 - Data Structures',
            'course_code' => 'CS301',
            'type' => 'assignment',
            'priority' => 'high',
            'due_date' => now()->addDays(7),
            'description' => 'Implement binary search tree operations',
        ]);

        \App\Models\Deadline::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'title' => 'Midterm Exam - Database Systems',
            'course_code' => 'CS302',
            'type' => 'exam',
            'priority' => 'high',
            'due_date' => now()->addDays(14),
            'description' => 'Covering normalization and SQL queries',
        ]);

        \App\Models\Deadline::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'title' => 'Project Proposal - Software Engineering',
            'course_code' => 'CS401',
            'type' => 'project',
            'priority' => 'medium',
            'due_date' => now()->addDays(21),
            'description' => 'Submit project proposal document',
        ]);

        // 10. Create sample office hours
        \App\Models\OfficeHour::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'day' => 'Monday',
            'time' => '14:00 - 16:00',
            'location' => 'Office 301, Faculty Building',
            'type' => 'regular',
            'notes' => 'Available for consultation on Data Structures',
        ]);

        \App\Models\OfficeHour::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'day' => 'Wednesday',
            'time' => '15:00 - 17:00',
            'location' => 'Office 301, Faculty Building',
            'type' => 'regular',
            'notes' => 'Available for consultation on Database Systems',
        ]);

        \App\Models\OfficeHour::firstOrCreate([
            'teacher_id' => $users['teacher']->id,
            'day' => 'Friday',
            'time' => '13:00 - 14:00',
            'location' => 'Online (Zoom)',
            'type' => 'online',
            'notes' => 'Virtual office hours for all courses',
        ]);
    }
}
