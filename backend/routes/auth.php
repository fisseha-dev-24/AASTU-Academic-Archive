<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', function () {
        return response()->json([
            'message' => 'Registration endpoint - use frontend at http://localhost:3000/signup',
            'error' => 'This is an API-only backend. Please use the frontend application.'
        ], 400);
    })->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', function () {
        return response()->json([
            'message' => 'Login endpoint - use frontend at http://localhost:3000/login',
            'error' => 'This is an API-only backend. Please use the frontend application.'
        ], 400);
    })->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', function () {
        return response()->json([
            'message' => 'Forgot password endpoint - use frontend at http://localhost:3000/forgot-password',
            'error' => 'This is an API-only backend. Please use the frontend application.'
        ], 400);
    })->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', function () {
        return response()->json([
            'message' => 'Reset password endpoint - use frontend at http://localhost:3000/reset-password',
            'error' => 'This is an API-only backend. Please use the frontend application.'
        ], 400);
    })->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', function () {
        return response()->json([
            'message' => 'Email verification endpoint - use frontend at http://localhost:3000/verify-email',
            'error' => 'This is an API-only backend. Please use the frontend application.'
        ], 400);
    })->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', function () {
        return response()->json([
            'message' => 'Confirm password endpoint - use frontend at http://localhost:3000/confirm-password',
            'error' => 'This is an API-only backend. Please use the frontend application.'
        ], 400);
    })->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
