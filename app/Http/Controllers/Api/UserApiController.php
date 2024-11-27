<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserApiController extends BaseController
{
    public function show()
    {
    $cuser = request()->user();
    $cuser->is_admin = $cuser?$cuser->isAdmin():false;
    return $cuser;
    //    return response()->json($users,200);
    }

    public function index()
    {
        $users = User::query();
        $users = $users->orderBy('id','desc');
        // $users = $users->skip(0)->take(10)->get();
        $users = $users->simplePaginate(10);

       return response()->json($users,200);

    }
    public function listOptions()
    {
        $cuser = request()->user();
        // $is_admin = $cuser->hasRole('admin');
        $user_id = request('user_id');
        $users = User::query();
        $users = $users->whereHas('roles.permissions', function($q){
            $q->where('name','like','staf');
        })
        ->orderBy('name', 'asc')
            ->skip(0)->take(100)->get();
            // $data['users'] = new KasbonApiResource($users);
            $data['users'] = $users;
        return $this->sendResponse($data,"Sukses");
    }
    public function test()
    {
        $users = User::query();
        $users = $users->orderBy('id','desc');
        // $users = $users->skip(0)->take(10)->get();
        $users = $users->simplePaginate(10);

       return response()->json($users,200);

    }

}
