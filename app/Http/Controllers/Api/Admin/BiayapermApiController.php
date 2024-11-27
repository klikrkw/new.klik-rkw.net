<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Admin\BiayapermCollection;
use App\Models\Akun;
use App\Models\Bayarbiayaperm;
use App\Models\Biayaperm;
use App\Models\Jurnalumum;
use App\Models\Metodebayar;
use App\Models\Rincianbiayaperm;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BiayapermApiController extends BaseController
{
    public function index()
    {
        $transpermohonan_id = request('transpermohonan_id') ? request('transpermohonan_id') : null;
        $biayaperms = Biayaperm::query();
        $biayaperms = $biayaperms->where('transpermohonan_id','=',$transpermohonan_id);
        $biayaperms = $biayaperms->orderBy('id', 'desc')->take(100)->skip(0)->get();
        return $this->sendResponse(['biayaperms'=>BiayapermCollection::collection($biayaperms)],'Sukses');
    }
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'transpermohonan_id' => ['required'],
            'jumlah_biayaperm' => ['required', 'numeric', 'min:1'],
            'jumlah_bayar' => ['required', 'numeric', 'min:0'],
            'kurang_bayar' => ['required', 'numeric', 'min:0'],
            'catatan_biayaperm' => ['required'],
            'image_biayaperm' => ['nullable'],
            'rincianbiayaperm_id' => ['nullable'],
        ]);
        $biayaperm = Biayaperm::create(
            $validated
        );

        //posting jurnalumum
        $akun_piutang = Akun::getKodeAkun('piutang');
        $akun_pendapatan = Akun::getKodeAkun('pendapatan-operasional');
        $akun_biaya = Akun::getKodeAkun('biaya-operasional');
        // $uraian = $biayaperm->transpermohonan->jenispermohonan->nama_jenispermohonan . ' - ' . $biayaperm;
        $uraian = $biayaperm->transpermohonan->permohonan->nama_penerima
            . ' - ' . $biayaperm->transpermohonan->permohonan->alas_hak
            . ', ' .  $biayaperm->transpermohonan->jenispermohonan->nama_jenispermohonan;
        $parent_id = $biayaperm->transpermohonan->id;
        $akun_kas=null;
        if(!empty($validated['rincianbiayaperm_id'])){
            $rincianbiayaperm_id = $validated['rincianbiayaperm_id'];
            $rincianbiayaperm = null;
                $rincianbiayaperm = Rincianbiayaperm::find($rincianbiayaperm_id);
                if ($rincianbiayaperm) {
                    $rincianbiayaperm->update([
                        'status_rincianbiayaperm' => 'approved'
                    ]);
                    $biayaperm->rincianbiayaperms()->attach($rincianbiayaperm->id);
                    $akun_kas = $rincianbiayaperm->metodebayar->akun_id;
                }
            $validated =  [
                'biayaperm_id' => $biayaperm->id,
                'saldo_awal' => $validated['jumlah_biayaperm'],
                'jumlah_bayar' =>  $validated['jumlah_bayar'],
                'saldo_akhir' => $validated['kurang_bayar'],
                'metodebayar_id' => $rincianbiayaperm->metodebayar_id,
                'rekening_id' => $rincianbiayaperm->rekening_id,
                'info_rekening' => '',
                'catatan_bayarbiayaperm' => $validated['catatan_biayaperm'],
                'image_bayarbiayaperm' => $validated['image_biayaperm'],
            ];
            $bayarbiayaperm = Bayarbiayaperm::create(
                $validated
            );

        //awal sementara dinon aktifkan
            $ids=[];
            $ju1 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akun_kas,
                'debet' => $biayaperm->jumlah_bayar,
                'kredit' => 0,
                'parent_id' => $parent_id
            ]);
            array_push($ids, $ju1->id);
            if($biayaperm->kurang_bayar>0){
                $ju2 = Jurnalumum::create([
                    'uraian' => $uraian,
                    'akun_id' => $akun_piutang,
                    'debet' => $biayaperm->kurang_bayar,
                    'kredit' => 0,
                    'parent_id' => $parent_id
                ]);
                array_push($ids, $ju2->id);
            }
            $ju3 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akun_pendapatan,
                'debet' => 0,
                'kredit' => $biayaperm->jumlah_biayaperm,
                'parent_id' => $parent_id
            ]);
            array_push($ids, $ju3->id);
            if($rincianbiayaperm->total_pengeluaran>0){
                $ju4 = Jurnalumum::create([
                'uraian' => 'Pengeluaran',
                'akun_id' => $akun_biaya,
                'debet' => $rincianbiayaperm->total_pengeluaran,
                'kredit' => 0,
                'parent_id' => $parent_id
                ]);
                $ju5 = Jurnalumum::create([
                    'uraian' => 'Pengeluaran',
                    'akun_id' => $akun_kas,
                    'debet' => 0,
                    'kredit' => $rincianbiayaperm->total_pengeluaran,
                    'parent_id' => $parent_id
                ]);
                array_push($ids, $ju4->id, $ju5->id);
            }
            $biayaperm->jurnalumums()->attach($ids);
        }else{
            $ju1 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akun_piutang,
                'debet' => $biayaperm->kurang_bayar,
                'kredit' => 0,
                'parent_id' => $parent_id
            ]);
            $ju2 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akun_pendapatan,
                'debet' => 0,
                'kredit' => $biayaperm->jumlah_biayaperm,
                'parent_id' => $parent_id
            ]);
            $ids = [$ju1->id, $ju2->id];
            $biayaperm->jurnalumums()->attach($ids);
        }
        //akhir sementara dinon aktifkan

        return $this->sendResponse(['biayaperm'=>$biayaperm],'Sukses');
    }

    public function destroy(Biayaperm $biayaperm)
    {
        $rec_biayaperm = Bayarbiayaperm::where('biayaperm_id', $biayaperm->id)->first();
        if ($rec_biayaperm) {
            throw ValidationException::withMessages(['error_delete' => 'biaya permohonan tidak bisa dihapus']);
            return $this->sendResponse(['errors'=>'error'],'sukses');
        }

        $jurnalumums = $biayaperm->jurnalumums;
        for ($i = 0; $i < count($jurnalumums); $i++) {
            $rec = $jurnalumums[$i];
            $rec->delete();
        }

        $biayaperm->delete();
        return $this->sendResponse(['data'=>'Biaya berhasil dihapus'],'sukses');
    }
    public function show(Biayaperm $biayaperm)
    {
        // $id = request('id');
        // $biayaperm = Biayaperm::find($id);
        // $biayaperm->tgl_biayaperm =  Carbon::parse($biayaperm->created_at)->format('d F Y');
        $data['biayaperm'] = $biayaperm;
        return $this->sendResponse($data,"Sukses");
    }


}
