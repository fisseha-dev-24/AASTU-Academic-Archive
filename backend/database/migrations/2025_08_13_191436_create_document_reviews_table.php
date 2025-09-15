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
    Schema::create('document_reviews', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('document_id')->index();
        $table->unsignedBigInteger('reviewer_id')->index();
        $table->enum('status', ['approved', 'rejected']);
        $table->text('comments')->nullable();
        $table->timestamps();
    });
}




    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_reviews');
    }
};
