<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\Akun;
use App\Models\Jurnalumum;
use App\Models\Kasbon;
use App\Models\User;
use App\Models\UserFirebase;
class KasbonApiController extends BaseController
{
    public function test(){
        // $data['user'] = User::whereHas('roles', function($q){
        //     $q->where('name','=','staf');
        // })->pluck('id');
        $data['user'] = UserFirebase::whereHas('user', function($q){
            $q->with('roles', function($q){
                $q->whereHas('permissions',function($q){
                    $q->where('name','like','kasir');
                });
            });
        })->whereNotNull('fcmTokenMobile')->pluck('fcmTokenMobile')->toArray();

        return $this->sendResponse($data,"Sukses");
    }
    public function index()
    {
        $cuser = request()->user();
        $is_admin = $cuser->hasRole('admin');
        $user_id = request('user_id','');
        $status_kasbon = request('status_kasbon');

        $kasbons = Kasbon::query();
        $kasbons = $kasbons
        ->with(['user','instansi'])
        ->orderBy('id', 'desc');
        if ($is_admin) {
            if (request()->has('user_id')) {
                $user_id = request('user_id');
                if(!empty($user_id)){
                    $kasbons = $kasbons->where('user_id', $user_id);
                }
            }
        } else {
            $kasbons = $kasbons->where('user_id', $cuser->id);
        }
        if ($status_kasbon) {
            $kasbons = $kasbons->where('status_kasbon', $status_kasbon);
        }

        $kasbons = $kasbons
            ->simplePaginate(10)
            ->appends(request()->all());
            $data['isAdmin'] = $is_admin;
            // $data['kasbons'] = new KasbonApiResource($kasbons);
            $data['kasbons'] = $kasbons;
        return $this->sendResponse($data,"Sukses");
    }

    public function statusKasbons(Kasbon $kasbon)
    {
        $statusksb = $kasbon->status_kasbon;
        $xstatus_kasbons = [
            ['value' => 'wait_approval', 'label' => 'Waiting Approval'],
            ['value' => 'approved', 'label' => 'Approved'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
            ['value' => 'finish', 'label' => 'finish'],
        ];
        $status_kasbons = [];
        if ($statusksb == 'wait_approval') {
            array_push($status_kasbons, $xstatus_kasbons[1]);
        } elseif ($statusksb == 'approved' & $kasbon->sisa_penggunaan == $kasbon->jumlah_kasbon) {
            array_push($status_kasbons, $xstatus_kasbons[2]);
        } elseif ($statusksb == 'used' & $kasbon->sisa_penggunaan > 0) {
            array_push($status_kasbons, $xstatus_kasbons[3]);
        }

        $data=['statusKasbons' => $status_kasbons,'kasbon'=>$statusksb];
        return $this->sendResponse($data,"Sukses");
    }

    public function updateStatus(Kasbon $kasbon)
    {
        $validated =  request()->validate([
            'status_kasbon' => ['required'],
        ]);

        $kasbon->status_kasbon = $validated['status_kasbon'];
        $kasbon->save();
        $kasbon->status_kasbon = $validated['status_kasbon'];
        $data['kabon']=$kasbon;
        if ($kasbon->status_kasbon == 'approved') {
            $akunkredit = Akun::getKodeAkun('kas');
            $akundebet = Akun::getKodeAkun('piutang');
            $uraian = 'Kasbon Approved, ' . $kasbon->user->name . ' - ' . $kasbon->keperluan;
            $parent_id = $kasbon->id;
            $ids = $kasbon->jurnalumums;
            if (count($ids) > 0) {
                $ids[0]->delete();
                $ids[1]->delete();
            }

            $ju1 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akundebet,
                'debet' => $kasbon->jumlah_kasbon,
                'kredit' => 0,
                'parent_id' => $parent_id
            ]);
            $ju2 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akunkredit,
                'debet' => 0,
                'kredit' => $kasbon->jumlah_kasbon,
                'parent_id' => $parent_id
            ]);
            $ids = [$ju1->id, $ju2->id];
            $kasbon->jurnalumums()->attach($ids);
        } elseif ($kasbon->status_kasbon == 'finish') {
            $akundebet = Akun::getKodeAkun('kas');
            $akunkredit = Akun::getKodeAkun('piutang');
            $uraian = 'Kasbon ' . $kasbon->status_kasbon . ', ' . $kasbon->user->name . ' - ' . $kasbon->keperluan;
            $parent_id = $kasbon->id;
            $ju1 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akundebet,
                'debet' => $kasbon->sisa_penggunaan,
                'kredit' => 0,
                'parent_id' => $parent_id
            ]);
            $ju2 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akunkredit,
                'debet' => 0,
                'kredit' => $kasbon->sisa_penggunaan,
                'parent_id' => $parent_id
            ]);
            $ids = [$ju1->id, $ju2->id];
            $kasbon->jurnalumums()->attach($ids);
        } elseif ($kasbon->status_kasbon == 'cancelled') {
            $recs = Jurnalumum::where('parent_id',$kasbon->id)->get();
            for ($i=0; $i < $recs->count(); $i++) {
                $recs[$i]->delete();
            }
        }

        return $this->sendResponse($data,"Update Sukses");
    }

    public function statusKasbonOpts(Kasbon $kasbon)
    {
        $status_kasbons = [
            ['value' => 'wait_approval', 'label' => 'Waiting Approval'],
            ['value' => 'approved', 'label' => 'Approved'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
            ['value' => 'finish', 'label' => 'finish'],
        ];

        $data=['statusKasbonOpts' => $status_kasbons];
        return $this->sendResponse($data,"Sukses");
    }

}
