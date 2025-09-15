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
        Schema::create('document_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('documents')->onDelete('cascade');
            $table->foreignId('from_user_id')->constrained('users')->onDelete('cascade'); // Who sent the comment
            $table->foreignId('to_user_id')->constrained('users')->onDelete('cascade'); // Who receives the comment
            $table->text('comment');
            $table->enum('type', ['approval', 'rejection', 'general'])->default('general');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
            
            $table->index(['document_id', 'to_user_id']);
            $table->index(['to_user_id', 'is_read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_comments');
    }
};