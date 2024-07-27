<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Column;
use App\Models\Row;

class Sheet extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'private_link', 'public_link', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function columns()
    {
        return $this->hasMany(Column::class);
    }

    public function rows()
    {
        return $this->hasMany(Row::class);
    }
}
