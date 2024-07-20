<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teachers = Teacher::all();
        return response()->json($teachers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'bio' => 'required|string',
                'skills' => 'required|string',
                'email' => 'required|email',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($request->hasFile('image')) {
                try {
                    $file = $request->file('image');
                    $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('public/images', $filename);
                    $imageUrl = Storage::url($path);
                } catch (Exception $e) {
                    Log::error('Image upload failed: ' . $e->getMessage());
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Failed to upload image. Please try again.',
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Image file is required',
                ], 422);
            }

            try {
                $teacher = Teacher::create([
                    'name' => $validated['name'],
                    'bio' => $validated['bio'],
                    'skills' => $validated['skills'],
                    'email' => $validated['email'],
                    'image' => $imageUrl,
                ]);
            } catch (QueryException $e) {
                Log::error('Database error: ' . $e->getMessage());
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to create teacher. Please try again.',
                ], 500);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Teacher created successfully',
                'teacher' => $teacher
            ], 201);
        } catch (Exception $e) {
            Log::error('Unexpected error in teacher creation: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred. Please try again.',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $teacher = Teacher::findOrFail($id);
            return response()->json($teacher);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Teacher not found'
            ], 404);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'bio' => 'sometimes|required|string',
            'skills' => 'sometimes|required|string',
            'email' => 'sometimes|required|email',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete the old image if a new image is uploaded
            $this->deleteOldImage($teacher);

            // Store the new image
            $validated['image'] = $this->storeNewImage($request->file('image'));
        } elseif ($request->has('image') && $request->input('image') === null) {
            // If the request contains a null value for image, do not update the image field
            unset($validated['image']);
        }

        $teacher->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Teacher updated successfully',
            'teacher' => $teacher
        ]);
    }


    /**
     * Delete the old image associated with the teacher.
     */
    private function deleteOldImage(Teacher $teacher)
    {
        if ($teacher->image) {
            $imagePath = str_replace('/storage', 'public', $teacher->image);
            if (Storage::exists($imagePath)) {
                Storage::delete($imagePath);
            }
        }
    }

    /**
     * Store the new image and return the image URL.
     */
    private function storeNewImage($file)
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('public/images', $filename);
        return Storage::url($path);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        // Delete the image file if it exists
        if ($teacher->image) {
            $imagePath = str_replace('/storage', '/public', $teacher->image);
            if (Storage::exists($imagePath)) {
                Storage::delete($imagePath);
            }
        }

        // Delete the database record
        $teacher->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Teacher deleted successfully'
        ], Response::HTTP_OK);
    }
}
