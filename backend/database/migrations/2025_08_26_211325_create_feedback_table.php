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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('document_id')->index();
            $table->unsignedBigInteger('student_id')->index();
            $table->unsignedBigInteger('teacher_id')->index();
            $table->string('course_name');
            $table->integer('rating'); // 1-5 stars
            $table->text('comment');
            $table->boolean('is_helpful')->default(false);
            $table->timestamps();

            // Prevent duplicate feedback from same student on same document
            $table->unique(['document_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
