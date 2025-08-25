<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication API routes
Route::post('/login', [AuthenticatedSessionController::class, 'apiLogin']);
Route::post('/register', [RegisteredUserController::class, 'apiRegister']);
Route::post('/logout', [AuthenticatedSessionController::class, 'apiLogout'])->middleware('auth:sanctum');

// Get departments for registration
Route::get('/departments', function () {
    return \App\Models\Department::all();
});
