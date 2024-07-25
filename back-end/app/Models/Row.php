<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Sheet; // Add this use statement
use App\Models\Cell;

class Row extends Model
{
    use HasFactory;

    protected $fillable = ['sheet_id', 'order'];

    public function sheet()
    {
        return $this->belongsTo(Sheet::class);
    }

    public function cells()
    {
        return $this->hasMany(Cell::class);
    }
}
