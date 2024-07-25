<?php

namespace App\Models;

use App\Models\Row; // Add this use statement
use App\Models\Column; // Add this use statement

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cell extends Model
{
    use HasFactory;

    protected $fillable = ['row_id', 'column_id', 'value'];

    public function row()
    {
        return $this->belongsTo(Row::class);
    }

    public function column()
    {
        return $this->belongsTo(Column::class);
    }
}
