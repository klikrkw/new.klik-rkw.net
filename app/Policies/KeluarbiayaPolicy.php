<?php

namespace App\Policies;

use App\Models\Keluarbiaya;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class KeluarbiayaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Keluarbiaya $keluarbiaya): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Keluarbiaya $keluarbiaya): Response
    {
        if ($user->hasRole('admin')) {
            return Response::allow();
        }
        return $user->id === $keluarbiaya->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Keluarbiaya $keluarbiaya): bool
    {
        return true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Keluarbiaya $keluarbiaya): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Keluarbiaya $keluarbiaya): bool
    {
        return true;
    }
}
