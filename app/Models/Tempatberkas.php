<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tempatberkas extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = [
        'nama_tempatberkas','ruang_id','jenistempatarsip_id','row_count','col_count','image_tempatberkas'
    ];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            if (request()->has('search_key')) {
                $skey = request()->get('search_key');
                if($skey == "nama_ruang"){
                    $query->whereHas('ruang',  function ($q) use($search) {
                        $q
                    ->where('nama_ruang', 'like', '%' . $search . '%');
                    });
                }elseif($skey == "nama_jenistempatarsip"){
                    $query->whereHas('jenistempatarsip', function($q) use($search) {
                        $q
                    ->where('nama_jenistempatarsip', 'like', '%' . $search . '%');
                });
                }else{
                    $query->where(function ($query) use ($skey, $search) {
                        $query->where($skey, 'like', '%' . $search . '%');
                    });
                }

           } else {
                   $query->where('nama_tempatberkas', 'like', '%' . $search . '%')
                   ->orWhereHas('ruang', function ($q) use($search)  {
                    $q->where('nama_ruang', 'like', '%' . $search . '%');
                   })
                    ->orWhereHas('jenistempatarsip', function ($q) use($search)  {
                        $q->where('nama_jenistempatarsip', 'like', '%' . $search . '%');
                    });
        }
        });
    }

    public function ruang()
    {
        return $this->belongsTo(Ruang::class);
    }
    public function jenistempatarsip()
    {
        return $this->belongsTo(Jenistempatarsip::class);
    }
    public function posisiberkases()
    {
        return $this->hasMany(Posisiberkas::class)->with('jenistempatarsip');
    }
}
