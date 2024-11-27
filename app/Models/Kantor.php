<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kantor extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'nama_kantor',
        'alamat_kantor',
        'image_kantor'
    ];
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_kantor', 'like', '%' . $search . '%')
                    ->orWhere('alamat_kantor', 'like', '%' . $search . '%');
            });
        });
    }

}
