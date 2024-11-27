<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserFirebase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();
            return [
            'message' => 'user logged out'
        ];
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email'=>'the validation credential are incorect'
            ]);
        }
        $user->is_admin = $user->isAdmin();
        $token = $user->createToken('apiToken')->plainTextToken;
        $customToken = '';
        $auth = app("firebase.auth");
        try {
            // $auth = app("firebase.auth");
            // $signInResult = $auth->signInWithEmailAndPassword(
            //     $request->email,
            //     $request->password
            // );
            $userfb = $user->userfirebase;
            // $login_data = $signInResult->data();
            // $uid = $signInResult->uid();
            // $login_data['uid'] = $uid;

            if ($userfb) {
                // $userfb->update($login_data);
                $xToken = $auth->createCustomToken($userfb->uid);
                $customToken = $xToken->toString();
            } else {
                // $login_data['user_id'] = $user->id;
                // $userfb = UserFirebase::create($login_data);
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
            }
            // Session::put('uid', $login_data);
        } catch (\Kreait\Firebase\Exception\AuthException $e) {
                throw ValidationException::withMessages(['email' => $e->getMessage()]);
        }
        $res = [
            'user' => $user,
            'token' => $token,
            'fbToken' => $customToken,
        ];
        return response($res, 201);
    }
}
