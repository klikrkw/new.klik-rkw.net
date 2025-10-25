<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permohonan extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'nama_pelepas',
        'nama_penerima',
        'jenishak_id',
        'nomor_hak',
        'persil',
        'klas',
        'luas_tanah',
        'atas_nama',
        'jenis_tanah',
        'desa_id',
        'nodaftar_permohonan',
        'thdaftar_permohonan',
        'kode_unik',
        'active',
        'cek_biaya',
        'period_cekbiaya',
        'date_cekbiaya',
    ];

    public function scopeFilter($query, array $filters)
    {
        // $query->when($filters['search'] ?? null, function ($query, $search) {
        //     $query->where(function ($query) use ($search) {
        //         $query->where('nama_pelepas', 'like', '%' . $search . '%')
        //             ->orWhere('nama_penerima', 'like', '%' . $search . '%')
        //             ->orWhere('nomor_hak', 'like', '%' . $search . '%');
        //     });
        // })

        $query->when($filters['search'] ?? null, function ($query, $search) {
            if (request()->has('search_key')) {
                $skey = request()->get('search_key');
                if ($skey === "nodaftar_permohonan") {
                    $string = $search;
                    $pattern = "/^(\d{1,})\/(\d{4})$/";
                    if (preg_match($pattern, $string, $matches)) {
                        if ($matches && count($matches) === 3) {
                            $query->whereHas('transpermohonans', function (Builder $query) use ($matches) {
                                $query->where('nodaftar_transpermohonan', '=', $matches[1])
                                ->where('thdaftar_transpermohonan', '=', $matches[2]);
                            });
                            // $query->where('nodaftar_permohonan', '=', $matches[1])
                            //     ->where('thdaftar_permohonan', '=', $matches[2]);
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
                            $query->whereHas('desa', fn ($q) => $q
                                ->where('nomor_hak', 'like', '%' . $nohak . '%')
                                ->where('nama_desa', 'like', '%' . $matches[2] . '%'));
                        }
                    } else {
                        $nohak = ltrim($search, '0');
                        $query->where('nomor_hak', 'like', '%' . $search . '%');
                    }
                } else {
                    $query->where(function ($query) use ($skey, $search) {
                        $query->where($skey, 'like', '%' . $search . '%');
                    });
                }
            } else {
                $query->whereHas('transpermohonans', function (Builder $query) {
                    $query->where('active', '=', true);
                })->where(function ($query) use ($search) {
                    $query->where('nama_pelepas', 'like', '%' . $search . '%')
                        ->orWhere('nama_penerima', 'like', '%' . $search . '%')
                        ->orWhere('nomor_hak', 'like', '%' . $search . '%')
                        ->orWhere('nodaftar_permohonan', 'like', '%' . $search . '%');
                });
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
            })

            ->when($filters['user_id'] ?? null, function ($query, $user_id) {
                $query->whereHas('users', fn ($q) => $q->where('user_id', $user_id));
            })

            // ->when($filters['jenispermohonan_id'] ?? null, function ($query, $jenispermohonan_id) {
            //     $query->whereHas('jenispermohonans', fn ($q) => $q->where('jenispermohonan_id', $jenispermohonan_id));
            // })
            ->when($filters['jenishak_id'] ?? null, function ($query, $jenishak_id) {
                $query->whereHas('jenishak', fn ($q) => $q->where('jenishak_id', $jenishak_id));
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

    public static function getYear()
    {
        $now = Carbon::now();
        $year = $now->year;
        // $rec = Jurnalumum::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
        //     ->skip(0)->take(1)->first();
        // return substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 6) + 1 : 1, 4, '0', STR_PAD_LEFT);
        return $year;
    }

    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $rec = Permohonan::select('nodaftar_permohonan')->where('thdaftar_permohonan', '=', $now->year)->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return $year . str_pad($rec ? (int) $rec->nodaftar_permohonan + 1 : 1, 6, '0', STR_PAD_LEFT);
    }

    public static function getNoDaftar()
    {
        $now = Carbon::now();
        $year = $now->year;
        $rec = Permohonan::where('thdaftar_permohonan', $year)->orderBy('nodaftar_permohonan', 'desc')->skip(0)->take(1)->first();
        $code = 1;
        if ($rec) {
            $code = $rec->nodaftar_permohonan + 1;
        }
        return $code;
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Permohonan $permohonan) {
            $permohonan->id = Permohonan::getPrimaryId();
            $permohonan->thdaftar_permohonan = Permohonan::getYear();
            $permohonan->nodaftar_permohonan = Permohonan::getNoDaftar();
        });
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'permohonan_users', 'permohonan_id', 'user_id');
    }
    public function jenishak()
    {
        return $this->belongsTo(Jenishak::class);
    }
    // public function jenispermohonan()
    // {
    //     return $this->belongsTo(Jenispermohonan::class);
    // }
    public function desa()
    {
        return $this->belongsTo(Desa::class);
    }
    // public function jenispermohonans()
    // {
    //     return $this->belongsToMany(Jenispermohonan::class, 'permohonan_jenispermohonans', 'permohonan_id', 'jenispermohonan_id')
    //         ->withPivot('active');
    // }
    // public function active_jenispermohonans()
    // {
    //     return $this->belongsToMany(Jenispermohonan::class, 'permohonan_jenispermohonans', 'permohonan_id', 'jenispermohonan_id')
    //         ->withPivot('active')->wherePivot('active', true);
    // }

    public function getAlasHakAttribute($value)
    {
        $persil = $this->jenishak->singkatan == 'C' ? sprintf(', Ps.%s, %s', $this->persil, $this->klas) : '';
        return sprintf('%s.%s%s, L.%s M2', $this->jenishak->singkatan, $this->nomor_hak, $persil, $this->luas_tanah);
    }
    public function getLetakObyekAttribute($value)
    {
        return sprintf('Ds.%s, Kc.%s', $this->desa->nama_desa, $this->desa->kecamatan->nama_kecamatan);
    }
    public function transpermohonans()
    {
        return $this->hasMany(Transpermohonan::class)->with('jenispermohonan');
    }
    public function transpermohonan()
    {
        return $this->transpermohonans()->with('jenispermohonan')->where(function (Builder $query) {
            $query->select('id', 'active');
            // ->selectRaw("concat(nodaftar_transpermohonan,'/',thdaftar_transpermohonan) as no_daftar");
        })->where('active', true)->first();
    }
}
