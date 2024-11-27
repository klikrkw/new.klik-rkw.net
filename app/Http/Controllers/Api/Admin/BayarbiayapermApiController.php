<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\BayarbiayapermCollection;
use App\Models\Akun;
use App\Models\Bayarbiayaperm;
use App\Models\Jurnalumum;
use App\Models\Metodebayar;
use App\Models\Rekening;
use Illuminate\Http\Request;

class BayarbiayapermApiController extends BaseController
{
    public function index()
    {
        $biayaperm_id = request('biayaperm_id');
        $bayarbiayaperm = Bayarbiayaperm::query();
        $bayarbiayaperm = $bayarbiayaperm->with(['metodebayar:id,nama_metodebayar', 'user:id,name'])->where('biayaperm_id', '=', $biayaperm_id);
        $bayarbiayaperm = $bayarbiayaperm->orderBy('bayarbiayaperms.id', 'asc')
            ->skip(0)->take(100)->get();
        return $this->sendResponse(['bayarbiayaperms'=>BayarbiayapermCollection::collection($bayarbiayaperm)],'Sukses');
    }

    public function metodebayarOpts()
    {
        $metodebayars = Metodebayar::all();
        $data['metodebayarOpts'] = collect($metodebayars)->map(function ($item) {
            return ['value' => $item['id'], 'label' => $item['nama_metodebayar']];
        });
        return $this->sendResponse($data,"Sukses");
    }
    public function rekeningOpts()
    {
        $rekenings = Rekening::all();
        $data['rekeningOpts'] = collect($rekenings)->map(function ($item) {
            return ['value' => $item['id'], 'label' => $item['nama_rekening']];
        });
        return $this->sendResponse($data,"Sukses");
    }

    public function store(Request $request)
    {
        $validated =  request()->validate([
            'biayaperm_id' => ['required'],
            'saldo_awal' => ['required', 'numeric', 'min:1'],
            'jumlah_bayar' => ['required', 'numeric', 'min:1'],
            'saldo_akhir' => ['required', 'numeric', 'min:0'],
            'metodebayar_id' => ['required'],
            'rekening_id' => ['required'],
            'info_rekening' => ['nullable'],
            'catatan_bayarbiayaperm' => ['nullable'],
            'image_bayarbiayaperm' => ['nullable']
        ]);

        $bayarbiayaperm = Bayarbiayaperm::create(
            $validated
        );
        // $akunkredit = Akun::getKodeAkun('pendapatan-operasional');
        $akunkredit = Akun::getKodeAkun('piutang');

        $jml_biaya = $bayarbiayaperm->biayaperm->jumlah_biayaperm;
        $saldo_awal = $bayarbiayaperm->saldo_awal;
        //posting jurnalumum
        $akundebet = $bayarbiayaperm->metodebayar->akun_id;
        // if ($jml_biaya > $saldo_awal) {
        //     $akunkredit = Akun::getKodeAkun('piutang');
        // }
        // $uraian = $bayarbiayaperm->biayaperm->transpermohonan->jenispermohonan->nama_jenispermohonan . ' - ' . $bayarbiayaperm->catatan_bayarbiayaperm;
        $uraian = $bayarbiayaperm->biayaperm->transpermohonan->permohonan->nama_penerima
            . ' - ' . $bayarbiayaperm->biayaperm->transpermohonan->permohonan->alas_hak
            . ', ' .  $bayarbiayaperm->biayaperm->transpermohonan->jenispermohonan->nama_jenispermohonan
            . ' - ' . $bayarbiayaperm->catatan_bayarbiayaperm;
        $parent_id = $bayarbiayaperm->biayaperm->transpermohonan->id;
        $ju1 = Jurnalumum::create([
            'uraian' => $uraian,
            'akun_id' => $akundebet,
            'debet' => $bayarbiayaperm->jumlah_bayar,
            'kredit' => 0,
            'parent_id' => $parent_id
        ]);
        $ju2 = Jurnalumum::create([
            'uraian' => $uraian,
            'akun_id' => $akunkredit,
            'debet' => 0,
            'kredit' => $bayarbiayaperm->jumlah_bayar,
            'parent_id' => $parent_id
        ]);
        $ids = [$ju1->id, $ju2->id];
        $bayarbiayaperm->jurnalumums()->attach($ids);

        $saldoawal = $bayarbiayaperm->biayaperm->jumlah_bayar;
        $bayarbiayaperm->biayaperm->update([
            'jumlah_bayar' => $saldoawal + $bayarbiayaperm->jumlah_bayar,
            'kurang_bayar' => $bayarbiayaperm->saldo_akhir,
        ]);

        return $this->sendResponse(['bayarbiayaperm'=>$bayarbiayaperm],"Add Pembayaran Sukses");
    }

}
