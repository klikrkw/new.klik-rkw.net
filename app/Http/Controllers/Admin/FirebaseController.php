<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserFirebase;
use Illuminate\Http\Request;
use Kreait\Firebase\Messaging\CloudMessage;
use App\Traits\FirebaseTrait;
use Google\Cloud\Firestore\FieldValue;

class FirebaseController extends BaseController
{
    use FirebaseTrait;
    protected $firestoreDB;

    public function __construct()
    {
        $this->firestoreDB = app('firebase.firestore')->database();
    }

    public function sendMessageMobile(Request $request)
    {

        $userfb = UserFirebase::whereNotNull('fcmTokenMobile')->pluck('fcmTokenMobile')->toArray();
        $deviceTokens = $userfb;
        $messaging = app('firebase.messaging');
        if (count($deviceTokens) > 0) {

            $message = CloudMessage::fromArray([
                'notification' => [
                    'title' => $request->input('title', 'Notifikasi'),
                    'body' => $request->input('body', 'isi notifikasi'),
                ],
                'data'=>[]
            ]);

            $messaging->sendMulticast($message, $deviceTokens);

            return to_route('admin.users.index')->with('success', 'Kirim Pesan sukses.');
        }
        return to_route('admin.users.index')->with('success', 'Kirim Pesan gagal.');
    }

    public function sendMessageToMobile(Request $request)
    {

        $val =  request()->validate([
            'title' => ['required'],
            'body' => ['required'],
            'datas' => ['nullable'],
            'user_ids' => ['required'],
        ]);
            $this->sendMessageToMultiUserMobile($val['title'], $val['body'],$val['user_ids'], $val['datas']);
            $data = [
                'title'=>$val['title'],
                'body'=>$val['body'],
                'timestamp'=>FieldValue::serverTimestamp(),
                'users'=>$val['user_ids'],
                'data'=>$val['datas'],
            ];
            $this->addFirestoreDoc('notifications',$data);
            return $this->sendResponse($data,"sukses");
        return $this->sendError('notification',"Gagal");
    }

    public function sendMessage(Request $request)
    {

        $deviceTokens = UserFirebase::pluck('fcmToken')->toArray();
        $messaging = app('firebase.messaging');
        if (count($deviceTokens) > 0) {

            $message = CloudMessage::fromArray([
                'notification' => [
                    'title' => $request->input('title', 'Notifikasi'),
                    'body' => $request->input('body', 'isi notifikasi'),
                ],
            ]);

            $report = $messaging->sendMulticast($message, $deviceTokens);

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
                $userfb->fcmToken = $validated['fcm_token'];
                $userfb->save();
                return response()->json(['success' => true, 'message' => 'update fcm token success']);
            }
        }
        return response()->json(['success' => false, 'message' => 'update fcm token fail ']);
    }

}
