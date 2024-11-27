<?php

namespace App\Policies;

use App\Models\Keluarbiayapermuser;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class KeluarbiayapermuserPolicy
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
    public function view(User $user, Keluarbiayapermuser $keluarbiayapermuser): bool
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
    public function update(User $user, Keluarbiayapermuser $keluarbiayapermuser): Response
    {
        if ($user->hasRole('admin')) {
            return Response::allow();
        }
        return $user->id === $keluarbiayapermuser->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Keluarbiayapermuser $keluarbiayapermuser): bool
    {
        return true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Keluarbiayapermuser $keluarbiayapermuser): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Keluarbiayapermuser $keluarbiayapermuser): bool
    {
        return true;
    }
}
