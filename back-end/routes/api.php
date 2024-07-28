<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\RowController;
use App\Http\Controllers\CellController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SheetController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\AlbumController;



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


    // Show all posts:      method GET    =>  http://localhost:8000/api/posts
    // Create post:         method POST   =>  http://localhost:8000/api/posts
    // Show post by id:     method GET    =>  http://localhost:8000/api/posts/1
    // Update post by id:   method POST   =>  http://localhost:8000/api/posts/1?_method=PATCH
    // Delete post by id:   method DELETE =>  http://localhost:8000/api/posts/1
    Route::apiResource('posts', PostController::class);


    Route::resource('teachers', TeacherController::class)->except(['index', 'show']);

    // Route for getting all teachers that associated-with-user
    Route::get('/teachers-associated-with-user/{user_id}', [TeacherController::class, 'index']);

    // Route for getting a teacher by ID
    Route::get('/teachers/{id}', [TeacherController::class, 'show']);

    // Search for teacher
    Route::post('/teachers/search/{user_id}', [TeacherController::class, 'searchTeacherByName']);

    // tables
    Route::post('/tables', [SheetController::class, 'store']);
    // Route::post('/tables/{id}', [SheetController::class, 'update']);
    Route::match(['patch'], '/tables/{id}', [SheetController::class, 'update']);
    Route::delete('/tables/{id}', [SheetController::class, 'destroy']);
    Route::get('/tables-associated-with-user/{user_id}', [SheetController::class, 'index']);
    Route::get('/tables/{id}', [SheetController::class, 'show']);
    Route::post('/tables/search/{user_id}', [SheetController::class, 'searchTableByName']);

    // Columns Table
    Route::post('/columns', [ColumnController::class, 'store']);
    Route::put('/columns/{id}', [ColumnController::class, 'update']);
    Route::delete('/columns/{id}', [ColumnController::class, 'destroy']);
    Route::get('/columns', [ColumnController::class, 'index']);
    Route::get('/columns/{id}', [ColumnController::class, 'show']);

    // Rows table
    Route::post('/rows', [RowController::class, 'store']);
    Route::put('/rows/{id}', [RowController::class, 'update']);
    Route::delete('/rows/{id}', [RowController::class, 'destroy']);
    Route::get('/rows', [RowController::class, 'index']);
    Route::get('/rows/{id}', [RowController::class, 'show']);

    // Cells table
    Route::post('/cells', [CellController::class, 'store']);
    Route::put('/cells/{id}', [CellController::class, 'update']);
    Route::delete('/cells/{id}', [CellController::class, 'destroy']);
    Route::get('/cells', [CellController::class, 'index']);
    Route::get('/cells/{id}', [CellController::class, 'show']);


    // Album
    // Route::get('albums', [AlbumController::class, 'index']);
    // Route::get('albums/{id}', [AlbumController::class, 'show']);
    Route::post('albums', [AlbumController::class, 'store']);
    // Route::put('albums/{id}', [AlbumController::class, 'update']);
    Route::delete('albums/{id}', [AlbumController::class, 'destroy']);

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
