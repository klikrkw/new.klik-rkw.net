<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Kreait\Laravel\Firebase\Facades\Firebase;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    private $firebaseAuth;

    public function __construct()
    {
        $this->firebaseAuth = Firebase::auth();
    }

    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        $user->assignRole(['user']);

        try {
            $userProperties = [
                'email' => $request->email,
                'emailVerified' => false,
                // 'phoneNumber' => '',
                'password' => $request->password,
                'displayName' => $request->name,
                // 'photoUrl' => null,
                'disabled' => false,
            ];
            $fb = $this->firebaseAuth->createUser($userProperties);
            $userfb = $user->userfirebase;
            $userfb->uid = $fb->uid;
            $userfb->save();

        } catch (\Kreait\Firebase\Exception\Auth\EmailExists $e) {
            throw ValidationException::withMessages(['email' => 'Email sudah digunakan']);
        }

        // event(new Registered($user));

        // Auth::login($user);
        // return redirect(request()->user()->getRedirectRoute());
        return redirect(RouteServiceProvider::HOME);
    }
}
