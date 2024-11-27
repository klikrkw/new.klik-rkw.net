<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Itemprosesperm extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'nama_itemprosesperm',
    ];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_itemprosesperm', 'like', '%' . $search . '%');
            });
        });
    }
}
