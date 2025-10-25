<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prosespermohonan extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'transpermohonan_id',
        'user_id',
        'itemprosesperm_id',
        'catatan_prosesperm',
        'active',
        'is_alert',
        'start',
        'end'
    ];
    public function scopeFilter($query, array $filters)
    {
        // $query->when($filters['transpermohonan_id'] ?? null, function ($query, $transpermohonan_id) {
        //     $query->where('transpermohonan_id', 'like', $transpermohonan_id);
        // });
        $query->when($filters['transpermohonan_id'] ?? null, function ($query, $transpermohonan_id) {
                $query->where('transpermohonan_id', 'like', $transpermohonan_id);
        });

        // $query->when($filters['statusprosesperm_id'] ?? null, function ($query, $statusprosesperm_id) {
        //     $query->whereHas('statusprosesperms', function ($query) use ($statusprosesperm_id) {
        //         $query->where('statusprosesperm_id', '=', $statusprosesperm_id)
        //             ->where('active', '=', true);
        //     });
        // });

        // $query->when($filters['search'] ?? null, function ($query, $search) {
        //     if (request()->has('search_key')) {
        //         $skey = request()->get('search_key');
        //         if ($skey === "nodaftar_permohonan") {
        //             $string = $search;
        //             $pattern = "/^(\d{1,})\/(\d{4})$/";
        //             if (preg_match($pattern, $string, $matches)) {
        //                 if ($matches && count($matches) === 3) {
        //                     $query->where('nodaftar_permohonan', '=', $matches[1])
        //                         ->where('thdaftar_permohonan', '=', $matches[2]);
        //                 }
        //             }
        //         } elseif ($skey === "nomor_hak") {
        //             $string = $search;
        //             $pattern = "/^(\d{1,})\/(.+)$/";
        //             if (preg_match($pattern, $string, $matches)) {
        //                 if ($matches && count($matches) === 3) {
        //                     $nohak = ltrim($matches[1], '0');
        //                     $query->join('desas', 'desas.id', 'permohonans.desa_id')->where('nomor_hak', 'like', '%' . $nohak . '%')
        //                         ->where('nama_desa', 'like', '%' . $matches[2] . '%');
        //                 }
        //             } else {
        //                 $nohak = ltrim($search, '0');
        //                 $query->where('nomor_hak', 'like', '%' . $search . '%');
        //             }
        //         } else {
        //             $query->where(function ($query) use ($skey, $search) {
        //                 $query->where($skey, 'like', '%' . $search . '%');
        //             });
        //         }
        //     } else {
        //         $query->where(function ($query) use ($search) {
        //             $query->where('nama_pelepas', 'like', '%' . $search . '%')
        //                 ->orWhere('nama_penerima', 'like', '%' . $search . '%')
        //                 ->orWhere('nomor_hak', 'like', '%' . $search . '%');
        //         });
        //     }
        // })

        // $query->when($filters['permohonan_id'] ?? null, function ($query, $jenispermohonan_id) {
        //     $query->whereHas('permohonans', fn ($q) => $q->where('jenispermohonan_id', $jenispermohonan_id));
        // })
        //     ->when($filters['jenishak_id'] ?? null, function ($query, $jenishak_id) {
        //         $query->whereHas('jenishak', fn ($q) => $q->where('jenishak_id', $jenishak_id));
        //     });

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
        $month = $now->month;
        $date = $now->day;
        $rec = Prosespermohonan::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 6) + 1 : 1, 4, '0', STR_PAD_LEFT);
    }


    public static function boot()
    {
        parent::boot();
        self::creating(function (Prosespermohonan $prosespermohonan) {
            $user = auth()->user();
            $prosespermohonan->id = Prosespermohonan::getPrimaryId();
            $prosespermohonan->user_id = $user->id;
        });
    }
    public function transpermohonan()
    {
        return $this->belongsTo(Transpermohonan::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function itemprosesperm()
    {
        return $this->belongsTo(Itemprosesperm::class);
    }
    public function statusprosesperms()
    {
        return $this->belongsToMany(Statusprosesperm::class, 'statusprosesperm_prosespermohonans', 'prosespermohonan_id', 'statusprosesperm_id')
            ->withTimestamps()->withPivot('catatan_statusprosesperm', 'user_id', 'active','updated_at')->orderByPivot('active', 'desc');
    }
    // protected function isalert(): Attribute
    // {
    //     return Attribute::make(
    //         get: fn () => $this->is_alert == 1
    //     );
    // }

}
