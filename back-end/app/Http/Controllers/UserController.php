<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Str;


class UserController extends Controller
{

    // Define the frontend URL as a class property to use it in varifaction email address
    protected $frontendUrl = 'http://localhost:3000';


    // Register
    public function register(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'email' => 'required|string|email|unique:users,email',
                'password' => 'required|string|min:8',
            ]);

            $user = User::create([
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => 3, // Set the default role value here
                'email_sha1_hash' => sha1($validatedData['email']), // Store the SHA1 hash
            ]);

            // // Generate the email verification URL
            // $verificationUrl = URL::temporarySignedRoute(
            //     'verification.verify',
            //     now()->addMinutes(60),
            //     ['id' => $user->id, 'hash' => $user->email_sha1_hash]
            // );

            // // Extract the query parameters from the verification URL
            // parse_str(parse_url($verificationUrl, PHP_URL_QUERY), $queryParams);

            // // Append the query parameters to the frontend URL
            // $verificationUrlWithParams = $this->frontendUrl . '/verify-email' . '?' . http_build_query($queryParams);

            // // Send the verification URL to the frontend
            // Mail::to($user->email)->send(new VerifyEmail($verificationUrlWithParams));

            // Automatically log in the user after registration
            Auth::login($user);

            $token = $user->createToken('new_user')->plainTextToken;

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
                'message' => 'User registered and logged in successfully. Please verify your email.',
                'token' => $token
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Registration failed. ' . $e->getMessage()], 500);
        }
    }

    // Logout
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logged out successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Logout failed. ' . $e->getMessage()], 500);
        }
    }

    // login
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (Auth::attempt($request->only('email', 'password'))) {
                $user = Auth::user();
                $token = $user->createToken('authToken')->plainTextToken;

                return response()->json([
                    'user' => $user,
                    'message' => 'Login successful.',
                    'token' => $token,
                ]);
            }

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Login failed. ' . $e->getMessage()], 500);
        }
    }

    // Verify the user's email address.
    public function verifyEmail(Request $request)
    {
        $userId = $request->input('id');
        $hash = $request->input('hash');

        $user = User::find($userId);

        // Check if the user exists and the hash matches
        if ($user && $hash === $user->email_sha1_hash) {
            // Check if the email is already verified
            if ($user->hasVerifiedEmail()) {
                return response()->json(['message' => 'Email is already verified.'], 400);
            }

            // Mark the email as verified
            $user->markEmailAsVerified();

            // You can dispatch any event here if you want

            return response()->json(['message' => 'Email has been verified.'], 200);
        }

        // If the user doesn't exist or the hash doesn't match
        return response()->json(['message' => 'Invalid verification link.'], 404);
    }

    // Resend Verify Email
    public function resendVerifyEmail(Request $request)
    {
        $user = Auth::user();

        // Check if the user is already verified
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email is already verified.'], 400);
        }

        // Generate the email verification URL
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => $user->email_sha1_hash]
        );

        // Extract the query parameters from the verification URL
        parse_str(parse_url($verificationUrl, PHP_URL_QUERY), $queryParams);

        // Append the query parameters to the frontend URL
        $verificationUrlWithParams = $this->frontendUrl . '/verify-email' . '?' . http_build_query($queryParams);

        // Resend the verification email
        Mail::to($user->email)->send(new VerifyEmail($verificationUrlWithParams));

        return response()->json(['message' => 'Verification link resent. Please check your email.'], 200);
    }

    // Forget password
    public function forgotPassword(Request $request)
    {
        // Validate the email field
        $request->validate(['email' => 'required|email']);

        try {
            // Find the user by email
            $user = User::where('email', $request->email)->firstOrFail();

            // Generate a reset token for the user
            $token = Password::createToken($user);

            // Encode the email to safely include it in the URL
            $encodedEmail = urlencode($user->email);

            // Create the reset password URL with the token and email
            $resetUrl = $this->frontendUrl . '/reset-password?token=' . $token . '&email=' . $encodedEmail;

            // Send the email with the reset link
            Mail::to($user->email)->send(new ResetPasswordMail($resetUrl));

            // Return a success response
            return response()->json(['message' => 'Reset link sent to your email address.'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Return a user-friendly error message
            return response()->json(['message' => 'No user found with that email address.'], 404);
        }
    }


    // Reset password
    public function resetPassword(Request $request)
    {
        // Validate the request data
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:6',
        ]);

        // Decode the email from the URL
        $email = urldecode($request->input('email'));

        // Attempt to reset the user's password
        $status = Password::reset(
            [
                'email' => $email,
                'password' => $request->input('password'),
                'password_confirmation' => $request->input('password_confirmation'),
                'token' => $request->input('token'),
            ],
            function ($user, $password) {
                // Update the user's password
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();

                // Ensure the user is logged out of any other sessions
                $user->setRememberToken(Str::random(60));

                // Dispatch the password reset event
                event(new \Illuminate\Auth\Events\PasswordReset($user));
            }
        );

        // Return a JSON response based on the status
        return $status == Password::PASSWORD_RESET
            ? response()->json(['message' => 'Your password has been reset.'], 200)
            : response()->json(['message' => 'Invalid token or email.'], 400);
    }

}
