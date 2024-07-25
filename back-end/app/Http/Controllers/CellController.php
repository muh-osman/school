<?php

namespace App\Http\Controllers;

use App\Models\Cell;
use Illuminate\Http\Request;

class CellController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cells = Cell::all();
        return response()->json($cells);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $cell = Cell::create($request->all());
        return response()->json($cell, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $cell = Cell::findOrFail($id);
        return response()->json($cell);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cell = Cell::findOrFail($id);
        $cell->update($request->all());
        return response()->json($cell, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cell = Cell::findOrFail($id);
        $cell->delete();
        return response()->json(null, 204);
    }
}
