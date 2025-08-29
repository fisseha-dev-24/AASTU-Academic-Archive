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
        // Add missing columns to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable()->after('remember_token');
            }
            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('last_login_at');
            }
            if (!Schema::hasColumn('users', 'profile_picture')) {
                $table->string('profile_picture')->nullable()->after('is_active');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('profile_picture');
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('phone');
            }
        });

        // Add missing columns to documents table
        Schema::table('documents', function (Blueprint $table) {
            if (!Schema::hasColumn('documents', 'file_size')) {
                $table->bigInteger('file_size')->nullable()->after('file_path');
            }
            if (!Schema::hasColumn('documents', 'file_type')) {
                $table->string('file_type')->nullable()->after('file_size');
            }
            if (!Schema::hasColumn('documents', 'version')) {
                $table->string('version')->default('1.0')->after('file_type');
            }
            if (!Schema::hasColumn('documents', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('version');
            }
            if (!Schema::hasColumn('documents', 'expires_at')) {
                $table->timestamp('expires_at')->nullable()->after('is_featured');
            }
        });

        // Add missing columns to departments table
        Schema::table('departments', function (Blueprint $table) {
            if (!Schema::hasColumn('departments', 'code')) {
                $table->string('code')->unique()->nullable()->after('name');
            }
            if (!Schema::hasColumn('departments', 'description')) {
                $table->text('description')->nullable()->after('code');
            }
            if (!Schema::hasColumn('departments', 'head_id')) {
                $table->unsignedBigInteger('head_id')->nullable()->after('description');
                $table->foreign('head_id')->references('id')->on('users')->onDelete('set null');
            }
            if (!Schema::hasColumn('departments', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('head_id');
            }
        });

        // Add missing columns to categories table
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'description')) {
                $table->text('description')->nullable()->after('name');
            }
            if (!Schema::hasColumn('categories', 'icon')) {
                $table->string('icon')->nullable()->after('description');
            }
            if (!Schema::hasColumn('categories', 'color')) {
                $table->string('color')->nullable()->after('icon');
            }
            if (!Schema::hasColumn('categories', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('color');
            }
        });

        // Add missing columns to audit_logs table
        Schema::table('audit_logs', function (Blueprint $table) {
            if (!Schema::hasColumn('audit_logs', 'ip_address')) {
                $table->string('ip_address')->nullable()->after('details');
            }
            if (!Schema::hasColumn('audit_logs', 'user_agent')) {
                $table->text('user_agent')->nullable()->after('ip_address');
            }
            if (!Schema::hasColumn('audit_logs', 'session_id')) {
                $table->string('session_id')->nullable()->after('user_agent');
            }
            if (!Schema::hasColumn('audit_logs', 'severity')) {
                $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium')->after('session_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove columns from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['last_login_at', 'is_active', 'profile_picture', 'phone', 'address']);
        });

        // Remove columns from documents table
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['file_size', 'file_type', 'version', 'is_featured', 'expires_at']);
        });

        // Remove columns from departments table
        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['head_id']);
            $table->dropColumn(['code', 'description', 'head_id', 'is_active']);
        });

        // Remove columns from categories table
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['description', 'icon', 'color', 'is_active']);
        });

        // Remove columns from audit_logs table
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropColumn(['ip_address', 'user_agent', 'session_id', 'severity']);
        });
    }
};
