<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AASTUDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();
        DB::table('departments')->truncate();
        DB::table('colleges')->truncate();
        DB::table('categories')->truncate();
        DB::table('audit_logs')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Insert colleges first
        $colleges = [
            [
                'name' => 'College of Engineering',
                'code' => 'COE',
                'description' => 'AASTU\'s largest and fastest-growing college, enrolling about 90% of all students',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'College of Natural and Applied Sciences',
                'code' => 'CNAS',
                'description' => 'Offers core science and applied science disciplines',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'College of Social Sciences & Humanities',
                'code' => 'CSSH',
                'description' => 'Focused on management-related programs',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Centers of Excellence & Research',
                'code' => 'CER',
                'description' => 'Interdisciplinary research centers targeting strategic, nationally prioritized fields',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($colleges as $college) {
            DB::table('colleges')->insert($college);
        }

        // Insert categories
        $categories = [
            ['name' => 'Lecture Notes', 'description' => 'Course lecture materials and notes'],
            ['name' => 'Assignments', 'description' => 'Student assignments and homework'],
            ['name' => 'Research Papers', 'description' => 'Academic research papers and publications'],
            ['name' => 'Lab Manuals', 'description' => 'Laboratory manuals and procedures'],
            ['name' => 'Exams', 'description' => 'Examination papers and solutions'],
            ['name' => 'Presentations', 'description' => 'Presentation slides and materials'],
            ['name' => 'Reports', 'description' => 'Technical reports and documentation'],
            ['name' => 'Theses', 'description' => 'Graduate theses and dissertations'],
            ['name' => 'Project Reports', 'description' => 'Student and faculty project reports'],
            ['name' => 'Technical Specifications', 'description' => 'Technical specifications and standards'],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert([
                'name' => $category['name'],
                'description' => $category['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert departments (complete AASTU structure)
        $departments = [
            // 1. College of Engineering - AASTU's largest and fastest-growing college, enrolling about 90% of all students
            ['name' => 'Architecture (Architectural Engineering)', 'description' => 'Architectural Engineering Department', 'college' => 'COE'],
            ['name' => 'Chemical Engineering', 'description' => 'Chemical Engineering Department', 'college' => 'COE'],
            ['name' => 'Civil Engineering', 'description' => 'Civil Engineering Department', 'college' => 'COE'],
            ['name' => 'Electrical and Computer Engineering', 'description' => 'Electrical and Computer Engineering Department', 'college' => 'COE'],
            ['name' => 'Electromechanical Engineering', 'description' => 'Electromechanical Engineering Department', 'college' => 'COE'],
            ['name' => 'Environmental Engineering', 'description' => 'Environmental Engineering Department', 'college' => 'COE'],
            ['name' => 'Mechanical Engineering', 'description' => 'Mechanical Engineering Department', 'college' => 'COE'],
            ['name' => 'Mining Engineering', 'description' => 'Mining Engineering Department', 'college' => 'COE'],
            ['name' => 'Software Engineering', 'description' => 'Software Engineering Department', 'college' => 'COE'],
            
            // 2. College of Natural and Applied Sciences - Offers core science and applied science disciplines
            ['name' => 'Biotechnology', 'description' => 'Biotechnology Department', 'college' => 'CNAS'],
            ['name' => 'Food Science and Applied Nutrition', 'description' => 'Food Science and Applied Nutrition Department', 'college' => 'CNAS'],
            ['name' => 'Geology', 'description' => 'Geology Department', 'college' => 'CNAS'],
            ['name' => 'Industrial Chemistry', 'description' => 'Industrial Chemistry Department', 'college' => 'CNAS'],
            
            // 3. College of Social Sciences & Humanities - Focused on management-related programs
            ['name' => 'Master of Business Administration (MBA)', 'description' => 'Master of Business Administration Program', 'college' => 'CSSH'],
            ['name' => 'Industrial Management', 'description' => 'MBA Specialization - Industrial Management', 'college' => 'CSSH'],
            ['name' => 'Construction Management', 'description' => 'MBA Specialization - Construction Management', 'college' => 'CSSH'],
            
            // 4. Centers of Excellence & Research - Interdisciplinary research centers targeting strategic, nationally prioritized fields
            ['name' => 'Artificial Intelligence and Robotics', 'description' => 'AI and Robotics Research Center', 'college' => 'CER'],
            ['name' => 'Biotechnology and Bioprocessing', 'description' => 'Biotechnology Research Center', 'college' => 'CER'],
            ['name' => 'Construction Quality and Technology', 'description' => 'Construction Technology Research Center', 'college' => 'CER'],
            ['name' => 'High-Performance Computing and Big Data Analytics', 'description' => 'HPC and Big Data Research Center', 'college' => 'CER'],
            ['name' => 'Mineral Exploration, Extraction and Processing', 'description' => 'Mineral Processing Research Center', 'college' => 'CER'],
            ['name' => 'Nanotechnology', 'description' => 'Nanotechnology Research Center', 'college' => 'CER'],
            ['name' => 'Nuclear Reactor Technology', 'description' => 'Nuclear Technology Research Center', 'college' => 'CER'],
            ['name' => 'Sustainable Energy', 'description' => 'Sustainable Energy Research Center', 'college' => 'CER'],
        ];

        // Get college IDs for department assignment
        $collegeIds = DB::table('colleges')->get()->keyBy('code');
        
        foreach ($departments as $department) {
            DB::table('departments')->insert([
                'name' => $department['name'],
                'description' => $department['description'],
                'college_id' => $collegeIds[$department['college']]->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert sample users (5 users for each role for demo and testing)
        // Password is 'password' hashed with bcrypt

        // Students (5 users)
        $students = [
            ['name' => 'Abebe Kebede', 'email' => 'abebe.kebede@aastu.edu.et', 'student_id' => 'ETS-2021-001', 'department_id' => 1],
            ['name' => 'Kebede Alemu', 'email' => 'kebede.alemu@aastu.edu.et', 'student_id' => 'ETS-2021-002', 'department_id' => 3],
            ['name' => 'Alemu Tadesse', 'email' => 'alemu.tadesse@aastu.edu.et', 'student_id' => 'ETS-2021-003', 'department_id' => 4],
            ['name' => 'Tadesse Worku', 'email' => 'tadesse.worku@aastu.edu.et', 'student_id' => 'ETS-2021-004', 'department_id' => 7],
            ['name' => 'Worku Mulugeta', 'email' => 'worku.mulugeta@aastu.edu.et', 'student_id' => 'ETS-2021-005', 'department_id' => 9],
        ];

        foreach ($students as $student) {
            DB::table('users')->insert([
                'name' => $student['name'],
                'email' => $student['email'],
                'password' => Hash::make('password'),
                'role' => 'student',
                'student_id' => $student['student_id'],
                'department_id' => $student['department_id'],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Teachers (5 users)
        $teachers = [
            ['name' => 'Dr. Yohannes Assefa', 'email' => 'yohannes.assefa@aastu.edu.et', 'department_id' => 1],
            ['name' => 'Dr. Assefa Bekele', 'email' => 'assefa.bekele@aastu.edu.et', 'department_id' => 3],
            ['name' => 'Dr. Bekele Haile', 'email' => 'bekele.haile@aastu.edu.et', 'department_id' => 4],
            ['name' => 'Dr. Haile Girma', 'email' => 'haile.girma@aastu.edu.et', 'department_id' => 7],
            ['name' => 'Dr. Girma Tesfaye', 'email' => 'girma.tesfaye@aastu.edu.et', 'department_id' => 9],
        ];

        foreach ($teachers as $teacher) {
            DB::table('users')->insert([
                'name' => $teacher['name'],
                'email' => $teacher['email'],
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'department_id' => $teacher['department_id'],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Department Heads (5 users)
        $departmentHeads = [
            ['name' => 'Prof. Tesfaye Desta', 'email' => 'tesfaye.desta@aastu.edu.et', 'department_id' => 1],
            ['name' => 'Prof. Desta Negussie', 'email' => 'desta.negussie@aastu.edu.et', 'department_id' => 3],
            ['name' => 'Prof. Negussie Taye', 'email' => 'negussie.taye@aastu.edu.et', 'department_id' => 4],
            ['name' => 'Prof. Taye Solomon', 'email' => 'taye.solomon@aastu.edu.et', 'department_id' => 7],
            ['name' => 'Prof. Solomon Demeke', 'email' => 'solomon.demeke@aastu.edu.et', 'department_id' => 9],
        ];

        foreach ($departmentHeads as $head) {
            DB::table('users')->insert([
                'name' => $head['name'],
                'email' => $head['email'],
                'password' => Hash::make('password'),
                'role' => 'department_head',
                'department_id' => $head['department_id'],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // College Deans (5 users)
        $collegeDeans = [
            ['name' => 'Prof. Demeke Abebe', 'email' => 'demeke.abebe@aastu.edu.et'],
            ['name' => 'Prof. Abebe Kebede', 'email' => 'abebe.kebede.dean@aastu.edu.et'],
            ['name' => 'Prof. Kebede Alemu', 'email' => 'kebede.alemu.dean@aastu.edu.et'],
            ['name' => 'Prof. Alemu Tadesse', 'email' => 'alemu.tadesse.dean@aastu.edu.et'],
            ['name' => 'Prof. Tadesse Worku', 'email' => 'tadesse.worku.dean@aastu.edu.et'],
        ];

        foreach ($collegeDeans as $dean) {
            DB::table('users')->insert([
                'name' => $dean['name'],
                'email' => $dean['email'],
                'password' => Hash::make('password'),
                'role' => 'college_dean',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // IT Managers (5 users)
        $itManagers = [
            ['name' => 'Eng. Worku Mulugeta', 'email' => 'worku.mulugeta.it@aastu.edu.et'],
            ['name' => 'Eng. Mulugeta Yohannes', 'email' => 'mulugeta.yohannes.it@aastu.edu.et'],
            ['name' => 'Eng. Yohannes Assefa', 'email' => 'yohannes.assefa.it@aastu.edu.et'],
            ['name' => 'Eng. Assefa Bekele', 'email' => 'assefa.bekele.it@aastu.edu.et'],
            ['name' => 'Eng. Bekele Haile', 'email' => 'bekele.haile.it@aastu.edu.et'],
        ];

        foreach ($itManagers as $manager) {
            DB::table('users')->insert([
                'name' => $manager['name'],
                'email' => $manager['email'],
                'password' => Hash::make('password'),
                'role' => 'it_manager',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert sample audit logs
        DB::table('audit_logs')->insert([
            ['user_id' => 1, 'action' => 'user_login', 'details' => 'User logged in successfully', 'ip_address' => '127.0.0.1', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => 2, 'action' => 'user_login', 'details' => 'User logged in successfully', 'ip_address' => '127.0.0.1', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => 3, 'action' => 'user_login', 'details' => 'User logged in successfully', 'ip_address' => '127.0.0.1', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $this->command->info('AASTU Database seeded successfully!');
        $this->command->info('Total users created: ' . DB::table('users')->count());
        $this->command->info('Total departments created: ' . DB::table('departments')->count());
        $this->command->info('Total categories created: ' . DB::table('categories')->count());
    }
}
