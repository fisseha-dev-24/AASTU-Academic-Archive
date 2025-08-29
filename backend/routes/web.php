<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'AASTU Academic Archive API',
        'version' => '1.0.0',
        'status' => 'running',
        'frontend_url' => 'http://localhost:3000'
    ]);
});

Route::get('/dashboard', function () {
    return response()->json([
        'message' => 'Dashboard endpoint - use frontend at http://localhost:3000',
        'error' => 'This is an API-only backend. Please use the frontend application.'
    ], 400);
})->middleware(['auth', 'verified'])->name('dashboard');

// Role-specific dashboards - API responses only
Route::middleware(['auth'])->group(function () {
    Route::get('/student/dashboard', function () { 
        return response()->json([
            'message' => 'Student Dashboard API endpoint',
            'user' => auth()->user()->name,
            'note' => 'Use frontend at http://localhost:3000/student/dashboard'
        ]);
    })->name('student.dashboard');
    
    Route::get('/teacher/dashboard', function () { 
        return response()->json([
            'message' => 'Teacher Dashboard API endpoint',
            'user' => auth()->user()->name,
            'note' => 'Use frontend at http://localhost:3000/teacher/dashboard'
        ]);
    })->name('teacher.dashboard');
    
    Route::get('/department/dashboard', function () { 
        return response()->json([
            'message' => 'Department Head Dashboard API endpoint',
            'user' => auth()->user()->name,
            'note' => 'Use frontend at http://localhost:3000/department/dashboard'
        ]);
    })->name('department.dashboard');
    
    Route::get('/dean/dashboard', function () { 
        return response()->json([
            'message' => 'Dean Dashboard API endpoint',
            'user' => auth()->user()->name,
            'note' => 'Use frontend at http://localhost:3000/dean/dashboard'
        ]);
    })->name('dean.dashboard');
    
    Route::get('/it/dashboard', function () { 
        return response()->json([
            'message' => 'IT Manager Dashboard API endpoint',
            'user' => auth()->user()->name,
            'note' => 'Use frontend at http://localhost:3000/it/dashboard'
        ]);
    })->name('it.dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('/admin', function () {
    return response()->json([
        'message' => 'Admin Dashboard API endpoint',
        'user' => auth()->user()->name,
        'note' => 'Use frontend at http://localhost:3000/admin'
    ]);
})->middleware(['auth', 'role:admin']);
