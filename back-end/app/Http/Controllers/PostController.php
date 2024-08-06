<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Post::all();
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $post = Post::create([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Post created successfully",
            'post' => $post
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return $post;
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)

    // method post
    // http://127.0.0.1:8000/api/posts/1?_method=PATCH
    {
        $post->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Post updated successfully",
            'post' => $post
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Post deleted successfully"
        ]);
    }

}
