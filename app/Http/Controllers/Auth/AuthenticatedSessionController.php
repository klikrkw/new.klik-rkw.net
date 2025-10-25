<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Mail\sendMailOtp;
use App\Models\User;
use App\Models\UserFirebase;
use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        $auth = app('firebase.auth');
        $user = $request->user();

        try {
            //jika error cmd: sudo hwclock -s
            // $auth = app("firebase.auth");
            // $signInResult = $auth->signInWithEmailAndPassword(
            //     $request->email,
            //     $request->password
            // );
            //uid Session
            // $loginuid = $signInResult->firebaseUserId();
            // $token = $signInResult->idToken();
            // 'kind',

            $userfb = $user->userfirebase;
            // $login_data = $signInResult->data();
            // $uid = $signInResult->uid;
            // $login_data['firebaseUserId'] = $uid;

            // foreach ($login_data as $key => $value) {
            //     $userfb[$key] = $value;
            // }

            if ($userfb) {
                // $userfb->update($login_data);
                // $customToken = $auth->createCustomToken($uid);

                $customToken = $auth->createCustomToken($userfb->uid);
                request()->session()->put('fbtoken', $customToken->toString());
            } else {
                $login_data=[];
                $userProperties = [
                    'email' => $request->email,
                    'emailVerified' => false,
                    // 'phoneNumber' => '',
                    'password' => $request->password,
                    'displayName' => $user->name,
                    // 'photoUrl' => null,
                    'disabled' => false,
                ];
                $fb = $auth->createUser($userProperties);
                $login_data['user_id'] = $user->id;
                $login_data['uid'] = $fb->uid;
                $userfb = UserFirebase::create($login_data);
                $customToken = $auth->createCustomToken($fb->uid);
                request()->session()->put('fbtoken', $customToken->toString());
            }
            // Session::put('uid', $login_data);
        } catch (\Kreait\Firebase\Exception\AuthException $e) {
            try {
                // $user = $request->user();
                // $auth = app('firebase.auth');
                $userProperties = [
                    'email' => $request->email,
                    'emailVerified' => false,
                    // 'phoneNumber' => '',
                    'password' => $request->password,
                    'displayName' => $user->name,
                    // 'photoUrl' => null,
                    'disabled' => false,
                ];
                $signFb = $auth->createUser($userProperties);
                // dd($signFb->uid);

                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                throw ValidationException::withMessages(['email' => 'error registrasi, coba login kembali']);
            } catch (\Kreait\Firebase\Exception\FirebaseException $e) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                throw ValidationException::withMessages(['email' => $e->getMessage()]);
            }
        } catch (\Kreait\Firebase\Exception\Auth\EmailExists $e) {
            throw ValidationException::withMessages(['email' => 'Email sudah digunakan']);
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            throw ValidationException::withMessages(['email' => 'Email baru terdaftar di firebase, coba login lagi']);
        }


        $user = auth()->user();
        if($user && $user->two_factor_enabled == true){
        $code = rand(100000, 999999);
        $user->two_factor_code = $code;
        $user->expires_at = Carbon::now()->addMinutes(5);
        $user->save();
        // Mail::to(request()->user())->queue(new sendMailOtp($code));
        //     return redirect()->route('two-factor.index');
        // }
        Mail::to(request()->user())->queue(new sendMailOtp($code));
            return redirect()->route('two-factor.index');
        }
        return redirect()->intended(request()->user()->getRedirectRoute());
        // return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        request()->session()->remove('fbtoken');
        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
