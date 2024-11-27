<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class Tempatarsip extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'nama_tempatarsip','ruang_id','jenistempatarsip_id','kode_tempatarsip','baris','kolom','image_tempatarsip'
    ];

    public function scopeFilter($query, array $filters)
    {
        // $query->when($filters['search'] ?? null, function ($query, $search) {
        //     $query->where(function ($query) use ($search) {
        //         $query->where('nama_tempatarsip', 'like', '%' . $search . '%')
        //             ->orWhere('kode_tempatarsip', 'like', '%' . $search . '%');
        //     });
        // });
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
                   $query->where('nama_tempatarsip', 'like', '%' . $search . '%')
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

    public static function getKodeTempatarsip(Tempatarsip $tempatarsip, $isEdit=false)
    {
        $kode = sprintf('%s.%s.%s.%s', $tempatarsip->ruang->kode_ruang, $tempatarsip->jenistempatarsip->id, $tempatarsip->baris,$tempatarsip->kolom);
        $rec= $tempatarsip->where('kode_tempatarsip',$kode)->first();
        if($rec){
            if($isEdit){
                if($kode != $tempatarsip->kode_tempatarsip){
                    throw ValidationException::withMessages(['kolom' => 'error, duplikasi data']);
                }
            }else{
                throw ValidationException::withMessages(['kolom' => 'error, duplikasi data2']);
            }
        }

        return $kode;
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Tempatarsip $tempatarsip) {
            $kode = Tempatarsip::getKodeTempatarsip($tempatarsip);
            $tempatarsip->kode_tempatarsip = $kode;
        });

        self::updating(function (Tempatarsip $tempatarsip) {
            $kode = Tempatarsip::getKodeTempatarsip($tempatarsip, true);
            $tempatarsip->kode_tempatarsip = $kode;
        });

    }

}
