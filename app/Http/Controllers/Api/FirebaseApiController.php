<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserFirebase;
use Illuminate\Http\Request;
use Kreait\Firebase\Messaging\CloudMessage;

class FirebaseApiController extends Controller
{
    public function sendMessage(Request $request)
    {

        $user_id = request('user_id');
        $userfb = UserFirebase::where('user_id', $user_id)->whereNotNull('fcmTokenMobile')->pluck('fcmTokenMobile')->first();
        $deviceToken = $userfb;
        $messaging = app('firebase.messaging');
        if ($deviceToken) {

            $message = CloudMessage::fromArray([
                'notification' => [
                    'title' => $request->input('title', 'Notifikasi'),
                    'body' => $request->input('body', 'isi notifikasi'),
                ],
            ]);

            $report = $messaging->sendMessage($message, $deviceToken);

            return response()->json(['success' => true, 'message' => 'send notification sukses']);
        }
        return response()->json(['success' => false, 'message' => "send message fail "]);
    }

    public function updateFcmtoken(Request $request)
    {
        $validated = $request->validate([
            'fcm_token' =>  ['required'],
        ]);
        if ($validated) {
            $user = $request->user();
            $userfb = $user->userfirebase;
            if ($userfb) {
                $userfb->fcmTokenMobile = $validated['fcm_token'];
                $userfb->save();
                return response()->json(['success' => true, 'message' => 'update fcm token success']);
            }
        }
        return response()->json(['success' => false, 'message' => 'update fcm token fail ']);
    }
}
