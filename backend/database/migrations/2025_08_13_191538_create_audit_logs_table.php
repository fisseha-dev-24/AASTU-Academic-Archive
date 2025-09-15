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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Who performed the action
            $table->unsignedBigInteger('user_id')->nullable()->index();

            // What action was performed (upload, approval, download, etc.)
            $table->string('action');

            // Which document was involved
            $table->unsignedBigInteger('document_id')->nullable()->index();

            // Extra info
            $table->text('details')->nullable();

            // (Optional) keep IP address if you want traceability
            $table->string('ip_address')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
