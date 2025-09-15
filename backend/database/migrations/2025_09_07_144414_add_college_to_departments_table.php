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
        // First create colleges table
        Schema::create('colleges', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('dean_id')->nullable()->index(); // College dean
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Add college_id to departments table
        Schema::table('departments', function (Blueprint $table) {
            $table->unsignedBigInteger('college_id')->nullable()->after('head_id')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn('college_id');
        });
        
        Schema::dropIfExists('colleges');
    }
};