<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Transpermohonan extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'permohonan_id',
        'jenispermohonan_id',
        'nodaftar_transpermohonan',
        'thdaftar_transpermohonan',
        'active',
        'nomor_haktp',
        'atas_namatp',
        'luas_tanahtp'
    ];
    public static function getYear()
    {
        $now = Carbon::now();
        $year = $now->year;
        return $year;
    }

    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $rec = Transpermohonan::select('nodaftar_transpermohonan')->where('thdaftar_transpermohonan', '=', $now->year)->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return 'T' . $year . str_pad($rec ? (int) $rec->nodaftar_transpermohonan + 1 : 1, 5, '0', STR_PAD_LEFT);
    }

    public static function getNoDaftar()
    {
        $now = Carbon::now();
        $year = $now->year;
        $rec = Transpermohonan::where('thdaftar_transpermohonan', $year)->orderBy('nodaftar_transpermohonan', 'desc')->skip(0)->take(1)->first();
        $code = 1;
        if ($rec) {
            $code = $rec->nodaftar_transpermohonan + 1;
        }
        return $code;
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Transpermohonan $transpermohonan) {
            $transpermohonan->id = Transpermohonan::getPrimaryId();
            $transpermohonan->thdaftar_transpermohonan = Transpermohonan::getYear();
            $transpermohonan->nodaftar_transpermohonan = Transpermohonan::getNoDaftar();
        });
    }

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class);
    }
    public function jenispermohonan()
    {
        return $this->belongsTo(Jenispermohonan::class);
    }

    public function waitapproval_rincianbiayaperms()
    {
        return $this->hasMany(Rincianbiayaperm::class)->where('status_rincianbiayaperm','wait_approval');
    }
    public function biayaperms()
    {
        return $this->hasMany(Biayaperm::class);
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            if (request()->has('search_key')) {
                $skey = request()->get('search_key');
                if ($skey === "nodaftar_permohonan") {
                    $string = $search;
                    $pattern = "/^(\d{1,})\/(\d{4})$/";
                    if (preg_match($pattern, $string, $matches)) {
                        if ($matches && count($matches) === 3) {
                            $query->where('nodaftar_transpermohonan', '=', $matches[1])
                                ->where('thdaftar_transpermohonan', '=', $matches[2]);
                        }
                    }
                } elseif ($skey === "nomor_hak") {
                    $string = $search;
                    $pattern = "/^(\d{1,})\/(.+)$/";
                    if (preg_match($pattern, $string, $matches)) {
                        if ($matches && count($matches) === 3) {
                            $nohak = ltrim($matches[1], '0');
                            // $query->join('desas', 'desas.id', 'permohonans.desa_id')->where('nomor_hak', 'like', '%' . $nohak . '%')
                            //     ->where('nama_desa', 'like', '%' . $matches[2] . '%');
                            $query->whereHas('permohonan', fn ($q) => $q
                                ->where('nomor_hak', 'like', '%' . $nohak . '%'));
                            $query->whereHas('permohonan.desa', fn ($q) => $q
                                ->where('nama_desa', 'like', '%' . $matches[2] . '%'));
                        }
                    } else {
                        $nohak = ltrim($search, '0');
                        // $query->where('nomor_hak', 'like', '%' . $search . '%');
                        $query->whereHas('permohonan', fn ($q) => $q
                        ->where('nomor_hak', 'like', '%' . $nohak . '%'));
            }
                } else {
                    $query->where(function ($query) use ($skey, $search) {
                        $query->where($skey, 'like', '%' . $search . '%');
                    });
                }
            } else {
                // $query->whereHas('permohonan', function ($query) use ($search) {
                    $pattern1 = "/^\:/";
                    $string = $search;
                    $pattern2 = "/^(\:)(desa|no|nohak)\s(.+)$/i";
                    if (preg_match($pattern1, $string, $matches)) {
                            if ($matches && count($matches) === 1) {
                            if (preg_match($pattern2, $string, $matches)) {
                                if ($matches && count($matches) === 4) {
                                    $mkey = strtolower($matches[2]);
                                    if($mkey === 'desa'){
                                        $query->whereHas('permohonan', function ($query) use ($matches) {
                                        $query->whereHas('desa', fn ($q) => $q
                                        ->where('nama_desa', 'like', '%' . $matches[3] . '%'));
                                        });
                                    }
                                    elseif($mkey === 'no'){
                                        $pattern = "/^(\d{1,})\/(\d{4})$/";
                                        $string = $matches[3];
                                        if (preg_match($pattern, $string, $matches)) {
                                            if ($matches && count($matches) === 3) {
                                                $query->where('nodaftar_transpermohonan', '=', $matches[1])
                                                    ->where('thdaftar_transpermohonan', '=', $matches[2]);
                                            }
                                        }
                                    }
                                    elseif($mkey === 'nohak'){
                                        $pattern = "/^(\d{1,})\/(.+)$/";
                                        $string = $matches[3];
                                        if (preg_match($pattern, $string, $matches)) {
                                            if ($matches && count($matches) === 3) {
                                                    $query->whereHas('permohonan', function ($query) use ($matches) {
                                                    $query->where('nomor_hak', 'like', '%' .$matches[1].'%')
                                                    ->whereHas('desa', fn ($q) => $q
                                                    ->where('nama_desa', 'like', '%' . $matches[2] . '%'));
                                                    });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                        else{
                        $string = $search;
                        $pattern = "/^(\d{1,})\/(\d{4})$/";
                        if (preg_match($pattern, $string, $matches)) {
                            if ($matches && count($matches) === 3) {
                                $query->where('nodaftar_transpermohonan', '=', $matches[1])
                                    ->where('thdaftar_transpermohonan', '=', $matches[2]);
                            }
                        }else{
                            $query
                            ->where('id', '=', $search)
                            ->orWhereHas('permohonan', function ($query) use ($search) {
                                $query->where('nama_pelepas', 'like', '%' . $search . '%')
                                ->orWhere('nama_penerima', 'like', '%' . $search . '%')
                                ->orWhere('atas_nama', 'like', '%' . $search . '%')
                                ->orWhere('nomor_hak', 'like', '%' . $search . '%');
                            });

                        }
                        }
                // });
            }
        })
            // ->when($filters['active'] ?? null, function ($query, $active) {
            //     $query->where('active', '=', $active);
            // })

            ->when($filters['jenis_tanah'] ?? null, function ($query, $jenis_tanah) {
                $query->where('jenis_tanah', '=', $jenis_tanah);
            })
            ->when($filters['desa_id'] ?? null, function ($query, $desa_id) {
                $query->where('desa_id', '=', $desa_id);
            });


        // ->when($filters['role'] ?? null, function ($query, $role) {
        //     $query->whereRole($role);
        //     // })->when($filters['trashed'] ?? null, function ($query, $trashed) {
        //     if ($trashed === 'with') {
        //         $query->withTrashed();
        //     } elseif ($trashed === 'only') {
        //         $query->onlyTrashed();
        //     }
        // });
    }
    protected function nodaftar(): Attribute
    {
        return Attribute::make(
            get: fn () => sprintf('%s/%s', $this->nodaftar_transpermohonan, $this->thdaftar_transpermohonan),
        );
    }
    protected function tglDaftar(): Attribute
    {
        return Attribute::make(
            get: fn () => Carbon::parse($this->created_at)->format('d F Y')
        );
    }
    public function tempatarsips()
    {
        return $this->belongsToMany(Tempatarsip::class, 'tempatarsip_permohonans', 'transpermohonan_id', 'tempatarsip_id');
    }
    public function dkeluarbiayapermusers()
    {
        return $this->hasMany(Dkeluarbiayapermuser::class)->orderBy('id','desc');
    }
    public function posisiberkases()
    {
        return $this->belongsToMany(Posisiberkas::class, 'posisiberkas_transpermohonans', 'transpermohonan_id', 'posisiberkas_id');
    }
}
