<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:student,teacher,department_head,college_dean,it_manager'],
            'department_id' => ['nullable', 'exists:departments,id'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'department_id' => $request->department_id ?? null,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect($this->redirectToRole($user));
    }

    /**
     * Map user role to dashboard path.
     */
    private function redirectToRole(User $user): string
    {
        return match ($user->role) {
            'student' => route('student.dashboard', absolute: false),
            'teacher' => route('teacher.dashboard', absolute: false),
            'department_head' => route('department.dashboard', absolute: false),
            'college_dean' => route('dean.dashboard', absolute: false),
            'it_manager' => route('it.dashboard', absolute: false),
            default => route('dashboard', absolute: false),
        };
    }

    /**
     * Handle API registration request
     */
    public function apiRegister(Request $request): JsonResponse
    {
        $request->validate([
            'firstName' => ['required', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:student,teacher,department_head,college_dean,it_manager'],
            'department' => ['required', 'string', 'max:255'],
            'college' => ['nullable', 'string', 'max:255'],
            'studentId' => ['nullable', 'string', 'max:255'],
        ]);

        // Find department by name
        $department = Department::where('name', $request->department)->first();
        if (!$department) {
            return response()->json([
                'success' => false,
                'message' => 'Selected department not found.',
                'errors' => ['department' => ['The selected department is invalid.']]
            ], 422);
        }

        // Create user with full name
        $user = User::create([
            'name' => $request->firstName . ' ' . $request->lastName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'department_id' => $department->id,
            'student_id' => $request->studentId,
        ]);

        event(new Registered($user));

        // Don't automatically log in the user - let them go through login process
        return response()->json([
            'success' => true,
            'message' => 'Registration successful. Please log in with your credentials.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'department' => $department->name,
                'college' => $request->college,
                'studentId' => $request->studentId,
            ]
        ], 201);
    }

    /**
     * Get redirect URL for API responses
     */
    private function getRedirectUrl($role): string
    {
        return match ($role) {
            'student' => '/student/dashboard',
            'teacher' => '/teacher/dashboard',
            'department_head' => '/department/dashboard',
            'college_dean' => '/dean/dashboard',
            'it_manager' => '/admin/dashboard',
            default => '/dashboard',
        };
    }
}
