<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;


class AlbumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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
        return $album;
    }

    /**
     * Display the specified resource.
     */
    public function show(Album $album)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Album $album)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Album $album)
    {
        //
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
