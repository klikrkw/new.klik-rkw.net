<?php

namespace App\Traits;
use App\Models\UserFirebase;
use Illuminate\Http\Request;
use Kreait\Firebase\Messaging\CloudMessage;

trait FirebaseTrait {

    protected $firestoreDB;

    public function __construct()
    {
        $this->firestoreDB = app('firebase.firestore')->database();
    }

    public function addFirestoreDoc($collection, $data=[]){
        $this->firestoreDB->collection($collection)->add($data);
    }

    public function updateFirestoreDoc($id, $collection, $data=[], $merge=true){
        $docRef = $this->firestoreDB->collection($collection)->document($id);
        $docRef->set($data, ['merge' => $merge]);
    }

    public function deleteFirestoreDoc($id, $collection){
        $this->firestoreDB->collection($collection)->document($id)->delete();
    }

    public function readFirestoreDoc($collection){
        $documents = $this->firestoreDB->collection($collection)->documents();
        $datas = [];
        foreach ($documents as $document) {
            $datas[$document->id()] = $document->data();
        }
        return $datas;
    }

    public function getFirestoreDoc($id, $collection){
        $docRef = $this->firestoreDB->collection($collection)->document($id);
        return $docRef;
    }

    public function sendMessageToMobile($title, $body, $permission, $data=[])
    {
        $userfb = UserFirebase::whereHas('user', function($q) use($permission){
            $q->whereHas('roles', function($q) use($permission) {
                $q->whereHas('permissions',function($q) use($permission){
                    $q->where('name','like', $permission);
                });
            });
        })->whereNotNull('fcmTokenMobile')->pluck('fcmTokenMobile')->toArray();
        $deviceTokens = $userfb;
        $messaging = app('firebase.messaging');
        if (count($deviceTokens) > 0) {

            $message = CloudMessage::fromArray([
                'notification' => ['title' => $title, 'body' => $body], // optional
                'data' => $data, // optional
            ]);
            $messaging->sendMulticast($message, $deviceTokens);

            // return response()->json(['success' => true, 'message' => 'send notification sukses']);
        }

        return response()->json(['success' => false, 'message' => "send message fail "]);
    }

    public function sendMessageToUserMobile($title, $body, $user_id, $data=[])
    {
        $deviceToken = UserFirebase::where('user_id', '=', $user_id)
        ->whereNotNull('fcmTokenMobile')->pluck('fcmTokenMobile')->first();
        $messaging = app('firebase.messaging');
        // if ($deviceToken) {
        //     $message = CloudMessage::fromArray([
        //         'notification' => [
        //             'title' => $title,
        //             'body' => $body,
        //         ],
        //         "data"=>[
        //             $data
        //         ]
        //     ]);
        //     $messaging->sendMessage($message, $deviceToken);
        $message = CloudMessage::fromArray([
            'token' => $deviceToken,
            'notification' => ['title' => $title, 'body' => $body], // optional
            'data' => $data, // optional
        ]);
        $messaging->send($message);
        // return response()->json(['success' => true, 'message' => 'send notification sukses']);
        // }
        return response()->json(['success' => false, 'message' => "send message fail "]);
    }
    public function sendMessageToMultiUserMobile($title, $body, $userids=[], $data=[])
    {
        $deviceTokens = UserFirebase::whereIn('user_id', $userids)
        ->whereNotNull('fcmTokenMobile')->pluck('fcmTokenMobile')->toArray();
        $messaging = app('firebase.messaging');
        if (count($deviceTokens) > 0) {
            $message = CloudMessage::fromArray([
                'notification' => ['title' => $title, 'body' => $body], // optional
                'data' => $data, // optional
            ]);
            $messaging->sendMulticast($message, $deviceTokens);

        }
        return response()->json(['success' => false, 'message' => "send message fail "]);
    }

}
