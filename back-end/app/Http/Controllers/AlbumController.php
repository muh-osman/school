<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Album;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class AlbumController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Get the authenticated user
        $authenticatedUserId = auth()->id();

        // Find the teacher by ID
        $teacher = Teacher::findOrFail($request->teacher_id);

        // Check if the authenticated user is the same as the teacher's user
        if ($teacher->user_id !== $authenticatedUserId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access'
            ], 403);
        }

        $album = new Album();
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = date('YmdHis') . '.' . $file->getClientOriginalExtension();
            $album->image = url('/') . '/images/' . $filename;
            $path = 'images';
            $file->move($path, $filename);
        }

        $album->teacher_id = $request->teacher_id;
        $album->save();
        return response()->json($album, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($teacher_id)
    {
        try {
            // Get the authenticated user
            $authenticatedUserId = auth()->id();

            // Find the teacher by ID
            $teacher = Teacher::findOrFail($teacher_id);

            // Check if the authenticated user is the same as the teacher's user
            if ($teacher->user_id !== $authenticatedUserId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized access'
                ], 403);
            }

            // Retrieve albums for the given teacher_id
            $albums = Album::where('teacher_id', $teacher_id)->get();

            // Check if albums exist
            if ($albums->isEmpty()) {
                return response()->json(['message' => 'No albums found for this teacher.'], 404);
            }

            return response()->json($albums);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Teacher not found.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Something went wrong while retrieving the albums'], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $album = Album::findOrFail($id);

            // Delete associated image file
            if ($album->image) {
                $imagePath = public_path('images/' . basename($album->image));
                if (File::exists($imagePath)) {
                    File::delete($imagePath);
                }
            }

            // Delete the album
            $album->delete();

            return response()->json(['message' => 'Album deleted successfully']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Album not found'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Something went wrong while deleting the album'], 500);
        }
    }
}
