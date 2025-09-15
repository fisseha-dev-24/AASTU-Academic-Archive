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
        Schema::table('users', function (Blueprint $table) {
            $table->string('qualification')->nullable()->after('phone');
            $table->string('specialization')->nullable()->after('qualification');
            $table->string('office_location')->nullable()->after('bio');
            $table->string('office_hours')->nullable()->after('office_location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['qualification', 'specialization', 'office_location', 'office_hours']);
        });
    }
};