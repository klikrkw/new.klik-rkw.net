<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rekening extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'nama_rekening',
        'ket_rekening',
        'akun_id'
    ];
    public function akun()
    {
        return $this->belongsTo(Akun::class);
    }
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_rekening', 'like', '%' . $search . '%');
            });
        });
    }
}
