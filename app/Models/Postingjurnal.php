<?php

namespace App\Models;

use App\Traits\PeriodetimeTrait;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Postingjurnal extends Model
{
    use HasFactory;
    use PeriodetimeTrait;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'uraian',
        'akun_debet',
        'akun_kredit',
        'jumlah',
        'user_id',
        'image',
    ];
    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $rec = Postingjurnal::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        $year = $now->year;
        $month = $now->month;
        $date = $now->day;
        return 'P' . substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 7) + 1 : 1, 3, '0', STR_PAD_LEFT);
    }
    public static function boot()
    {
        parent::boot();
        self::creating(function (Postingjurnal $postingjurnal) {
            $user = auth()->user();
            $postingjurnal->id = Postingjurnal::getPrimaryId();
            $postingjurnal->user_id = $user->id;
        });
    }
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('uraian', 'like', '%' . $search . '%');
            });
        });
        $query->when($filters['period'] ?? null, function ($query, $period) {
            $periods = $this->getPeriodTimes($period);
            $query->where(function ($query) use ($periods) {
                $query->whereRaw('postingjurnals.created_at >= ? and postingjurnals.created_at <= ?',  [$periods]);
            });
        });

    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function jurnalumums()
    {
        return $this->belongsToMany(Jurnalumum::class, 'postingjurnal_jurnalumums', 'postingjurnal_id', 'jurnalumum_id');
    }
}
