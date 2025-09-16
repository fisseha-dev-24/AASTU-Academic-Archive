<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VideoUpload;
use App\Models\User;
use App\Models\Department;
use App\Models\Category;

class VideoSeeder extends Seeder
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
            $this->command->info('Skipping video seeding - missing departments, categories, or teachers');
            return;
        }

        $sampleVideos = [
            [
                'title' => 'Introduction to Software Architecture',
                'description' => 'Comprehensive overview of software architecture patterns and principles. Learn about different architectural styles and their applications.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'video_platform' => 'youtube',
                'video_id' => 'dQw4w9WgXcQ',
                'duration' => '45:30',
                'keywords' => 'software, architecture, patterns, design',
                'year' => '2024',
                'status' => 'approved',
                'views' => 1234,
                'likes' => 89,
                'is_featured' => true,
            ],
            [
                'title' => 'Database Normalization Tutorial',
                'description' => 'Step-by-step guide to database normalization techniques. Learn 1NF, 2NF, 3NF, and BCNF with practical examples.',
                'video_url' => 'https://www.youtube.com/watch?v=GFQaEYEc8_8',
                'video_platform' => 'youtube',
                'video_id' => 'GFQaEYEc8_8',
                'duration' => '32:15',
                'keywords' => 'database, normalization, SQL, design',
                'year' => '2024',
                'status' => 'approved',
                'views' => 856,
                'likes' => 67,
                'is_featured' => false,
            ],
            [
                'title' => 'Machine Learning Fundamentals',
                'description' => 'Introduction to machine learning concepts, algorithms, and applications. Perfect for beginners starting their ML journey.',
                'video_url' => 'https://www.youtube.com/watch?v=aircAruvnKk',
                'video_platform' => 'youtube',
                'video_id' => 'aircAruvnKk',
                'duration' => '1:15:45',
                'keywords' => 'machine learning, AI, algorithms, data science',
                'year' => '2024',
                'status' => 'approved',
                'views' => 2156,
                'likes' => 156,
                'is_featured' => true,
            ],
            [
                'title' => 'Web Development with React',
                'description' => 'Learn modern web development using React.js. Build interactive user interfaces and single-page applications.',
                'video_url' => 'https://www.youtube.com/watch?v=DLX62G4lc44',
                'video_platform' => 'youtube',
                'video_id' => 'DLX62G4lc44',
                'duration' => '2:30:20',
                'keywords' => 'react, javascript, web development, frontend',
                'year' => '2024',
                'status' => 'approved',
                'views' => 3421,
                'likes' => 234,
                'is_featured' => true,
            ],
            [
                'title' => 'Data Structures and Algorithms',
                'description' => 'Essential data structures and algorithms every programmer should know. Arrays, linked lists, trees, and sorting algorithms.',
                'video_url' => 'https://www.youtube.com/watch?v=8hly31xKli0',
                'video_platform' => 'youtube',
                'video_id' => '8hly31xKli0',
                'duration' => '1:45:30',
                'keywords' => 'data structures, algorithms, programming, computer science',
                'year' => '2024',
                'status' => 'approved',
                'views' => 1890,
                'likes' => 123,
                'is_featured' => false,
            ],
            [
                'title' => 'Network Security Protocols',
                'description' => 'Understanding network security protocols and best practices. Learn about SSL/TLS, VPN, and encryption methods.',
                'video_url' => 'https://www.youtube.com/watch?v=qiQR5rTSshw',
                'video_platform' => 'youtube',
                'video_id' => 'qiQR5rTSshw',
                'duration' => '55:20',
                'keywords' => 'network security, protocols, encryption, cybersecurity',
                'year' => '2024',
                'status' => 'approved',
                'views' => 987,
                'likes' => 78,
                'is_featured' => false,
            ],
        ];

        foreach ($sampleVideos as $index => $videoData) {
            // Assign random teacher, department, and category
            $teacher = $teachers->random();
            $department = $departments->random();
            $category = $categories->random();

            VideoUpload::create([
                'title' => $videoData['title'],
                'description' => $videoData['description'],
                'video_url' => $videoData['video_url'],
                'video_platform' => $videoData['video_platform'],
                'video_id' => $videoData['video_id'],
                'duration' => $videoData['duration'],
                'department_id' => $department->id,
                'category_id' => $category->id,
                'user_id' => $teacher->id,
                'year' => $videoData['year'],
                'keywords' => $videoData['keywords'],
                'status' => $videoData['status'],
                'views' => $videoData['views'],
                'likes' => $videoData['likes'],
                'is_featured' => $videoData['is_featured'],
                'approved_by' => 1, // Assuming admin user with ID 1
                'approved_at' => now(),
            ]);
        }

        $this->command->info('Created ' . count($sampleVideos) . ' sample videos');
    }
}
