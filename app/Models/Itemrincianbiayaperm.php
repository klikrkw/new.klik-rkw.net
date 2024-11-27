<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Itemrincianbiayaperm extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'nama_itemrincianbiayaperm','min_value','command_itemrincianbiayaperm', 'jenis_itemrincianbiayaperm'
    ];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_itemrincianbiayaperm', 'like', '%' . $search . '%');
            });
        });
    }

}
