<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'image_path',
    ];


    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
