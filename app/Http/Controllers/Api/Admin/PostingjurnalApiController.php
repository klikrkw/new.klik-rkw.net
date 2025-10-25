<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Akun;
use App\Models\Jurnalumum;
use App\Models\Kasbon;
use App\Models\Keluarbiaya;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Admin\KeluarbiayaCollection;
use App\Http\Resources\Admin\PostingjurnalCollection;
use App\Http\Resources\Api\PostingjurnalWithPageApiResource;
use App\Models\Instansi;
use App\Models\Itemkegiatan;
use App\Models\Metodebayar;
use App\Models\Postingjurnal;
use App\Models\Rekening;
use Illuminate\Support\Facades\Request;
use App\Traits\PeriodetimeTrait;
use Carbon\Carbon;

class PostingjurnalApiController extends BaseController
{
    use PeriodetimeTrait;
    public function index()
    {
        $postingjurnals = Postingjurnal::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $postingjurnals = $postingjurnals
            ->with('user')
            ->orderBy(request('sortBy'), request('sortDir'));
        }
        $postingjurnals = $postingjurnals->filter(Request::only('search','period'))
            ->with('user')
            ->simplePaginate(10)
            ->appends(Request::all());
            $data['postingjurnals'] = new PostingjurnalWithPageApiResource($postingjurnals);
        return $this->sendResponse($data,"Sukses");
    }

    public function pageParams()
    {
        $akuns = Akun::all();
        $media = request('media', 'screen');
        $date1 = Carbon::now();
        // $last_day = $date2->daysInMonth;
        $now = Carbon::now();
        $prev = $date1->subDays(7);
        $period_opts = [
            ['value' => 'today', 'label' => 'Hari ini'],
            ['value' => 'this_week', 'label' => 'Minggu ini'],
            ['value' => 'this_month', 'label' => 'Bulan ini'],
            ['value' => 'this_year', 'label' => 'Tahun ini'],
            ['value' => 'tanggal', 'label' => 'Tanggal'],
        ];

        $data = [
            'media' => $media,
            'akunOpts' => collect($akuns)->map(fn ($o) => ['label' => $o->nama_akun, 'value' => $o->id])->toArray(),
            'periodOpts' => $period_opts,
            'date1' => $prev->format('Y-m-d'),
            'date2' => $now->format('Y-m-d'),
        ];

        return $this->sendResponse($data,"Sukses");

    }

    public function statusKeluarbiayas(Keluarbiaya $postingjurnal)
    {
        $status_postingjurnals = collect(['wait_approval', 'approved', 'cancelled', 'rejected'])->map(function ($item) {
            return ['value' => $item, 'label' => $item];
        });
        $status_postingjurnal=$status_postingjurnals[0];
        if($postingjurnal){
            $status_postingjurnal = collect($status_postingjurnals)->filter(fn($item)=>$item['value'] === $postingjurnal->status_postingjurnal)->first();
        }
        $data=['statusKeluarbiayas' => $status_postingjurnals, 'statusKeluarbiaya'=>$status_postingjurnal];
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
        //     $uraian = 'Kasbon Used - ' . $postingjurnal->user->name . ' - ' . $postingjurnal->keperluan;
        //     $parent_id = $postingjurnal->id;
        //     $ids = $postingjurnal->jurnalumums()->pluck('id');
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
        $kasbon = Kasbon::find($id);
        if ($kasbon) {
            $jmlkasbon = $kasbon->jumlah_kasbon;
            $jmlpenggunaan = $kasbon->jumlah_penggunaan;
            $sisapenggunaan = $kasbon->sisa_penggunaan;
            $tpenggunaan = $jmlpenggunaan - $jumlah_biaya;
            $jsisa =  $sisapenggunaan + $jumlah_biaya;
            if ($tpenggunaan < 0) {
                $tpenggunaan = 0;
                $jsisa = $jmlkasbon;
            }
            //posting jurnalumum
            // if ($sisapenggunaan > 0) {
            $akunkas = Akun::getKodeAkun('kas');
            $akunpiutang = Akun::getKodeAkun('piutang');
            $uraian = 'Kasbon Used - ' . $kasbon->user->name . ' - ' . $kasbon->keperluan;
            $parent_id = $kasbon->id;
            $ids = $kasbon->jurnalumums()->pluck('id');
            if (count($ids) == 2) {
                $ju1 = Jurnalumum::updateOrCreate(['id' => $ids[0]], [
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'uraian' => $uraian,
                    'akun_id' => $akunpiutang,
                    'debet' => $jsisa,
                    'kredit' => 0,
                    'parent_id' => $parent_id
                ]);
                $ju2 = Jurnalumum::updateOrCreate(['id' => $ids[1]], [
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'uraian' => $uraian,
                    'akun_id' => $akunkas,
                    'debet' => 0,
                    'kredit' => $jsisa,
                    'parent_id' => $parent_id
                ]);
                $kasbon->update(
                    [
                        "jumlah_penggunaan" => $tpenggunaan,
                        'sisa_penggunaan' => $jsisa,
                        'status_kasbon' => 'used'
                    ]
                );
                $kasbon->jurnalumums()->sync($ids);
                // }
            }
        }

    }
    public function updateStatus(Keluarbiaya $postingjurnal)
    {
        $validated =  request()->validate([
            'status_postingjurnal' => ['required'],
        ]);
        $postingjurnal->update($validated);
        $data['postingjurnal']= new KeluarbiayaCollection($postingjurnal);
        $kasbons = $postingjurnal->kasbons;
        if (count($kasbons) > 0) {
            $id = $kasbons[0]->id;
            $kasbon = Kasbon::find($id);
            if ($postingjurnal->status_postingjurnal == 'approved') {
                // $kasbon->update(['status_kasbon' => 'finish']);
            //     $this->returSisaKasbon($kasbon, 0);
            // } elseif ($postingjurnal->status_postingjurnal == 'wait_approval') {
                // if ($postingjurnal->saldo_akhir > 0) {
                    $kasbon->update(['status_kasbon' => 'used']);
                    $this->returSisaKasbon($kasbon, $postingjurnal->saldo_akhir);
                // }
            }
        }
        return $this->sendResponse($data,"Update Sukses");
    }

    public function show(Postingjurnal $postingjurnal){
        // $rs_postingjurnal = new PostingjurnalCollection($postingjurnal);
        return $this->sendResponse($postingjurnal, "sukses");
    }

    public function getAkunOptions(){
        $akuns = Akun::all()->toArray();
        $akunOpts = collect($akuns)->map(fn ($item) => ['value' => $item['id'], 'label' => sprintf('%s - %s',$item['nama_akun'], $item['kode_akun'])])->toArray();
        array_unshift($akunOpts, ['value' => '', 'label' => 'Pilih Kegiatan']);
        return $this->sendResponse(['akunOpts'=>$akunOpts], "sukses");
    }

    public function getOptions(){
        $metodebayars   = Metodebayar::all()->toArray();
        $instansis = Instansi::all()->toArray();
        $rekenings = Rekening::all()->toArray();
        $akuns = Itemkegiatan::all()->toArray();
        $cuser = request()->user();
        $kasbons = Kasbon::where('status_kasbon', 'approved')->where('sisa_penggunaan', '>', '0')->where('jenis_kasbon', '=', 'non_permohonan')->where('user_id', $cuser->id)->get();
        $kasbonOpts = collect($kasbons)->map(fn ($item) => ['value' => $item['id'], 'label' => sprintf('%s - %s',$item['keperluan'], number_format($item['sisa_penggunaan'])), 'data' => $item])->toArray();
        $ksb = new Kasbon();
        $ksb->jumlah_kasbon=0;
        $ksb->jumlah_penggunaan=0;
        $ksb->sisa_penggunaan=0;
        array_unshift($kasbonOpts, ['value' => '', 'label' => 'No Kasbon', 'data'=>$ksb]);

        $metodebayarOpts = collect($metodebayars)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_metodebayar']])->toArray();
        $instansiOpts = collect($instansis)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_instansi']])->toArray();
        array_unshift($instansiOpts, ['value' => '', 'label' => 'Pilih Instansi']);
        $rekeningOpts = collect($rekenings)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_rekening']])->toArray();
        $akunOpts = collect($akuns)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_akun']])->toArray();
        array_unshift($akunOpts, ['value' => '', 'label' => 'Pilih Kegiatan']);
        $periodOpts = $this->getPeriodOpts();
        return $this->sendResponse(['metodebayarOpts'=>$metodebayarOpts, 'instansiOpts'=>$instansiOpts, 'rekeningOpts'=>$rekeningOpts,
        'akunOpts'=>$akunOpts, 'periodOpts'=>$periodOpts, 'kasbonOpts'=>$kasbonOpts], "sukses");
    }

    public function update(Postingjurnal $postingjurnal)
    {
        $validated =  request()->validate([
            'uraian' => ['required'],
            'akun_debet' => ['required'],
            'akun_kredit' => ['required'],
            'jumlah' => ['required'],
            'image' => ['nullable'],
        ]);

        $postingjurnal->update(
            $validated
        );

        $ju = $postingjurnal->jurnalumums;
        if (count($ju) > 1) {
            $rec = $ju[0];
            $rec->update([
                'akun_id' => $postingjurnal->akun_debet,
                'uraian' => $postingjurnal->uraian,
                'debet' => $postingjurnal->jumlah,
                'kredit' => 0,
            ]);
            $rec = $ju[1];
            $rec->update([
                'akun_id' => $postingjurnal->akun_kredit,
                'uraian' => $postingjurnal->uraian,
                'debet' => 0,
                'kredit' => $postingjurnal->jumlah,
            ]);
        };
        return $this->sendResponse(['postingjurnal'=>$postingjurnal], "sukses");
    }

    public function store(Request $request)
    {
        $validated =  request()->validate([
            'uraian' => ['required'],
            'akun_debet' => ['required'],
            'akun_kredit' => ['required'],
            'jumlah' => ['required'],
            'image' => ['nullable'],
        ]);


        $postingjurnal = Postingjurnal::create(
            $validated
        );

        if ($postingjurnal) {
        $ids = [];
        $ju1 = Jurnalumum::create([
            'uraian' => $postingjurnal->uraian,
            'akun_id' => $postingjurnal->akun_debet,
            'debet' => $postingjurnal->jumlah,
            'kredit' => 0,
            'parent_id' => $postingjurnal->id
        ]);
        $ju2 = Jurnalumum::create([
            'uraian' => $postingjurnal->uraian,
            'akun_id' => $postingjurnal->akun_kredit,
            'debet' => 0,
            'kredit' => $postingjurnal->jumlah,
            'parent_id' => $postingjurnal->id
        ]);
        $ids = [$ju1->id, $ju2->id];
        $postingjurnal->jurnalumums()->attach($ids);
        }
        return $this->sendResponse(['postingjurnal'=>$postingjurnal], "sukses");
    }
   public function destroy(Postingjurnal $postingjurnal)
    {
        $jurnalumums = $postingjurnal->jurnalumums;
        for ($i = 0; $i < count($jurnalumums); $i++) {
            $rec = $jurnalumums[$i];
            $rec->delete();
        }
        $postingjurnal->delete();
        return $this->sendResponse(['data'=>'Postingjurnal berhasil dihapus'],'sukses');
    }

    public function list()
    {
        // $postingjurnal_id = request('postingjurnal_id', '');
        // $dpostingjurnals = Postingjurnal::query();
        // $dpostingjurnals = $dpostingjurnals->with('akun:id,nama_akun');
        // $dpostingjurnals = $dpostingjurnals->where('postingjurnal_id', '=', $postingjurnal_id);
        // $dpostingjurnals = $dpostingjurnals->orderBy('dpostingjurnals.id', 'desc')
        // ->simplePaginate(10)
        // ->appends(request()->all());
        // $data['dpostingjurnals'] = new PostingjurnalApiResource($dpostingjurnals);
        // return $this->sendResponse($data,"Sukses");
    }



}
