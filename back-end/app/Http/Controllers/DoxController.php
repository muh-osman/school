<?php

namespace App\Http\Controllers;

use Log;
use App\Models\Dox;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DoxController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($user_id)
    {
        // Retrieve only the id and title of the doxes associated with the specified user_id
        $doxes = Dox::where('user_id', $user_id)
            ->select('id', 'title') // Select only the id and title fields
            ->get();

        return response()->json($doxes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $dox = Dox::create([
            'user_id' => auth()->id(), // Assuming the user is authenticated
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($dox, 201);
    }

    /**
     * Display the specified resource.
     */
    // Get a single dox by ID
    public function show($id)
    {
        $dox = Dox::find($id);

        if (!$dox) {
            return response()->json(['message' => 'Dox not found'], 404);
        }

        return response()->json($dox);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $dox = Dox::find($id);

        if (!$dox) {
            return response()->json(['message' => 'Dox not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Update the dox with the provided data
        $dox->update($request->only('title', 'content'));

        return response()->json($dox);
    }



    /**
     * Remove the specified resource from storage.
     */
    // Delete a dox
    public function destroy($id)
    {
        $dox = Dox::find($id);

        if (!$dox) {
            return response()->json(['message' => 'Dox not found'], 404);
        }

        $dox->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    /**
     * Search for a dox by title.
     */
    public function searchDoxByName(Request $request, $user_id)
    {
        $title = $request->input('title');

        // Search for dox by title associated with the specified user_id
        $doxes = Dox::where('user_id', $user_id)
            ->where('title', 'like', $title . '%')
            ->with('user')
            ->get();

        if ($doxes->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Found successfully',
            'doxes' => $doxes,
        ]);
    }
}
