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
use Illuminate\Support\Facades\Auth;


class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($user_id)
    {
        // Retrieve only the teachers associated with the specified user_id
        $teachers = Teacher::where('user_id', $user_id)->with('user')->get();

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
                'email' => 'nullable|email',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'user_id' => 'required|exists:users,id',
            ]);

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/images', $filename);
                $imageUrl = Storage::url($path);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Image file is required',
                ], 422);
            }

            $teacherData = [
                'name' => $validated['name'],
                'bio' => $validated['bio'],
                'skills' => $validated['skills'],
                'image' => $imageUrl,
                'user_id' => $validated['user_id'], // Assign user_id to the teacher
            ];

            if (isset($validated['email'])) {
                $teacherData['email'] = $validated['email'];
            }

            $teacher = Teacher::create($teacherData);

            return response()->json([
                'status' => 'success',
                'message' => 'Created successfully',
                'teacher' => $teacher
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->validator->errors()->first(),
            ], 422);
        } catch (Exception $e) {
            Log::error('Unexpected error in creation: ' . $e->getMessage());
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
            $teacher = Teacher::with('user')->findOrFail($id);
            return response()->json($teacher);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Not found'
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
            'email' => 'nullable|email',
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
            'message' => 'Updated successfully',
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
            'message' => 'Deleted successfully'
        ], Response::HTTP_OK);
    }

    /**
     * Search for a teacher by name.
     */
    public function searchTeacherByName(Request $request, $user_id)
    {
        $name = $request->input('name');

        // Search for teachers by name associated with the specified user_id
        $teachers = Teacher::where('user_id', $user_id)
                            ->where('name', 'like', $name . '%')
                            ->with('user')
                            ->get();

        if ($teachers->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Found successfully',
            'teachers' => $teachers,
        ]);
    }
}
