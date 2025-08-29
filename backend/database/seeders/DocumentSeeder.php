<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Document;
use App\Models\User;
use App\Models\Department;
use App\Models\Category;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get departments and categories
        $departments = Department::all();
        $categories = Category::all();
        $teachers = User::where('role', 'teacher')->get();

        if ($departments->isEmpty() || $categories->isEmpty() || $teachers->isEmpty()) {
            $this->command->info('Skipping document seeding - missing departments, categories, or teachers');
            return;
        }

        $documentTypes = [
            'Course Material',
            'Research Paper',
            'Lab Manual',
            'Assignment',
            'Lecture Notes',
            'Project Report',
            'Thesis',
            'Presentation'
        ];

        $titles = [
            'Advanced Database Systems - Course Materials',
            'Machine Learning Research Paper',
            'Software Engineering Lab Manual',
            'Data Structures Assignment Solutions',
            'Computer Networks Lecture Notes',
            'Artificial Intelligence Project Report',
            'Web Development Fundamentals',
            'Operating Systems Study Guide',
            'Computer Architecture Notes',
            'Programming Languages Overview',
            'Database Design Principles',
            'Software Testing Methodologies',
            'Computer Graphics Fundamentals',
            'Network Security Protocols',
            'Mobile Application Development'
        ];

        $statuses = ['pending', 'approved', 'rejected'];

        foreach ($teachers as $teacher) {
            // Create 3-5 documents per teacher
            $numDocuments = rand(3, 5);
            
            for ($i = 0; $i < $numDocuments; $i++) {
                $department = $departments->random();
                $category = $categories->random();
                $status = $statuses[array_rand($statuses)];
                
                Document::create([
                    'title' => $titles[array_rand($titles)],
                    'author' => $teacher->name,
                    'description' => 'This is a sample document description for testing purposes.',
                    'department_id' => $department->id,
                    'category_id' => $category->id,
                    'document_type' => $documentTypes[array_rand($documentTypes)],
                    'year' => rand(2020, 2024),
                    'keywords' => 'sample, test, document',
                    'file_path' => 'documents/sample_document.pdf',
                    'status' => $status,
                    'user_id' => $teacher->id,
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now()->subDays(rand(0, 29)),
                ]);
            }
        }

        $this->command->info('Documents seeded successfully!');
    }
}
