<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class WebSocketController extends Controller
{
    /**
     * Generate WebSocket token for authenticated user
     */
    public function getToken(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }
            
            // Generate a temporary token for WebSocket connection
            $token = Str::random(64);
            
            // Store token in cache with user info (expires in 1 hour)
            \Cache::put("ws_token_{$token}", [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'department_id' => $user->department_id
            ], 3600);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'token' => $token,
                    'expires_at' => now()->addHour()->toISOString()
                ]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('WebSocket token generation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate WebSocket token'
            ], 500);
        }
    }
    
    /**
     * Validate WebSocket token
     */
    public static function validateToken($token)
    {
        $cacheKey = "ws_token_{$token}";
        $userData = \Cache::get($cacheKey);
        
        if (!$userData) {
            return null;
        }
        
        // Get user from database
        $user = \App\Models\User::find($userData['user_id']);
        
        if (!$user || $user->status !== 'active') {
            \Cache::forget($cacheKey);
            return null;
        }
        
        return $user;
    }
    
    /**
     * Invalidate WebSocket token
     */
    public function invalidateToken(Request $request)
    {
        try {
            $token = $request->input('token');
            
            if ($token) {
                \Cache::forget("ws_token_{$token}");
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Token invalidated successfully'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('WebSocket token invalidation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to invalidate token'
            ], 500);
        }
    }
}
