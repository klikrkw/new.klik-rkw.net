<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\BayarbiayapermCollection;
use App\Http\Resources\Admin\KeluarbiayapermCollection;
use App\Models\Akun;
use App\Models\Bayarbiayaperm;
use App\Models\Jurnalumum;
use Illuminate\Http\Request;

class BayarbiayapermController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'biayaperm_id' => ['required'],
            'saldo_awal' => ['required', 'numeric', 'min:0'],
            'jumlah_bayar' => ['required', 'numeric', 'min:0'],
            'saldo_akhir' => ['required', 'numeric', 'min:0'],
            'metodebayar_id' => ['required'],
            'info_rekening' => ['nullable'],
            'catatan_bayarbiayaperm' => ['nullable'],
            'image_bayarbiayaperm' => ['nullable'],
            'rekening_id' => ['required'],
        ]);

        $bayarbiayaperm = Bayarbiayaperm::create(
            $validated
        );
        // $akunkredit = Akun::getKodeAkun('pendapatan-operasional');
        $akunkredit = Akun::getKodeAkun('piutang');

        $jml_biaya = $bayarbiayaperm->biayaperm->jumlah_biayaperm;
        $saldo_awal = $bayarbiayaperm->saldo_awal;
        //posting jurnalumum
        $akundebet = $bayarbiayaperm->rekening->akun_id;
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

            // $akundebet = Akun::getKodeAkun('piutang');
            // $akunkredit = Akun::getKodeAkun('pendapatan-operasional');
            // $ju1 = Jurnalumum::create([
            //     'uraian' => $uraian,
            //     'akun_id' => $akundebet,
            //     'debet' => $bayarbiayaperm->saldo_akhir,
            //     'kredit' => 0,
            //     'parent_id' => $parent_id
            // ]);
            // $ju2 = Jurnalumum::create([
            //     'uraian' => $uraian,
            //     'akun_id' => $akunkredit,
            //     'debet' => 0,
            //     'kredit' => $bayarbiayaperm->saldo_akhir,
            //     'parent_id' => $parent_id
            // ]);
            // $ids = [$ju1->id, $ju2->id];
            // $bayarbiayaperm->jurnalumums()->attach($ids);
        // $prosespermohonan->statusprosesperms()->attach($validated['prosespermohonan_id'], $validated);
        $saldoawal = $bayarbiayaperm->biayaperm->jumlah_bayar;
        $bayarbiayaperm->biayaperm->update([
            'jumlah_bayar' => $saldoawal + $bayarbiayaperm->jumlah_bayar,
            'kurang_bayar' => $bayarbiayaperm->saldo_akhir,
        ]);

        return redirect()->back()->with('success', 'Pembayaran created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function list()
    {
        $biayaperm_id = request('biayaperm_id');
        $bayarbiayaperm = Bayarbiayaperm::query();
        $bayarbiayaperm = $bayarbiayaperm->with(['metodebayar:id,nama_metodebayar', 'user:id,name'])->where('biayaperm_id', '=', $biayaperm_id);
        $bayarbiayaperm = $bayarbiayaperm->orderBy('bayarbiayaperms.id', 'asc')
            ->cursorPaginate(10)->withQueryString();
        return BayarbiayapermCollection::collection($bayarbiayaperm);
    }
}
