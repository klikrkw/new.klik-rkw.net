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
            'pesan' => ['nullable'],
            'user_ids' => ['required'],
        ]);
            $this->sendMessageToMultiUserMobile($val['title'], $val['body'].", Pesan : ".$val['pesan'],$val['user_ids'], $val['datas']);
            $data = [
                'title'=>$val['title'],
                'body'=>$val['body'].", Pesan : ".$val['pesan'],
                'timestamp'=>FieldValue::serverTimestamp(),
                'users'=>$val['user_ids'],
                "priority"=> "high",
                "content_available"=> true, // This is compulsory for background handler
                'data'=>$val['datas'],
            ];
            $this->addFirestoreDoc('notifications',$data);
            return $this->sendResponse($data,"sukses");
        return $this->sendError('notification',"Gagal");
    }

    public function sendMessageToMobileRole(Request $request)
    {

        $val =  request()->validate([
            'title' => ['required'],
            'body' => ['required'],
            'datas' => ['nullable'],
            'role' => ['required'],
        ]);

            $userIds = User::whereHas('roles', function ($query) use ($val) {
                $query->where('name', $val['role']);
            })->get()->pluck('id')->toArray();

            if(count($userIds) == 0){
                return $this->sendError('notification',"Gagal");
            }

            $this->sendMessageToMultiUserMobile($val['title'], $val['body'], $userIds, $val['datas']);
            $data = [
                'title'=>$val['title'],
                'body'=>$val['body'],
                'timestamp'=>FieldValue::serverTimestamp(),
                'users'=>$userIds,
                "priority"=> "high",
                "content_available"=> true, // This is compulsory for background handler
                'data'=>$val['datas'],
            ];
            $this->addFirestoreDoc('notifications',$data);
            return $this->sendResponse($data,"sukses");
        return $this->sendError('notification',"Gagal");
    }
    public function sendDataToMobileRole(Request $request)
    {

        $val =  request()->validate([
            'datas' => ['nullable'],
            'role' => ['required'],
        ]);

            $userIds = User::whereHas('roles', function ($query) use ($val) {
                $query->where('name', $val['role']);
            })->get()->pluck('id')->toArray();

            if(count($userIds) == 0){
                return $this->sendError('notification',"Gagal");
            }

            $this->sendDataToMultiUserMobile($userIds, $val['datas']);
            return $this->sendResponse(['datas'=>$val['datas']],"sukses");
        return $this->sendError('notification',"Gagal");
    }
    public function sendDataToMobileUser(Request $request)
    {

        $val =  request()->validate([
            'user_id' => ['required'],
            'datas' => ['nullable'],
        ]);

            $this->sendDataToMultiUserMobile($val['user_id'], $val['datas']);
            return $this->sendResponse(['datas'=>$val['datas']],"sukses");
        return $this->sendError('notification',"Gagal");
    }

    public function sendDataToWebUser(Request $request)
    {

        $val =  request()->validate([
            'user_id' => ['required'],
            'datas' => ['nullable'],
        ]);

            $this->sendDataToMultiUserWeb([$val['user_id']], $val['datas']);
            return $this->sendResponse(['datas'=>$val['datas']],"sukses");
        return $this->sendError('notification',"Gagal");
    }

    public function sendMessage(Request $request)
    {
        $messaging = app('firebase.messaging');
        $deviceTokens = UserFirebase::pluck('fcmToken')->toArray();
        if($request->has('user_ids')) {
            $deviceTokens = UserFirebase::whereIn('user_id', $request->input('user_ids'))->pluck('fcmToken')->toArray();
        }
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
