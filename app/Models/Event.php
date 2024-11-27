<?php

namespace App\Models;

use App\Traits\PeriodetimeTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    use PeriodetimeTrait;

    protected $fillable = ['start', 'end','title','data','user_id','kategorievent_id','is_transpermohonan'];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('title', 'like', '%' . $search . '%');
                $query->orWhere('data', 'like', '%' . $search . '%');
            });
        });
        $query->when($filters['period'] ?? null, function ($query, $period) {
            $periods = $this->getNextPeriodTimes($period);
            $query->where(function ($query) use ($periods) {
                $query->whereRaw('events.start >= ? and events.start <= ?',  [$periods]);
            });
        });
        $query->when($filters['kategorievent_id'] ?? null, function ($query, $kategorievent_id) {
            $query->where('kategorievent_id', '=', $kategorievent_id);
        });

    }
    public static function boot()
    {
        parent::boot();
        self::creating(function (Event $postingjurnal) {
            $user = auth()->user();
            $postingjurnal->user_id = $user->id;
        });
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function kategorievent()
    {
        return $this->belongsTo(Kategorievent::class);
    }
    public function transpermohonans()
    {
        return $this->belongsToMany(Transpermohonan::class, 'event_transpermohonans', 'event_id', 'transpermohonan_id');
    }
    public function transpermohonan()
    {
        return $this->transpermohonans()->with('jenispermohonan')->first();
    }

}
