<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Admin\TempatarsipCollection;
use App\Http\Resources\Api\TempatarsipWithPageResource;
use App\Http\Resources\Api\TranspermohonanApiResource;
use App\Http\Resources\Api\TranspermohonanNoPageResource;
use App\Models\Tempatarsip;
use App\Models\Transpermohonan;
use Illuminate\Support\Facades\Request;

class TranspermohonanApiController extends BaseController
{
    public function index()
    {
        $cuser = request()->user();
        $is_admin = $cuser->hasRole('admin');
        $user_id = request('user_id');
        $permission_name = request('permission_name');
        $transpermohonans = Transpermohonan::query();
        $transpermohonans = $transpermohonans
        ->where('active',true)
        ->with('permohonan')
        ->orderBy('id', 'desc');
        if ($is_admin) {
            if($user_id){
                $transpermohonans = $transpermohonans->whereHas('permohonan.users',function($q) use($user_id){
                    $q->where('user_id','=',$user_id);
                });
            }
        }else{
            if ($permission_name) {
                if($cuser->hasPermissionTo($permission_name)){
                    if($user_id){
                        $transpermohonans = $transpermohonans->whereHas('permohonan.users',function($q) use($user_id){
                            $q->where('user_id','=',$user_id);
                        });
                    }
                }else{
                    $transpermohonans = $transpermohonans->whereHas('permohonan.users',function($q) use($cuser){
                        $q->where('user_id','=',$cuser->id);
                    });
                }
            }else{
                $transpermohonans = $transpermohonans->whereHas('permohonan.users',function($q) use($cuser){
                    $q->where('user_id','=',$cuser->id);
                });
    }}

        $transpermohonans = $transpermohonans
            ->filter(Request::only('search', 'nodaftar_permohonan', 'nama_pelepas', 'nama_penerima', 'nomor_hak'))
            ->simplePaginate(10)
            ->appends(request()->all());
            $data['isAdmin'] = $is_admin;
            // $data['transpermohonans'] = new KasbonApiResource($transpermohonans);
            $data['transpermohonans'] = new TranspermohonanApiResource($transpermohonans);
        return $this->sendResponse($data,"Sukses");
    }

    public function show()
    {
        $id = request('id');
        $transpermohonans = Transpermohonan::query();
        $transpermohonans = $transpermohonans
        ->with('permohonan')
        ->where('id',$id)->get();
        $data['transpermohonans'] = new TranspermohonanNoPageResource($transpermohonans);
        return $this->sendResponse($data,"Sukses");
    }

    public function showTempatarsip(Request $request)
    {
        $transpermohonan_id = request('transpermohonan_id');
        $transpermohonan = null;
        $tempatarsip = null;
        if($transpermohonan_id){
            $transpermohonan = Transpermohonan::find($transpermohonan_id);
            if($transpermohonan){
                $tempatarsips = $transpermohonan->tempatarsips;
                if(count($tempatarsips)>0){
                    $tempatarsip = $tempatarsips[0];
                }
            }
        }
        $data =$tempatarsip? new TempatarsipCollection($tempatarsip):null;
        return $this->sendResponse($data,"Sukses");
    }
    public function showTempatarsipbykode(Request $request)
    {
        $kode_tempatarsip = request('kode_tempatarsip');
        $tempatarsip = null;
        if($kode_tempatarsip){
            $rec = Tempatarsip::where('kode_tempatarsip','=',$kode_tempatarsip)->first();
            if($rec){
                    $tempatarsip = $rec;
            }
        }
        $data =$tempatarsip? new TempatarsipCollection($tempatarsip):null;
        return $this->sendResponse($data,"Sukses");
    }

    public function storeTempatarsip(Request $request)
    {
        $validated =  request()->validate([
            'transpermohonan_id' => ['required'],
            'tempatarsip_id' => ['required'],
        ]);
        $transpermohonan = Transpermohonan::find($validated['transpermohonan_id']);
        if($transpermohonan){
            $tmparsip_ids = [$validated['tempatarsip_id']];
            $pemohon = $transpermohonan->tempatarsips()->sync($tmparsip_ids);
            return $this->sendResponse($pemohon,"Sukses");
        }
        return $this->sendError('error',"error penyimpanan tempat arsip error");
    }

    public function listTempatarsip(Request $request)
    {
        $tempatarsips = Tempatarsip::query();
        $tempatarsips = $tempatarsips
            ->filter(Request::only('search'))
            ->simplePaginate(10)
            ->appends(request()->all());
        $data = ['tempatarsips'=>new TempatarsipWithPageResource($tempatarsips)];
        return $this->sendResponse($data,"Sukses");
    }

}
