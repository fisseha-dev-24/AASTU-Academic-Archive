<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('documents', function (Blueprint $table) {
            // Add missing columns if they don't exist
            if (!Schema::hasColumn('documents', 'author')) {
                $table->string('author')->nullable()->after('title');
            }
            if (!Schema::hasColumn('documents', 'department_id')) {
                $table->unsignedBigInteger('department_id')->nullable()->after('author');
            }
            if (!Schema::hasColumn('documents', 'document_type')) {
                $table->string('document_type')->nullable()->after('department_id');
            }
            if (!Schema::hasColumn('documents', 'views')) {
                $table->integer('views')->default(0)->after('status');
            }
            if (!Schema::hasColumn('documents', 'downloads')) {
                $table->integer('downloads')->default(0)->after('views');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['author', 'department_id', 'document_type', 'views', 'downloads']);
        });
    }
};
