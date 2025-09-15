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
        Schema::create('user_activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->enum('action', ['login', 'logout', 'session_start', 'session_end', 'password_change', 'profile_update']);
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('session_id')->nullable();
            $table->json('metadata')->nullable(); // Additional data like browser, device, location
            $table->boolean('success')->default(true);
            $table->text('failure_reason')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            
            
            $table->index(['user_id', 'action', 'created_at']);
            $table->index(['ip_address', 'created_at']);
            $table->index(['success', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activities');
    }
};
