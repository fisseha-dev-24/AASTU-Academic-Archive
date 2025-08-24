<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocumentController;

Route::middleware(['auth:sanctum'])->group(function () {
    // Store new document
    Route::post('/documents', [DocumentController::class, 'store']);

    // Fetch & filter documents
    Route::get('/documents', [DocumentController::class, 'index']);
});
