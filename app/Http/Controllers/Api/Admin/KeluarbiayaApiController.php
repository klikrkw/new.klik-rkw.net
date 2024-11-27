<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use App\Models\Jurnalumum;
use App\Models\Kasbon;
use App\Models\Keluarbiaya;
use App\Models\User;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Api\DkeluarbiayaStafApiResource;
use App\Models\Dkeluarbiaya;
use App\Models\Instansi;
use App\Models\Itemkegiatan;
use App\Models\Metodebayar;
use App\Models\Rekening;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use App\Traits\PeriodetimeTrait;
use Carbon\Carbon;

class KeluarbiayaApiController extends BaseController
{
    use PeriodetimeTrait;
    public function index()
    {
        $cuser = request()->user();
        $is_admin = $cuser->hasRole('admin');
        $user_id = request('user_id');
        $keluarbiayas = Keluarbiaya::query();
        $keluarbiayas = $keluarbiayas->with(['user','metodebayar','instansi']);
        if ($is_admin) {
            if (request()->has('user_id')) {
                $keluarbiayas = $keluarbiayas->where('user_id', $user_id);
            }
        } else {
            $keluarbiayas = $keluarbiayas->where('user_id', $user_id);
        }
        $keluarbiayas = $keluarbiayas->orderBy('id','desc');
        $keluarbiayas = $keluarbiayas->filter(Request::only('status_keluarbiaya'))
            ->simplePaginate(10)
            ->appends(request()->all());
            $data['isAdmin'] = $is_admin;
            // $data['keluarbiayas'] = new KasbonApiResource($keluarbiayas);
            $data['keluarbiayas'] = $keluarbiayas;

        return $this->sendResponse($data,"Sukses");

    }
    public function statusKeluarbiayas(Keluarbiaya $keluarbiaya)
    {
        $status_keluarbiayas = collect(['wait_approval', 'approved', 'cancelled', 'rejected'])->map(function ($item) {
            return ['value' => $item, 'label' => $item];
        });
        $status_keluarbiaya=$status_keluarbiayas[0];
        if($keluarbiaya){
            $status_keluarbiaya = collect($status_keluarbiayas)->filter(fn($item)=>$item['value'] === $keluarbiaya->status_keluarbiaya)->first();
        }
        $data=['statusKeluarbiayas' => $status_keluarbiayas, 'statusKeluarbiaya'=>$status_keluarbiaya];
        return $this->sendResponse($data,"Sukses");
    }
    public function returSisaKasbon($kasbon, $jumlah)
    {
        $jsisa = $kasbon->sisa_penggunaan;
        //posting jurnalumum
        if ($jsisa > 0) {
            $ids = $kasbon->jurnalumums;
            if (count($ids) == 2) {
                $ids[0]->delete();
                $ids[1]->delete();
            }
        }
        // if ($jsisa > 0) {
        //     $akunkas = Akun::getKodeAkun('kas');
        //     $akunpiutang = Akun::getKodeAkun('piutang');
        //     $uraian = 'Kasbon Used - ' . $keluarbiaya->user->name . ' - ' . $keluarbiaya->keperluan;
        //     $parent_id = $keluarbiaya->id;
        //     $ids = $keluarbiaya->jurnalumums()->pluck('id');
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
        $keluarbiaya = Kasbon::find($id);
        if ($keluarbiaya) {
            $jmlkeluarbiaya = $keluarbiaya->jumlah_keluarbiaya;
            $jmlpenggunaan = $keluarbiaya->jumlah_penggunaan;
            $sisapenggunaan = $keluarbiaya->sisa_penggunaan;
            $tpenggunaan = $jmlpenggunaan - $jumlah_biaya;
            $jsisa =  $sisapenggunaan + $jumlah_biaya;
            if ($tpenggunaan < 0) {
                $tpenggunaan = 0;
                $jsisa = $jmlkeluarbiaya;
            }
            //posting jurnalumum
            // if ($sisapenggunaan > 0) {
            $akunkas = Akun::getKodeAkun('kas');
            $akunpiutang = Akun::getKodeAkun('piutang');
            $uraian = 'Kasbon Used - ' . $keluarbiaya->user->name . ' - ' . $keluarbiaya->keperluan;
            $parent_id = $keluarbiaya->id;
            $ids = $keluarbiaya->jurnalumums()->pluck('id');
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
                $keluarbiaya->update(
                    [
                        "jumlah_penggunaan" => $tpenggunaan,
                        'sisa_penggunaan' => $jsisa,
                        'status_keluarbiaya' => 'used'
                    ]
                );
                $keluarbiaya->jurnalumums()->sync($ids);
                // }
            }
        }
    }
    public function updateStatus(Keluarbiaya $keluarbiaya)
    {
        $validated =  request()->validate([
            'status_keluarbiaya' => ['required'],
        ]);
        $keluarbiaya->update($validated);
        $data['keluarbiaya']=$keluarbiaya;
        $kasbons = $keluarbiaya->kasbons;
        if (count($kasbons) > 0) {
            $id = $kasbons[0]->id;
            $kasbon = Kasbon::find($id);
            if ($keluarbiaya->status_keluarbiaya == 'approved') {
                $kasbon->update(['status_kasbon' => 'finish']);
            //     $this->returSisaKasbon($kasbon, 0);
            // } elseif ($keluarbiaya->status_keluarbiaya == 'wait_approval') {
                if ($keluarbiaya->saldo_akhir > 0) {
                    $kasbon->update(['status_kasbon' => 'used']);
                    $this->returSisaKasbon($kasbon, $keluarbiaya->saldo_akhir);
                }
            }
        }
        return $this->sendResponse($data,"Update Sukses");
    }

    public function getOptions(){
        $metodebayars   = Metodebayar::all()->toArray();
        $instansis = Instansi::all()->toArray();
        $rekenings = Rekening::all()->toArray();
        $itemkegiatans = Itemkegiatan::all()->toArray();

        $metodebayarOpts = collect($metodebayars)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_metodebayar']])->toArray();
        $instansiOpts = collect($instansis)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_instansi']])->toArray();
        array_unshift($instansiOpts, ['value' => '', 'label' => 'Pilih Instansi']);
        $rekeningOpts = collect($rekenings)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_rekening']])->toArray();
        $itemkegiatanOpts = collect($itemkegiatans)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_itemkegiatan']])->toArray();
        array_unshift($itemkegiatanOpts, ['value' => '', 'label' => 'Pilih Kegiatan']);
        $periodOpts = $this->getPeriodOpts();
        return $this->sendResponse(['metodebayarOpts'=>$metodebayarOpts, 'instansiOpts'=>$instansiOpts, 'rekeningOpts'=>$rekeningOpts,
        'itemkegiatanOpts'=>$itemkegiatanOpts, 'periodOpts'=>$periodOpts], "sukses");
    }


    public function store(Request $request)
    {

        $itemkegiatan_id = request('itemkegiatan_id');
        $val_itemkgt = ['required'];
        $itemkegiatan = Itemkegiatan::find($itemkegiatan_id);
        // $isunique = $itemkegiatan ? $itemkegiatan->isunique : false;
        // if ($isunique) {
        //     $val_itemkgt =  ['required', Rule::unique('dkeluarbiayas', 'itemkegiatan_id')->where('transpermohonan_id', request('transpermohonan_id'))];
        // }

        $validated =  request()->validate([
            'instansi_id' => ['required'],
            'metodebayar_id' => ['required'],
            'rekening_id' => ['required'],
            'kasbon_id' => ['nullable'],
            'saldo_awal' => ['nullable'],
            'jumlah_keluarbiaya' => ['nullable'],
            'saldo_akhir' => ['nullable'],
            'itemkegiatan_id' => $val_itemkgt,
            'catatan_keluarbiaya' => ['nullable'],
            'image_keluarbiaya' => ['nullable'],
        ]);

        $valkbuser = [
            'instansi_id'=>$validated['instansi_id'],
            'metodebayar_id'=>$validated['metodebayar_id'],
            'rekening_id'=>$validated['rekening_id'],
            'status_keluarbiaya'=>'approved',
            'saldo_awal'=>$validated['jumlah_keluarbiaya'],
            'jumlah_biaya'=>$validated['jumlah_keluarbiaya'],
            'saldo_akhir'=>0,
        ];
        $valdkbuser =[
            'jumlah_biaya' =>$validated['jumlah_keluarbiaya'],
            'ket_biaya' =>$validated['catatan_keluarbiaya'],
            'itemkegiatan_id' =>$validated['itemkegiatan_id'],
            'image_dkeluarbiaya' =>$validated['image_keluarbiaya'],
        ];
        $keluarbiaya = Keluarbiaya::create(
            $valkbuser
        );
        $dkeluarbiaya = $keluarbiaya->dkeluarbiayas()->create($valdkbuser);
        //posting jurnalumum
        $akunkredit = $keluarbiaya->metodebayar->akun_id;
        $akundebet = $itemkegiatan->akun_id;
        $uraian = $dkeluarbiaya->itemkegiatan->nama_itemkegiatan
            . ' - ' . $dkeluarbiaya->ket_biaya;
        $parent_id = $dkeluarbiaya->transpermohonan_id;
        $ju1 = Jurnalumum::create([
            'uraian' => $uraian,
            'akun_id' => $akundebet,
            'debet' => $dkeluarbiaya->jumlah_biaya,
            'kredit' => 0,
            'parent_id' => $parent_id
        ]);
        $ju2 = Jurnalumum::create([
            'uraian' => $uraian,
            'akun_id' => $akunkredit,
            'debet' => 0,
            'kredit' => $dkeluarbiaya->jumlah_biaya,
            'parent_id' => $parent_id
        ]);
        $ids = [$ju1->id, $ju2->id];
        $dkeluarbiaya->jurnalumums()->attach($ids);

        // $prosespermohonan->statusprosesperms()->attach($validated['prosespermohonan_id'], $validated);
        return $this->sendResponse(['dkeluarbiaya'=>$dkeluarbiaya], "sukses");
    }

    public function listByKeluarbiayaId()
    {
        $keluarbiaya_id = request('keluarbiaya_id');
        $dkeluarbiayas = Dkeluarbiaya::query();
        $dkeluarbiayas = $dkeluarbiayas->with('itemkegiatan:id,nama_itemkegiatan')
            // ->with('keluarbiaya', function ($q) {
            //     $q->select('id', 'metodebayar_id', 'user_id', 'instansi_id')
            //         ->with(['user:id,name', 'metodebayar:id,nama_metodebayar', 'instansi:id,nama_instansi']);
            // })
            ->where('keluarbiaya_id', '=', $keluarbiaya_id);
        $dkeluarbiayas = $dkeluarbiayas->orderBy('dkeluarbiayas.id', 'desc')
        ->simplePaginate(30)
        ->appends(request()->all());
    // return DkeluarbiayaStafCollection::collection($dkeluarbiayas);
        $data['dkeluarbiayas'] = new DkeluarbiayaStafApiResource($dkeluarbiayas);
        return $this->sendResponse($data,"Sukses");
        // return $dkeluarbiayas;
    }
    public function list()
    {
        $period = request('period', 'today');
        $periods = $this->getPeriodTimes($period);
        $dkeluarbiayas = Dkeluarbiaya::query();
        $dkeluarbiayas = $dkeluarbiayas->with('itemkegiatan:id,nama_itemkegiatan')
        ->whereRaw('dkeluarbiayas.created_at >= ? and dkeluarbiayas.created_at <= ?',  [$periods]);
        $search = request('search', '');
        $itemkegiatan_id = request('itemkegiatan_id', '');
        if(!empty($search)){
            $dkeluarbiayas = $dkeluarbiayas->where('ket_biaya', 'like', '%'.$search.'%');
        }
        if(!empty($itemkegiatan_id)){
            $dkeluarbiayas = $dkeluarbiayas->where('itemkegiatan_id', '=', $itemkegiatan_id);
        }
        // ->with('keluarbiaya', function ($q) {
            //     $q->select('id', 'metodebayar_id', 'user_id', 'instansi_id')
            //         ->with(['user:id,name', 'metodebayar:id,nama_metodebayar', 'instansi:id,nama_instansi']);
            // })
            // ->where('keluarbiaya_id', '=', $keluarbiaya_id);
        $dkeluarbiayas = $dkeluarbiayas->orderBy('dkeluarbiayas.id', 'desc')
        ->simplePaginate(10)
        ->appends(request()->all());
    // return DkeluarbiayaStafCollection::collection($dkeluarbiayas);
        $data['dkeluarbiayas'] = new DkeluarbiayaStafApiResource($dkeluarbiayas);
        return $this->sendResponse($data,"Sukses");
        // return $dkeluarbiayas;
    }
}
