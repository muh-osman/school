<?php

namespace App\Http\Controllers;

use App\Models\Sheet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SheetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve only the sheets associated with the specified user_id
        $sheets = Sheet::where('user_id', Auth::id())->get();

        return response()->json($sheets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $sheet = Sheet::create($request->all());
        return response()->json($sheet, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sheet = Sheet::find($id);

        if (!$sheet) {
            return response()->json(['message' => 'Sheet not found'], 404);
        }

        if ($sheet->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access'
            ], 403);
        }

        return response()->json($sheet);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Find the sheet by ID
        $sheet = Sheet::findOrFail($id);

        // Check if the authenticated user is the owner of the sheet
        if ($sheet->user_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Update the sheet properties
        $sheet->name = $request->input('name');
        $sheet->description = $request->input('description');

        // Check if private_link and public_link are present in the request before updating
        if ($request->has('private_link')) {
            $sheet->private_link = $request->input('private_link');
        }

        if ($request->has('public_link')) {
            $sheet->public_link = $request->input('public_link');
        }

        // Save the updated sheet
        $sheet->save();

        return response()->json(['message' => 'Sheet updated successfully'], 200);
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sheet = Sheet::findOrFail($id);
        $sheet->delete();
        return response()->json(null, 204);
    }

    /**
     * Search for a table by name.
     */
    public function searchTableByName(Request $request)
    {
        // Get the authenticated user's ID
        $user_id = auth()->id();

        $name = $request->input('name');

        // Search for tables by name associated with the specified user_id
        $tables = Sheet::where('user_id', $user_id)
            ->where('name', 'like', '%' . $name . '%')
            ->with('user')
            ->get();

        if ($tables->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Found successfully',
            'tables' => $tables,
        ]);
    }
}
