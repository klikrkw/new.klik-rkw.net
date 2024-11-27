<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statusprosesperm extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'nama_statusprosesperm',
        'image_statusprosesperm',
    ];

    protected function imageStatusprosesperm(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => sprintf('/storage/%s', $value),
        );
    }
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_statusprosesperm', 'like', '%' . $search . '%');
            });
        });
    }
}
