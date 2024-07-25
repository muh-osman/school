<?php

namespace App\Http\Controllers;

use App\Models\Row;
use Illuminate\Http\Request;

class RowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rows = Row::all();
        return response()->json($rows);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $row = Row::create($request->all());
        return response()->json($row, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $row = Row::findOrFail($id);
        return response()->json($row);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $row = Row::findOrFail($id);
        $row->update($request->all());
        return response()->json($row, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $row = Row::findOrFail($id);
        $row->delete();
        return response()->json(null, 204);
    }
}
