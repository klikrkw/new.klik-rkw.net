<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Rincianbiayaperm extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'transpermohonan_id',
        'ket_rincianbiayaperm',
        'user_id',
        'status_rincianbiayaperm',
        'user_id',
        'total_pemasukan',
        'total_pengeluaran',
        'total_piutang',
        'sisa_saldo',
        'metodebayar_id',
        'rekening_id',
    ];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('rincianbiayaperms.id', 'like', '%' . $search . '%')
                ->orWhere('ket_rincianbiayaperm', 'like', '%' . $search . '%')
                ->orWhereHas('transpermohonan.permohonan', function($q) use($search){
                    $q->where('nama_penerima','like', '%' . $search . '%');
                    $q->orWhere('nomor_hak','like', '%' . $search . '%');
                });
            });
            });
            $query->when($filters['status'] ?? null, function ($query, $status) {
                $query->where(function ($query) use ($status) {
                $query->where('status_rincianbiayaperm', 'like', '%' . $status . '%');
            });
        });
    }

    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        $date = $now->day;
        $rec = Rincianbiayaperm::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 6) + 1 : 1, 4, '0', STR_PAD_LEFT);
        }

        public function transpermohonan()
        {
            return $this->belongsTo(Transpermohonan::class);
        }
        public function user()
        {
            return $this->belongsTo(User::class);
        }

        public function drincianbiayaperms()
        {
            return $this->hasMany(Drincianbiayaperm::class);
        }
        public function metodebayar()
        {
            return $this->belongsTo(Metodebayar::class);
        }
        public function rekening()
        {
            return $this->belongsTo(Rekening::class);
        }

        public function biayaperms()
        {
            return $this->belongsToMany(Biayaperm::class, 'rincianbiayaperm_biayaperms', 'rincianbiayaperm_id', 'biayaperm_id');
        }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Rincianbiayaperm $rincianbiayaperm) {
            $user = auth()->user();
            $rincianbiayaperm->id = Rincianbiayaperm::getPrimaryId();
            if(!$user->hasRole('admin')){
                $rincianbiayaperm->user_id = $user->id;
            }
        });
    }

}
