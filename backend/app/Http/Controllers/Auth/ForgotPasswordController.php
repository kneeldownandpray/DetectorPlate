<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;

class ForgotPasswordController extends Controller
{

    public function sendResetLinkEmail(Request $request)
    {
        // Validate email input
        $request->validate(['email' => 'required|email']);
    
        $email = $request->email;
    
        // Check if the email exists in the users table
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email does not exist.'], 404);
        }
    
        // Generate a reset token
        $token = Str::random(60);
    
        // Create a personal access token for password reset (optional, you can remove it if not needed)
        $user->createToken($token, ['password-reset'])->plainTextToken;
    
        // Create the reset link pointing to the frontend
        $resetLink = 'https://ppark.online/resetpassword?token=' . $token . '&email=' . urlencode($email);
    
        // Send the email
        Mail::raw("Click the following link to reset your password: $resetLink", function ($message) use ($email) {
            $message->to($email)
                    ->subject('Reset Your Password');
        });
    
        return response()->json(['message' => 'Reset link sent to your email.'], 200);
    }
    

    public function resetPassword(Request $request)
    {
        // Validate the request
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);
    
        // Find the user by email
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Invalid email.'], 400);
        }
    
        // Check if the token exists in the database under the name column
        $tokenExists = DB::table('personal_access_tokens')
            ->where('name', $request->token) // Checking against the name column
            ->where('tokenable_id', $user->id)
            ->where('tokenable_type', User::class)
            ->first();
    
        if (!$tokenExists) {
            return response()->json(['message' => 'Invalid token.'], 400);
        }
    
        // Update the user's password
        $user->password = bcrypt($request->password);
        $user->save();
    
        // Optionally delete the token after use
        DB::table('personal_access_tokens')->where('id', $tokenExists->id)->delete();
    
        return response()->json(['message' => 'Password has been reset successfully.'], 200);
    }
    
}
