<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Admin-only dashboard
Route::get('/admin', function () {
    return 'Admin Dashboard';
})->middleware('role:admin');

// Teacher-only page
Route::get('/teacher', function () {
    return 'Teacher Dashboard';
})->middleware('role:teacher');

// Student-only page
Route::get('/student', function () {
    return 'Student Dashboard';
})->middleware('role:student');


Route::get('/', function () {
    return view('welcome');
});

// Test RBAC – only admin role can access
Route::get('/admin', function () {
    return 'Welcome to the Admin Dashboard';
})->middleware('role:admin');