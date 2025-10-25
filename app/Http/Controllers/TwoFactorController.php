<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TwoFactorController extends Controller
{
    public function index()
    {
        // $user = auth()->user();
        // $code = rand(100000, 999999);
        // $user->two_factor_code = $code;
        // $user->save();
        // Mail::to(request()->user())->queue(new sendMailOtp($code));

        // Mail :: raw("Your two-factor code is $code", function ($message) use ($user) {
        // $message->to($user->email)->subject('Two-Factor Code');
    // });
        return Inertia::render('Auth/twoFactor');
    }
    public function verify(Request $request){
            $request->validate(['code' => 'required |integer',]);
            $user = auth()->user();

            if ($request->code == $user->two_factor_code) {
                session(['two_factor_authenticated' => true]);
                if($user->isExpired()){
                    Auth::guard('web')->logout();
                    request()->session()->remove('fbtoken');
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();
                    return redirect('/login');
                }else{
                    return redirect()->intended(request()->user()->getRedirectRoute());
                }
                // return redirect()->intended('/dashboard');
            }

            return redirect()->route('two-factor.index')->withErrors(['code' => 'The provided code is incorrect.']);
    }
    public function logout(Request $request){
        $user = auth()->user();
        if ($user) {
                Auth::guard('web')->logout();
                session(['two_factor_authenticated' => false]);
                request()->session()->remove('fbtoken');
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return redirect('/login');
            }
        }
}
