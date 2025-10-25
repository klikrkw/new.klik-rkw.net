<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use App\Models\Itemprosesperm;
use App\Models\Jurnalumum;
use App\Models\Transpermohonan;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JurnalumumController extends Controller
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
        //
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

    public function NeracaPermohonan()
    {
        // ->selectRaw('price * ? as price_with_tax', [1.0825])
        // ->selectRaw('akuns.kode_akun,akuns.nama_akun,if(jenisakuns.kode_jenisakun=1 or jenisakuns.kode_jenisakun=5,
        // if(sum(debet)>sum(kredit),sum(debet)-sum(kredit),sum(kredit)-sum(debet)),0) as debet,
        // if(jenisakuns.kode_jenisakun >1 and jenisakuns.kode_jenisakun<5,
        // if(sum(debet)>sum(kredit),sum(debet)-sum(kredit),sum(kredit)-sum(debet)),0) as kredit')

        $pre = Jurnalumum::where('parent_id', request('transpermohonan_id'))
            ->selectRaw('akuns.kode_akun,akuns.nama_akun,if(jenisakuns.kode_jenisakun=1 or jenisakuns.kode_jenisakun=5,
        sum(debet)-sum(kredit),0) as debet,
        if(jenisakuns.kode_jenisakun>1 and jenisakuns.kode_jenisakun<5,
        sum(kredit)-sum(debet),0) as kredit')
            ->join('akuns', 'jurnalumums.akun_id', 'akuns.id')
            ->join('kelompokakuns', 'akuns.kelompokakun_id', 'kelompokakuns.id')
            ->join('jenisakuns', 'kelompokakuns.jenisakun_id', 'jenisakuns.id')
            ->orderBy('akuns.kode_akun', 'asc')
            ->groupBy('akuns.nama_akun','akuns.kode_akun')->groupBy('jenisakuns.kode_jenisakun');

        // if ($data['bulan'] > 0) {
        //     $pre = $pre->whereRaw('MONTH(tanggal_jurnal)<=?', $data['bulan']);
        // }
        // $pre->whereRaw('YEAR(tanggal_jurnal)=?', [$data['tahun']])->groupBy('nmsubakun', 'kdjenis');
        $result = $pre->get();
        $tot_debet = 0;
        $tot_kredit = 0;
        for ($i = 0; $i < count($result); $i++) {
            $value = $result[$i];
            $tot_debet += $value->debet;
            $tot_kredit += $value->kredit;
            $value->debet = number_format($value->debet);
            $value->kredit = number_format($value->kredit);
        }

        // $jurnal = $jurnal
        //     ->select(DB::raw('sum(kredit)-sum(debet) as pendapatan'))
        //     ->join('akuns', 'jurnalumums.akun_id', 'akuns.id')
        //     ->join('kelompokakuns', 'akuns.kelompokakun_id', 'kelompokakuns.id')
        //     ->join('jenisakuns', 'kelompokakuns.jenisakun_id', 'jenisakuns.id')
        //     ->where('jenisakuns.kode_jenisakun', 'like', '4')
        //     ->first();

        return response()->json(['neracas' => $result, 'totDebet' => number_format($tot_debet), 'totKredit' => number_format($tot_kredit)]);
    }

    public function NeracaPermohonanPdf(Transpermohonan $transpermohonan)
    {

        $pre = Jurnalumum::where('parent_id', $transpermohonan->id)
            ->selectRaw('akuns.kode_akun,akuns.nama_akun,if(jenisakuns.kode_jenisakun=1 or jenisakuns.kode_jenisakun=5,
        sum(debet)-sum(kredit),0) as debet,
        if(jenisakuns.kode_jenisakun>1 and jenisakuns.kode_jenisakun<5,
        sum(kredit)-sum(debet),0) as kredit')
            ->join('akuns', 'jurnalumums.akun_id', 'akuns.id')
            ->join('kelompokakuns', 'akuns.kelompokakun_id', 'kelompokakuns.id')
            ->join('jenisakuns', 'kelompokakuns.jenisakun_id', 'jenisakuns.id')
            ->orderBy('akuns.kode_akun', 'asc')
            ->groupBy('akuns.nama_akun','akuns.kode_akun')->groupBy('jenisakuns.kode_jenisakun');

        $result = $pre->get();
        $tot_debet = 0;
        $tot_kredit = 0;
        for ($i = 0; $i < count($result); $i++) {
            $value = $result[$i];
            $tot_debet += $value->debet;
            $tot_kredit += $value->kredit;
            $value->debet = number_format($value->debet);
            $value->kredit = number_format($value->kredit);
        }

        $tanggal = Carbon::now()->format('d M Y');
        $pdf = Pdf::loadView('pdf.lapNeracaPermohonan', [
            'judul_lap' => 'NERACA',
            'neracas' => $result,
            'transpermohonan'=>$transpermohonan,
            'totDebet' => number_format($tot_debet),
            'totKredit' => number_format($tot_kredit),
            'tanggal' => $tanggal,
        ])->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
        return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
    }

}
