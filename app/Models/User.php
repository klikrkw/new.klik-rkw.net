<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

use function Pest\Laravel\get;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function scopeOrderByName($query)
    {
        $query->orderBy('name');
    }

    // protected function permission(): Attribute
    // {
    //     return new Attribute(
    //         get: fn () => $this->getAllPermissions()
    //     );
    // }
    // protected $appends = ['permission'];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
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

    public function getRedirectRoute()
    {
        if ($this->hasRole('admin')) {
            return 'admin';
        } elseif ($this->hasRole('staf')) {
            return 'staf';
        } elseif ($this->hasRole('user')) {
            return 'user';
        };
        return '/home';
    }

    public function userfirebase()
    {
        return $this->hasOne(UserFirebase::class);
    }

    public function isAdmin(): Attribute
    {
        $is_admin = $this->hasRole('admin');
        return Attribute::make(
            get: fn () => $is_admin,
        );
    }

}
