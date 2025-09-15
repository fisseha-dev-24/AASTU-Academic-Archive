<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Commented out to prevent role assignment errors during seeding
        // User::created(function ($user) {
        //     if (!$user->hasAnyRole()) {
        //         $user->assignRole('student');
        //     }
        // });
    
    }
}
