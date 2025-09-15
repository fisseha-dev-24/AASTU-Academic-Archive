<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RealisticDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();
        DB::table('departments')->truncate();
        DB::table('colleges')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Insert colleges
        DB::table('colleges')->insert([
            ['id' => 1, 'name' => 'College of Engineering', 'code' => 'COE', 'description' => 'AASTU\'s largest college', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'College of Natural and Applied Sciences', 'code' => 'CNAS', 'description' => 'Science disciplines', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'College of Social Sciences & Humanities', 'code' => 'CSSH', 'description' => 'Management programs', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Centers of Excellence & Research', 'code' => 'CER', 'description' => 'Research centers', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Insert departments
        $departments = [
            ['id' => 1, 'name' => 'Architecture (Architectural Engineering)', 'code' => 'ARCH', 'college_id' => 1, 'description' => 'Architectural Engineering', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Chemical Engineering', 'code' => 'CHEM', 'college_id' => 1, 'description' => 'Chemical Engineering', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Civil Engineering', 'code' => 'CIVIL', 'college_id' => 1, 'description' => 'Civil Engineering', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Electrical and Computer Engineering', 'code' => 'ECE', 'college_id' => 1, 'description' => 'Electrical and Computer Engineering', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Electromechanical Engineering', 'code' => 'EME', 'college_id' => 1, 'description' => 'Electromechanical Engineering', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'name' => 'Environmental Engineering', 'code' => 'ENV', 'college_id' => 1, 'description' => 'Environmental Engineering', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'name' => 'Mechanical Engineering', 'code' => 'MECH', 'college_id' => 1, 'description' => 'Mechanical Engineering', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8, 'name' => 'Mining Engineering', 'code' => 'MINE', 'college_id' => 1, 'description' => 'Mining Engineering', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9, 'name' => 'Software Engineering', 'code' => 'SE', 'college_id' => 1, 'description' => 'Software Engineering', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 10, 'name' => 'Biotechnology', 'code' => 'BIOTECH', 'college_id' => 2, 'description' => 'Biotechnology', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 11, 'name' => 'Food Science and Applied Nutrition', 'code' => 'FSAN', 'college_id' => 2, 'description' => 'Food Science', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 12, 'name' => 'Geology', 'code' => 'GEO', 'college_id' => 2, 'description' => 'Geology', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 13, 'name' => 'Industrial Chemistry', 'code' => 'ICHEM', 'college_id' => 2, 'description' => 'Industrial Chemistry', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 14, 'name' => 'Master of Business Administration (MBA)', 'code' => 'MBA', 'college_id' => 3, 'description' => 'MBA', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 15, 'name' => 'Industrial Management', 'code' => 'IM', 'college_id' => 3, 'description' => 'Industrial Management', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 16, 'name' => 'Construction Management', 'code' => 'CM', 'college_id' => 3, 'description' => 'Construction Management', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('departments')->insert($departments);

        // Insert users
        $users = [
            // Admin
            ['id' => 1, 'name' => 'Gemechu Merara', 'email' => 'gemechu.merara@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'it_manager', 'student_id' => null, 'department_id' => null, 'created_at' => now(), 'updated_at' => now()],
            
            // College Deans
            ['id' => 2, 'name' => 'Dr. Alemayehu Tadesse', 'email' => 'alemayehu.tadesse@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'college_dean', 'student_id' => null, 'department_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Dr. Meseret Bekele', 'email' => 'meseret.bekele@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'college_dean', 'student_id' => null, 'department_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Dr. Tewodros Assefa', 'email' => 'tewodros.assefa@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'college_dean', 'student_id' => null, 'department_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Dr. Selamawit Gebre', 'email' => 'selamawit.gebre@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'college_dean', 'student_id' => null, 'department_id' => null, 'created_at' => now(), 'updated_at' => now()],
            
            // Department Heads
            ['id' => 6, 'name' => 'Prof. Yonas Tadesse', 'email' => 'yonas.tadesse@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'department_head', 'student_id' => null, 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'name' => 'Prof. Genet Assefa', 'email' => 'genet.assefa@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'department_head', 'student_id' => null, 'department_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8, 'name' => 'Prof. Daniel Mekonnen', 'email' => 'daniel.mekonnen@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'department_head', 'student_id' => null, 'department_id' => 9, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9, 'name' => 'Prof. Bethlehem Hailu', 'email' => 'bethlehem.hailu@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'department_head', 'student_id' => null, 'department_id' => 10, 'created_at' => now(), 'updated_at' => now()],
            
            // Teachers
            ['id' => 10, 'name' => 'Dr. Abebe Kebede', 'email' => 'abebe.kebede@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'teacher', 'student_id' => null, 'department_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 11, 'name' => 'Dr. Kalkidan Tesfaye', 'email' => 'kalkidan.tesfaye@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'teacher', 'student_id' => null, 'department_id' => 9, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 12, 'name' => 'Dr. Samuel Getachew', 'email' => 'samuel.getachew@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'teacher', 'student_id' => null, 'department_id' => 7, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 13, 'name' => 'Dr. Rahel Assefa', 'email' => 'rahel.assefa@aastu.edu.et', 'password' => Hash::make('12121212'), 'role' => 'teacher', 'student_id' => null, 'department_id' => 10, 'created_at' => now(), 'updated_at' => now()],
            
            // Students
            ['id' => 14, 'name' => 'Meron Tsegaye', 'email' => 'meron.tsegaye@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/ARCH/2021/001', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 15, 'name' => 'Yonatan Assefa', 'email' => 'yonatan.assefa@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/ARCH/2021/002', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 16, 'name' => 'Hana Tadesse', 'email' => 'hana.tadesse@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/ARCH/2021/003', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 17, 'name' => 'Dawit Mekonnen', 'email' => 'dawit.mekonnen@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/CIVIL/2021/001', 'department_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 18, 'name' => 'Sara Gebremedhin', 'email' => 'sara.gebremedhin@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/CIVIL/2021/002', 'department_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 19, 'name' => 'Elias Hailu', 'email' => 'elias.hailu@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/CIVIL/2021/003', 'department_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 20, 'name' => 'Betelhem Tesfaye', 'email' => 'betelhem.tesfaye@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/SE/2021/001', 'department_id' => 9, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 21, 'name' => 'Nahom Bekele', 'email' => 'nahom.bekele@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/SE/2021/002', 'department_id' => 9, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 22, 'name' => 'Kalkidan Assefa', 'email' => 'kalkidan.assefa@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/SE/2021/003', 'department_id' => 9, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 23, 'name' => 'Tewodros Getachew', 'email' => 'tewodros.getachew@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/MECH/2021/001', 'department_id' => 7, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 24, 'name' => 'Meron Tadesse', 'email' => 'meron.tadesse@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/MECH/2021/002', 'department_id' => 7, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 25, 'name' => 'Samuel Hailu', 'email' => 'samuel.hailu@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/MECH/2021/003', 'department_id' => 7, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 26, 'name' => 'Rahel Kebede', 'email' => 'rahel.kebede@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/BIOTECH/2021/001', 'department_id' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 27, 'name' => 'Yonas Assefa', 'email' => 'yonas.assefa@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/BIOTECH/2021/002', 'department_id' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 28, 'name' => 'Genet Tesfaye', 'email' => 'genet.tesfaye@aastustudent.edu.et', 'password' => Hash::make('12121212'), 'role' => 'student', 'student_id' => 'AASTU/BIOTECH/2021/003', 'department_id' => 10, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('users')->insert($users);
    }
}
