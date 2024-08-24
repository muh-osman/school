<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\SheetController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\DoxController;



// Group for protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Return the authenticated user and his token (http://localhost:8000/api/user)
    Route::get('user', function (Request $request) {
        return [
            'user' => $request->user(),
            'currentToken' => $request->bearerToken()
        ];
    });

    // Logout Route (http://localhost:8000/api/logout)
    Route::post('/logout', [UserController::class, 'logout']);

    // Resend verification email (http://localhost:8000/api/resend-verify-email)
    Route::post('/resend-verify-email', [UserController::class, 'resendVerifyEmail']);


    // Teachers
    Route::resource('teachers', TeacherController::class)->except(['index', 'show']);

    // Route for getting all teachers that associated-with-user
    Route::get('/teachers-associated-with-user', [TeacherController::class, 'index']);

    // Route for getting a teacher by ID
    Route::get('/teachers/{id}', [TeacherController::class, 'show']);

    // Search for teacher
    Route::post('/teachers/search', [TeacherController::class, 'searchTeacherByName']);


    // tables
    Route::post('/tables', [SheetController::class, 'store']);
    // Route::post('/tables/{id}', [SheetController::class, 'update']);
    Route::match(['patch'], '/tables/{id}', [SheetController::class, 'update']);
    Route::delete('/tables/{id}', [SheetController::class, 'destroy']);
    Route::get('/tables-associated-with-user', [SheetController::class, 'index']);
    Route::get('/tables/{id}', [SheetController::class, 'show']);
    Route::post('/tables/search', [SheetController::class, 'searchTableByName']);


    // Album
    Route::post('albums', [AlbumController::class, 'store']);
    //
    Route::get('/albums/teacher/{teacher_id}', [AlbumController::class, 'show']);
    // Route::put('albums/{id}', [AlbumController::class, 'update']);
    Route::delete('albums/{id}', [AlbumController::class, 'destroy']);

    // Dox
    // Route to get all dox titles
    Route::get('doxes-title-associated-with-user', [DoxController::class, 'index']);
    // Route to get a single dox by ID
    Route::get('doxes/{id}', [DoxController::class, 'show']);
    // Route to create a new dox
    Route::post('doxes', [DoxController::class, 'store']);
    // Route to update an existing dox
    Route::match(['patch'], '/doxes/{id}', [DoxController::class, 'update']);
    // Route to delete a dox
    Route::delete('doxes/{id}', [DoxController::class, 'destroy']);
    // search
    Route::post('/doxes/search', [DoxController::class, 'searchDoxByName']);

});





// Group for guest routes
Route::middleware('guest')->group(function () {
    // Register Route (http://localhost:8000/api/register)
    Route::post('/register', [UserController::class, 'register']);

    // Login Route (http://localhost:8000/api/login)
    Route::post('/login', [UserController::class, 'login']);

    // Email verification endpoint (http://localhost:8000/api/verify-email)
    Route::post('/verify-email', [UserController::class, 'verifyEmail'])->name('verification.verify');

    // Password Reset Route (http://localhost:8000/api/forgot-password)
    Route::post('/forgot-password', [UserController::class, 'forgotPassword'])->name('password.email');

    // API route for resetting the password (http://localhost:8000/api/reset-password)
    Route::post('/reset-password', [UserController::class, 'resetPassword'])->name('password.reset');
});



