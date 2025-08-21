<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(){
    Schema::create('documents', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('author');
        $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
        $table->year('year');
        $table->string('supervisor')->nullable();
        $table->string('document_type');
        $table->text('keywords')->nullable();
        $table->string('file_path');
        $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
