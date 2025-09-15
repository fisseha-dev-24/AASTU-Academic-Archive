<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create colleges table
        Schema::create('colleges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Add college_id to departments table if it doesn't exist
        if (!Schema::hasColumn('departments', 'college_id')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->foreignId('college_id')->nullable()->constrained('colleges')->onDelete('set null');
            });
        }

        // Insert colleges data
        DB::table('colleges')->insert([
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
        ]);

        // Update departments with college relationships
        $colleges = DB::table('colleges')->get()->keyBy('code');
        
        // College of Engineering departments
        $coeDepartments = [
            'Architecture (Architectural Engineering)',
            'Chemical Engineering',
            'Civil Engineering',
            'Electrical and Computer Engineering',
            'Electromechanical Engineering',
            'Environmental Engineering',
            'Mechanical Engineering',
            'Mining Engineering',
            'Software Engineering'
        ];

        foreach ($coeDepartments as $deptName) {
            DB::table('departments')
                ->where('name', $deptName)
                ->update(['college_id' => $colleges['COE']->id]);
        }

        // College of Natural and Applied Sciences departments
        $cnasDepartments = [
            'Biotechnology',
            'Food Science and Applied Nutrition',
            'Geology',
            'Industrial Chemistry'
        ];

        foreach ($cnasDepartments as $deptName) {
            DB::table('departments')
                ->where('name', $deptName)
                ->update(['college_id' => $colleges['CNAS']->id]);
        }

        // College of Social Sciences & Humanities departments
        $csshDepartments = [
            'Master of Business Administration (MBA)',
            'Industrial Management',
            'Construction Management'
        ];

        foreach ($csshDepartments as $deptName) {
            DB::table('departments')
                ->where('name', $deptName)
                ->update(['college_id' => $colleges['CSSH']->id]);
        }

        // Centers of Excellence & Research departments
        $cerDepartments = [
            'Artificial Intelligence and Robotics',
            'Biotechnology and Bioprocessing',
            'Construction Quality and Technology',
            'High-Performance Computing and Big Data Analytics',
            'Mineral Exploration, Extraction and Processing',
            'Nanotechnology',
            'Nuclear Reactor Technology',
            'Sustainable Energy'
        ];

        foreach ($cerDepartments as $deptName) {
            DB::table('departments')
                ->where('name', $deptName)
                ->update(['college_id' => $colleges['CER']->id]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['college_id']);
            $table->dropColumn('college_id');
        });
        
        Schema::dropIfExists('colleges');
    }
};