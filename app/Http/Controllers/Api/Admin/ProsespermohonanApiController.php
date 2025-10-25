<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\StoreProsespermohonanApiRequest;
use App\Http\Resources\Admin\TranspermohonanCollection;
use App\Models\Itemprosesperm;
use App\Models\Prosespermohonan;
use App\Models\Statusprosesperm;
use App\Models\Transpermohonan;

class ProsespermohonanApiController extends BaseController
{
    public function test(){
        return $this->sendResponse(['data'=>'coba'],"Sukses");
    }

    public function getOptions(){
        $itemprosesperms   = Itemprosesperm::all()->toArray();
        $statusprosesperms = Statusprosesperm::all()->toArray();
        $itemprosespermsOpts = collect($itemprosesperms)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_itemprosesperm']])->toArray();
        $statusprosespermsOpts = collect($statusprosesperms)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_statusprosesperm'],'image' => $item['image_statusprosesperm']])->toArray();
        $xitemprosesperms=['label'=>'All Proses','value'=>''];
        $xstatusprosesperms=['value'=>'','label'=>'All Status','image'=>'/storage/images/statusprosesperms/all_status.png'];
        array_unshift($itemprosespermsOpts, $xitemprosesperms);
        array_unshift($statusprosespermsOpts, $xstatusprosesperms);
        return $this->sendResponse(['itemprosespermsOpts'=>$itemprosespermsOpts, 'statusprosespermsOpts'=>$statusprosespermsOpts],"sukses");
    }
    public function byPermohonan()
    {
        $itemprosesperm_id = request('itemprosesperm_id') ? request('itemprosesperm_id') : null;
        $statusprosesperm_id = request('statusprosesperm_id') ? request('statusprosesperm_id') : null;
        $transpermohonan_id = request('transpermohonan_id') ? request('transpermohonan_id') : null;
        $transpermohonan = Transpermohonan::find(request()->get('transpermohonan_id'));

        if ($transpermohonan) {
            $rtranspermohonan = new TranspermohonanCollection($transpermohonan);
        }

        $prosespermohonans = Prosespermohonan::query();
        $prosespermohonans = $prosespermohonans
            ->with('itemprosesperm')
            ->with('statusprosesperms', function ($q) {
                $q->where('active', true);
            })
            ->with('transpermohonan.jenispermohonan');
            // ->with('transpermohonan.permohonan', function ($query) {
            //     $query->select('id', 'nama_pelepas', 'nama_penerima', 'atas_nama', 'jenishak_id', 'desa_id', 'nomor_hak', 'persil', 'klas', 'luas_tanah')
            //         ->with('users:id,name', 'jenishak')
            //         ->with('desa', function ($query) {
            //             $query->select('id', 'nama_desa', 'kecamatan_id')->with('kecamatan:id,nama_kecamatan');
            //         });
            // });
        if($itemprosesperm_id){
            $prosespermohonans = $prosespermohonans->where('itemprosesperm_id', $itemprosesperm_id);
        }
        if($statusprosesperm_id){
            $prosespermohonans = $prosespermohonans->whereHas('statusprosesperms', function ($query) use ($statusprosesperm_id) {
                $query->where('statusprosesperm_id', '=', $statusprosesperm_id)
                    ->where('active', '=', true);
            });
        }
        $prosespermohonans = $prosespermohonans->where('transpermohonan_id', $transpermohonan_id);
        $prosespermohonans = $prosespermohonans->orderBy('id', 'desc')->orderBy('transpermohonan_id', 'desc')->simplePaginate(100)->appends(request()->all());

        return $this->sendResponse(['prosespermohonans'=>$prosespermohonans, 'transpermohonan'=>$rtranspermohonan],"sukses");
    }

    public function byStatus()
    {
        $statusprosesperm_id = request('statusprosesperm_id',null);
        $itemprosesperm_id = request('itemprosesperm_id', null);
        $user_id = request('user_id', null);
        $prosespermohonans = Prosespermohonan::query();

        $prosespermohonans = $prosespermohonans
            ->with('statusprosesperms', function ($q) {
                $q->where('active', true);
            })
            ->with('itemprosesperm')
            ->with('transpermohonan.jenispermohonan')
            ->with('transpermohonan.permohonan', function ($query) use($user_id){
                $query->select('id', 'nama_pelepas', 'nama_penerima', 'atas_nama', 'jenishak_id', 'desa_id', 'nomor_hak', 'persil', 'klas', 'luas_tanah');
                $query->with('users:id,name', 'jenishak');
                $query->with('desa', function ($query) {
                    $query->select('id', 'nama_desa', 'kecamatan_id')->with('kecamatan:id,nama_kecamatan');
                });
            });

            if($user_id){
                $prosespermohonans = $prosespermohonans->whereHas('transpermohonan.permohonan.users', fn ($q) => $q->where('id', $user_id));
            }

            if($itemprosesperm_id){
                $prosespermohonans = $prosespermohonans->where('itemprosesperm_id', $itemprosesperm_id);
            }
        if($statusprosesperm_id){
            $prosespermohonans = $prosespermohonans->whereHas('statusprosesperms', function ($query) use ($statusprosesperm_id) {
                $query->where('statusprosesperm_id', '=', $statusprosesperm_id)
                    ->where('active', '=', true);
            });
        }
        $prosespermohonans = $prosespermohonans->orderBy('id', 'desc')->simplePaginate(10)->appends(request()->all());
        return $this->sendResponse(['prosespermohonans'=>$prosespermohonans],"sukses");

    }

    public function store(StoreProsespermohonanApiRequest $request)
    {
        try {
        $valid = $request->validated();
        $prosespermohonan = Prosespermohonan::create(
            $valid
        );

        $ids = $prosespermohonan->statusprosesperms()->pluck('statusprosesperm_id');
        if (count($ids) > 0) {
            $prosespermohonan->statusprosesperms()->syncWithPivotValues($ids, ['active' => false]);
        }
        $user = auth()->user();
        $validated = [
            'prosespermohonan_id' => $prosespermohonan->id,
            'statusprosesperm_id' => $valid['statusprosesperm_id'],
            'catatan_statusprosesperm' => $valid['catatan_prosesperm'],
            'user_id' => $user->id,
        ];

        $prosespermohonan->statusprosesperms()->attach($prosespermohonan->id, $validated);

        return $this->sendResponse(['prosespermohonan'=>$prosespermohonan],'Sukses');
        } catch (\Throwable $th) {
            return $this->sendError(['errors'=>'errors'],'errors', '422');
        }
    }

    public function updateStatusprosesperm(Prosespermohonan $prosespermohonan)
    {

        $validated =  request()->validate([
            'prosespermohonan_id' => ['required'],
            'statusprosesperm_id' => ['required'],
            'catatan_statusprosesperm' => ['nullable'],
            'user_id' => ['nullable'],
            'is_alert'=>['required'],
            'start'=>['required'],
            'end'=>['required'],
            ]);
            $user = auth()->user();
            $valid = [
                'prosespermohonan_id' => $prosespermohonan->id,
                'statusprosesperm_id' => $validated['statusprosesperm_id'],
                'catatan_statusprosesperm' => $validated['catatan_statusprosesperm'],
                'user_id' => $user->id,
            ];

        $prosespermohonan->is_alert = $validated['is_alert'];
        $prosespermohonan->start = $validated['start'];
        $prosespermohonan->end = $validated['end'];
        $prosespermohonan->save();

        $prosespermohonan->statusprosesperms()->detach($validated['statusprosesperm_id']);

        $ids = $prosespermohonan->statusprosesperms()->pluck('statusprosesperm_id');
        if (count($ids) > 0) {
            $prosespermohonan->statusprosesperms()->syncWithPivotValues($ids, ['active' => false]);
        }
        $validated['user_id'] = $user->id;

        $prosespermohonan->statusprosesperms()->attach($prosespermohonan->id, $valid);

        return $this->sendResponse(['prosespermohonan'=>$prosespermohonan],'Sukses');
    }

}
