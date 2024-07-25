<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Sheet; // Add this use statement

class Column extends Model
{
    use HasFactory;


    protected $fillable = ['sheet_id', 'name', 'data_type', 'order'];

    public function sheet()
    {
        return $this->belongsTo(Sheet::class);
    }
}
