<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Role-specific dashboards
Route::middleware(['auth'])->group(function () {
    Route::get('/student/dashboard', function () { return 'Student Dashboard for '.auth()->user()->name; })->name('student.dashboard');
    Route::get('/teacher/dashboard', function () { return 'Teacher Dashboard for '.auth()->user()->name; })->name('teacher.dashboard');
    Route::get('/department/dashboard', function () { return 'Department Head Dashboard for '.auth()->user()->name; })->name('department.dashboard');
    Route::get('/dean/dashboard', function () { return 'Dean Dashboard for '.auth()->user()->name; })->name('dean.dashboard');
    Route::get('/it/dashboard', function () { return 'IT Manager Dashboard for '.auth()->user()->name; })->name('it.dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
Route::get('/admin', function () {
    return 'Admin Dashboard for ' . auth()->user()->name;
})->middleware(['auth', 'role:admin']);
