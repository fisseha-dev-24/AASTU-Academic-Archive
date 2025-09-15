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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teacher_id')->index();
            $table->string('title');
            $table->string('code'); // Course code like CS301
            $table->enum('type', ['lecture', 'lab', 'tutorial', 'exam', 'office_hours']);
            $table->string('day'); // Monday, Tuesday, etc.
            $table->string('time'); // 09:00 - 11:00
            $table->string('location');
            $table->integer('students')->default(0);
            $table->string('color')->nullable(); // For UI styling
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            
        });

        Schema::create('deadlines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teacher_id')->index();
            $table->string('title');
            $table->string('course_code'); // CS301, CS302, etc.
            $table->enum('type', ['assignment', 'exam', 'project', 'presentation', 'report']);
            $table->enum('priority', ['low', 'medium', 'high']);
            $table->date('due_date');
            $table->text('description')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamps();

            
        });

        Schema::create('office_hours', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teacher_id')->index();
            $table->string('day');
            $table->string('time');
            $table->string('location');
            $table->enum('type', ['regular', 'online', 'by_appointment']);
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('office_hours');
        Schema::dropIfExists('deadlines');
        Schema::dropIfExists('schedules');
    }
};
