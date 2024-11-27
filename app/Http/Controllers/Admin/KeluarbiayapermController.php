<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreKeluarbiayapermRequest;
use App\Http\Resources\Admin\KeluarbiayapermCollection;
use App\Models\Akun;
use App\Models\Itemkegiatan;
use App\Models\Jurnalumum;
use App\Models\Keluarbiayaperm;
use App\Models\Keluarbiayapermuser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class KeluarbiayapermController extends Controller
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
            'image_dkeluarbiayapermuser' => ['nullable'],
            'transpermohonan_id' => ['required'],
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
            'image_dkeluarbiayapermuser' =>$validated['image_dkeluarbiayapermuser'],
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

        return redirect()->back()->with('success', 'Pengeluaran biaya created.');
    }

    public function store_awal(StoreKeluarbiayapermRequest $request)
    {

        $keluarbiayaperm = Keluarbiayaperm::create(
            $request->validated()
        );

        //posting jurnalumum
        $akunkredit = $keluarbiayaperm->metodebayar->akun_id;
        $akundebet = $keluarbiayaperm->itemkegiatan->akun_id;
        $uraian = $keluarbiayaperm->itemkegiatan->nama_itemkegiatan
            . ' - ' . $keluarbiayaperm->transpermohonan->permohonan->nama_penerima
            . ' - ' . $keluarbiayaperm->transpermohonan->permohonan->alas_hak
            . ', ' . $keluarbiayaperm->transpermohonan->jenispermohonan->nama_jenispermohonan
            . ' - ' . $keluarbiayaperm->catatan_keluarbiayaperm;
        $parent_id = $keluarbiayaperm->transpermohonan_id;
        $ju1 = Jurnalumum::create([
            'uraian' => $uraian,
            'akun_id' => $akundebet,
            'debet' => $keluarbiayaperm->jumlah_keluarbiayaperm,
            'kredit' => 0,
            'parent_id' => $parent_id
        ]);
        $ju2 = Jurnalumum::create([
            'uraian' => $uraian,
            'akun_id' => $akunkredit,
            'debet' => 0,
            'kredit' => $keluarbiayaperm->jumlah_keluarbiayaperm,
            'parent_id' => $parent_id
        ]);
        $ids = [$ju1->id, $ju2->id];
        $keluarbiayaperm->jurnalumums()->attach($ids);
        // $prosespermohonan->statusprosesperms()->attach($validated['prosespermohonan_id'], $validated);

        return redirect()->back()->with('success', 'Pengeluaran biaya created.');
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
    public function destroy(Keluarbiayaperm $keluarbiayaperm)
    {
        $jurnalumums = $keluarbiayaperm->jurnalumums;
        for ($i = 0; $i < count($jurnalumums); $i++) {
            $rec = $jurnalumums[$i];
            $rec->delete();
        }
        $keluarbiayaperm->delete();
        return Redirect::back()->with('success', 'Pengeluaran biaya deleted.');
    }
    public function list()
    {
        $transpermohonan_id = request('transpermohonan_id');
        $keluarbiayaperms = Keluarbiayaperm::query();
        $keluarbiayaperms = $keluarbiayaperms->with(['metodebayar', 'user', 'itemkegiatan'])->where('transpermohonan_id', '=', $transpermohonan_id);
        $keluarbiayaperms = $keluarbiayaperms->orderBy('keluarbiayaperms.id', 'desc')
            ->cursorPaginate(10)->withQueryString();
        return KeluarbiayapermCollection::collection($keluarbiayaperms);
    }
    public function getTotalPengeluaran()
    {
        $transpermohonan_id = request('transpermohonan_id');
        $totalPengeluaran = Keluarbiayaperm::where('transpermohonan_id', '=', $transpermohonan_id)->sum('jumlah_keluarbiayaperm');
        return number_format($totalPengeluaran);
    }
}
