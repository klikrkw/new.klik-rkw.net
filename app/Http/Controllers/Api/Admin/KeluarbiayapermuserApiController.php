<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use App\Models\Jurnalumum;
use App\Models\Kasbon;
use App\Models\Keluarbiayapermuser;
use App\Models\User;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Admin\DkeluarbiayapermuserStafCollection;
use App\Http\Resources\Api\DkeluarbiayapermuserFullApiResource;
use App\Http\Resources\Api\DkeluarbiayapermuserStafApiResource;
use App\Models\Dkeluarbiayapermuser;
use App\Models\Instansi;
use App\Models\Itemkegiatan;
use App\Models\Metodebayar;
use App\Models\Rekening;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use App\Traits\PeriodetimeTrait;

class KeluarbiayapermuserApiController extends BaseController
{
    use PeriodetimeTrait;
    public function index()
    {
        $cuser = request()->user();
        $is_admin = $cuser->hasRole('admin');
        $user_id = request('user_id');
        $keluarbiayapermusers = Keluarbiayapermuser::query();
        $keluarbiayapermusers = $keluarbiayapermusers->with(['user','metodebayar','instansi']);
        if ($is_admin) {
            if (request()->has('user_id')) {
                $keluarbiayapermusers = $keluarbiayapermusers->where('user_id', $user_id);
            }
        } else {
            $keluarbiayapermusers = $keluarbiayapermusers->where('user_id', $user_id);
        }
        $keluarbiayapermusers = $keluarbiayapermusers->orderBy('id','desc');

        $keluarbiayapermusers = $keluarbiayapermusers->filter(Request::only('status_keluarbiayapermuser'))
            ->simplePaginate(10)
            ->appends(request()->all());
            $data['isAdmin'] = $is_admin;
            // $data['keluarbiayaperms'] = new KasbonApiResource($keluarbiayaperms);
            $data['keluarbiayapermusers'] = $keluarbiayapermusers;
        return $this->sendResponse($data,"Sukses");

    }
    public function statusKeluarbiayapermusers(Keluarbiayapermuser $keluarbiayapermuser)
    {
        $status_keluarbiayapermusers = collect(['wait_approval', 'approved', 'cancelled', 'rejected'])->map(function ($item) {
            return ['value' => $item, 'label' => $item];
        });
        $status_keluarbiayapermuser=$status_keluarbiayapermusers[0];
        if($keluarbiayapermuser){
            $status_keluarbiayapermuser = collect($status_keluarbiayapermusers)->filter(fn($item)=>$item['value'] === $keluarbiayapermuser->status_keluarbiayapermuser)->first();
        }
        $data=['statusKeluarbiayapermusers' => $status_keluarbiayapermusers, 'statusKeluarbiayapermuser'=>$status_keluarbiayapermuser];
        return $this->sendResponse($data,"Sukses");
    }
    public function returSisaKasbon($kasbon, $jumlah)
    {
        $jsisa = $kasbon->sisa_penggunaan;
        //posting jurnalumum
        // if ($jsisa > 0) {
            $ids = $kasbon->jurnalumums;
            if (count($ids) == 2) {
                $ids[0]->delete();
                $ids[1]->delete();
            }
        // }

        // if ($jsisa > 0) {
        //     $akunkas = Akun::getKodeAkun('kas');
        //     $akunpiutang = Akun::getKodeAkun('piutang');
        //     $uraian = 'Kasbon Used - ' . $keluarbiayaperm->user->name . ' - ' . $keluarbiayaperm->keperluan;
        //     $parent_id = $keluarbiayaperm->id;
        //     $ids = $keluarbiayaperm->jurnalumums()->pluck('id');
        //     if (count($ids) == 2) {
        //         $ju1 = Jurnalumum::updateOrCreate(['id' => $ids[0]], [
        //             'uraian' => $uraian,
        //             'akun_id' => $akunpiutang,
        //             'debet' => $jumlah,
        //             'kredit' => 0,
        //             'parent_id' => $parent_id
        //         ]);
        //         $ju2 = Jurnalumum::updateOrCreate(['id' => $ids[1]], [
        //             'uraian' => $uraian,
        //             'akun_id' => $akunkas,
        //             'debet' => 0,
        //             'kredit' => $jumlah,
        //             'parent_id' => $parent_id
        //         ]);
        //     }
        // }
    }
    public function returKasbon($id, $jumlah_biaya)
    {
        $keluarbiayaperm = Kasbon::find($id);
        if ($keluarbiayaperm) {
            $jmlkeluarbiayaperm = $keluarbiayaperm->jumlah_keluarbiayaperm;
            $jmlpenggunaan = $keluarbiayaperm->jumlah_penggunaan;
            $sisapenggunaan = $keluarbiayaperm->sisa_penggunaan;
            $tpenggunaan = $jmlpenggunaan - $jumlah_biaya;
            $jsisa =  $sisapenggunaan + $jumlah_biaya;
            if ($tpenggunaan < 0) {
                $tpenggunaan = 0;
                $jsisa = $jmlkeluarbiayaperm;
            }
            //posting jurnalumum
            // if ($sisapenggunaan > 0) {
            $akunkas = Akun::getKodeAkun('kas');
            $akunpiutang = Akun::getKodeAkun('piutang');
            $uraian = 'Kasbon Used - ' . $keluarbiayaperm->user->name . ' - ' . $keluarbiayaperm->keperluan;
            $parent_id = $keluarbiayaperm->id;
            $ids = $keluarbiayaperm->jurnalumums()->pluck('id');
            if (count($ids) == 2) {
                $ju1 = Jurnalumum::updateOrCreate(['id' => $ids[0]], [
                    'uraian' => $uraian,
                    'akun_id' => $akunpiutang,
                    'debet' => $jsisa,
                    'kredit' => 0,
                    'parent_id' => $parent_id
                ]);
                $ju2 = Jurnalumum::updateOrCreate(['id' => $ids[1]], [
                    'uraian' => $uraian,
                    'akun_id' => $akunkas,
                    'debet' => 0,
                    'kredit' => $jsisa,
                    'parent_id' => $parent_id
                ]);
                $keluarbiayaperm->update(
                    [
                        "jumlah_penggunaan" => $tpenggunaan,
                        'sisa_penggunaan' => $jsisa,
                        'status_keluarbiayaperm' => 'used'
                    ]
                );
                $keluarbiayaperm->jurnalumums()->sync($ids);
                // }
            }
        }
    }
    public function updateStatus(Keluarbiayapermuser $keluarbiayapermuser)
    {
        $validated =  request()->validate([
            'status_keluarbiayapermuser' => ['required'],
        ]);
        $keluarbiayapermuser->update($validated);
        $data['keluarbiayapermuser']=$keluarbiayapermuser;
        $kasbons = $keluarbiayapermuser->kasbons;
        if (count($kasbons) > 0) {
            $id = $kasbons[0]->id;
            $kasbon = Kasbon::find($id);
            if ($keluarbiayapermuser->status_keluarbiayapermuser == 'approved') {
                // $kasbon->update(['status_kasbon' => 'finish']);
            //     $this->returSisaKasbon($kasbon, 0);
            // } elseif ($keluarbiayapermuser->status_keluarbiayapermuser == 'wait_approval') {
                // if ($keluarbiayapermuser->saldo_akhir > 0) {
                    $kasbon->update(['status_kasbon' => 'used']);
                    $this->returSisaKasbon($kasbon, $keluarbiayapermuser->saldo_akhir);
                // }
            }
        }
        return $this->sendResponse($data,"Update Sukses");
    }

    public function list()
    {
        $transpermohonan_id = request('transpermohonan_id');
        $dkeluarbiayapermusers = Dkeluarbiayapermuser::query();
        $dkeluarbiayapermusers = $dkeluarbiayapermusers->with('itemkegiatan:id,nama_itemkegiatan')
            ->with('keluarbiayapermuser', function ($q) {
                $q->select('id', 'metodebayar_id', 'user_id', 'instansi_id')
                    ->with(['user:id,name', 'metodebayar:id,nama_metodebayar', 'instansi:id,nama_instansi']);
            })
            ->where('transpermohonan_id', '=', $transpermohonan_id);
        $dkeluarbiayapermusers = $dkeluarbiayapermusers->orderBy('dkeluarbiayapermusers.id', 'desc')
        ->simplePaginate(10)
        ->appends(request()->all());
    // return DkeluarbiayapermuserStafCollection::collection($dkeluarbiayapermusers);
        $data['dkeluarbiayapermusers'] = new DkeluarbiayapermuserStafApiResource($dkeluarbiayapermusers);
        return $this->sendResponse($data,"Sukses");
        // return $dkeluarbiayapermusers;
    }

    public function listByKeluarbiayapermuserId()
    {
        $keluarbiayapermuser_id = request('keluarbiayapermuser_id');
        $dkeluarbiayapermusers = Dkeluarbiayapermuser::query();
        $dkeluarbiayapermusers = $dkeluarbiayapermusers->with('itemkegiatan:id,nama_itemkegiatan')
            ->with(['transpermohonan','transpermohonan.permohonan.desa'])
            // ->with('keluarbiayapermuser', function ($q) {
            //     $q->select('id', 'metodebayar_id', 'user_id', 'instansi_id')
            //         ->with(['user:id,name', 'metodebayar:id,nama_metodebayar', 'instansi:id,nama_instansi']);
            // })
            ->where('keluarbiayapermuser_id', '=', $keluarbiayapermuser_id);
        $dkeluarbiayapermusers = $dkeluarbiayapermusers->orderBy('dkeluarbiayapermusers.id', 'desc')
        ->simplePaginate(30)
        ->appends(request()->all());
    // return DkeluarbiayapermuserStafCollection::collection($dkeluarbiayapermusers);
        $data['dkeluarbiayapermusers'] = new DkeluarbiayapermuserStafApiResource($dkeluarbiayapermusers);
        return $this->sendResponse($data,"Sukses");
        // return $dkeluarbiayapermusers;
    }
    public function infoDKeluarbiayapermuser()
    {
        $period = request('period', 'today');
        $periods = $this->getPeriodTimes($period);
        $dkeluarbiayas = Dkeluarbiayapermuser::query();
        $dkeluarbiayas = $dkeluarbiayas->with('itemkegiatan:id,nama_itemkegiatan')
        ->whereRaw('dkeluarbiayapermusers.created_at >= ? and dkeluarbiayapermusers.created_at <= ?',  [$periods]);
        $search = request('search', '');
        $itemkegiatan_id = request('itemkegiatan_id', '');
        if(!empty($search)){
            $dkeluarbiayas = $dkeluarbiayas->where('ket_biaya', 'like', '%'.$search.'%')
            ->orWhereRelation('transpermohonan.permohonan','nama_penerima','like','%'.$search.'%')
            ->orWhereRelation('transpermohonan.permohonan','nama_pelepas','like','%'.$search.'%')
            ->orWhereRelation('transpermohonan.permohonan','nomor_hak','like','%'.$search.'%');
        }
        if(!empty($itemkegiatan_id)){
            $dkeluarbiayas = $dkeluarbiayas->where('itemkegiatan_id', '=', $itemkegiatan_id);
        }
        // ->with('keluarbiaya', function ($q) {
            //     $q->select('id', 'metodebayar_id', 'user_id', 'instansi_id')
            //         ->with(['user:id,name', 'metodebayar:id,nama_metodebayar', 'instansi:id,nama_instansi']);
            // })
            // ->where('keluarbiaya_id', '=', $keluarbiaya_id);
        $dkeluarbiayas = $dkeluarbiayas->orderBy('dkeluarbiayapermusers.id', 'desc')
        ->simplePaginate(10)
        ->appends(request()->all());
    // return DkeluarbiayaStafCollection::collection($dkeluarbiayas);
        $data['dkeluarbiayapermusers'] = new DkeluarbiayapermuserFullApiResource($dkeluarbiayas);
        return $this->sendResponse($data,"Sukses");
        // return $dkeluarbiayas;
    }

    public function getOptions(){
        $metodebayars   = Metodebayar::all()->toArray();
        $instansis = Instansi::all()->toArray();
        $rekenings = Rekening::all()->toArray();
        $itemkegiatans = Itemkegiatan::all()->toArray();

        $metodebayarOpts = collect($metodebayars)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_metodebayar']])->toArray();
        $instansiOpts = collect($instansis)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_instansi']])->toArray();
        $rekeningOpts = collect($rekenings)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_rekening']])->toArray();
        $itemkegiatanOpts = collect($itemkegiatans)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_itemkegiatan']])->toArray();
        $periodOpts = $this->getPeriodOpts();
        return $this->sendResponse(['metodebayarOpts'=>$metodebayarOpts, 'instansiOpts'=>$instansiOpts, 'rekeningOpts'=>$rekeningOpts,
        'itemkegiatanOpts'=>$itemkegiatanOpts, 'periodOpts'=>$periodOpts], "sukses");
    }

    public function getItemkegiatanOptions(){
        $itemkegiatans = Itemkegiatan::all()->toArray();
        $itemkegiatanOpts = collect($itemkegiatans)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_itemkegiatan']])->toArray();
        array_unshift($itemkegiatanOpts, ['value' => '', 'label' => 'Pilih Kegiatan']);
        return $this->sendResponse(['itemkegiatanOpts'=>$itemkegiatanOpts], "sukses");
    }

    public function store(Request $request)
    {

        $itemkegiatan_id = request('itemkegiatan_id');
        $val_itemkgt = ['required'];
        $itemkegiatan = Itemkegiatan::find($itemkegiatan_id);
        $isunique = $itemkegiatan ? $itemkegiatan->isunique : false;
        if ($isunique) {
            $val_itemkgt =  ['required', Rule::unique('dkeluarbiayapermusers', 'itemkegiatan_id')->where('transpermohonan_id', request('transpermohonan_id'))];
        }

        $validated =  request()->validate([
            'instansi_id' => ['required'],
            'metodebayar_id' => ['required'],
            'rekening_id' => ['required'],
            'kasbon_id' => ['nullable'],
            'saldo_awal' => ['nullable'],
            'jumlah_keluarbiayaperm' => ['nullable'],
            'saldo_akhir' => ['nullable'],
            'itemkegiatan_id' => $val_itemkgt,
            'catatan_keluarbiayaperm' => ['nullable'],
            'transpermohonan_id' => ['required'],
            'image_keluarbiayapermuser' => ['nullable'],
        ]);

        $valkbuser = [
            'instansi_id'=>$validated['instansi_id'],
            'metodebayar_id'=>$validated['metodebayar_id'],
            'rekening_id'=>$validated['rekening_id'],
            'status_keluarbiayapermuser'=>'approved',
            'saldo_awal'=>$validated['jumlah_keluarbiayaperm'],
            'jumlah_biaya'=>$validated['jumlah_keluarbiayaperm'],
            'saldo_akhir'=>0,
        ];
        $valdkbuser =[
            'jumlah_biaya' =>$validated['jumlah_keluarbiayaperm'],
            'ket_biaya' =>$validated['catatan_keluarbiayaperm'],
            'transpermohonan_id' =>$validated['transpermohonan_id'],
            'itemkegiatan_id' =>$validated['itemkegiatan_id'],
            'image_dkeluarbiayapermuser' =>$validated['image_keluarbiayapermuser'],
        ];
        $keluarbiayapermuser = Keluarbiayapermuser::create(
            $valkbuser
        );
        $dkeluarbiayapermuser = $keluarbiayapermuser->dkeluarbiayapermusers()->create($valdkbuser);
        //posting jurnalumum
        $akunkredit = $keluarbiayapermuser->metodebayar->akun_id;
        $akundebet = $itemkegiatan->akun_id;
        $uraian = $dkeluarbiayapermuser->itemkegiatan->nama_itemkegiatan
            . ' - ' . $dkeluarbiayapermuser->transpermohonan->permohonan->nama_penerima
            . ' - ' . $dkeluarbiayapermuser->transpermohonan->permohonan->alas_hak
            . ', ' . $dkeluarbiayapermuser->transpermohonan->jenispermohonan->nama_jenispermohonan
            . ' - ' . $dkeluarbiayapermuser->ket_biaya;
        $parent_id = $dkeluarbiayapermuser->transpermohonan_id;
        $ju1 = Jurnalumum::create([
            'uraian' => $uraian,
            'akun_id' => $akundebet,
            'debet' => $dkeluarbiayapermuser->jumlah_biaya,
            'kredit' => 0,
            'parent_id' => $parent_id
        ]);
        $ju2 = Jurnalumum::create([
            'uraian' => $uraian,
            'akun_id' => $akunkredit,
            'debet' => 0,
            'kredit' => $dkeluarbiayapermuser->jumlah_biaya,
            'parent_id' => $parent_id
        ]);
        $ids = [$ju1->id, $ju2->id];
        $dkeluarbiayapermuser->jurnalumums()->attach($ids);

        // $prosespermohonan->statusprosesperms()->attach($validated['prosespermohonan_id'], $validated);
        return $this->sendResponse(['dkeluarbiayapermuser'=>$dkeluarbiayapermuser], "sukses");
    }

}
