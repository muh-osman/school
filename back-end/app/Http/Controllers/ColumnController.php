<?php

namespace App\Http\Controllers;

use App\Models\Column;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $columns = Column::all();
        return response()->json($columns);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $column = Column::create($request->all());
        return response()->json($column, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $column = Column::findOrFail($id);
        return response()->json($column);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $column = Column::findOrFail($id);
        $column->update($request->all());
        return response()->json($column, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $column = Column::findOrFail($id);
        $column->delete();
        return response()->json(null, 204);
    }
}
