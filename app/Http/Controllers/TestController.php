<?php

namespace App\Http\Controllers;

use App\Http\Resources\Admin\EventCollection;
use App\Models\Akun;
use App\Models\Dkeluarbiayapermuser;
use App\Models\Event;
use App\Models\Itemkegiatan;
use App\Models\Kelompokakun;
use App\Models\Keluarbiaya;
use App\Models\Keluarbiayapermuser;
use App\Models\Permohonan;
use App\Models\Prosespermohonan;
use App\Models\Tempatarsip;
use App\Models\User;
use App\Services\MessageBuilder;
use App\Traits\FirebaseTrait;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Google\Cloud\Firestore\FieldValue;
use Illuminate\Support\Facades\Http;
use PhpParser\Node\Expr\Match_;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use FirebaseTrait;
    protected $firestoreDB;

    public function __construct()
    {
        $this->firestoreDB = app('firebase.firestore')->database();
    }

    public function index()
    {
        $datas = Permohonan::where('cek_biaya', 0)->where('period_cekbiaya', 'limited')->where('date_cekbiaya', '=', Carbon::now()->format('Y-m-d'))
        ->skip(0)->take(100)->get();
        if(count($datas)>0){
            for ($i=0; $i < count($datas) ; $i++) {
                $row = $datas[$i];
                $row->update([
                    'cek_biaya' => 1,
                ]);
            }
        }
        // return Inertia::render('Test/Test', [
        //     'users' => $users->get(),
        // ]);
        return response()->json($datas->pluck('nama_penerima')->toArray());
    }

    /**
     * Show the form for creating a new resource.
     */

    public function generateQRCode()
    {
        // Generate QR Code dengan data sederhana
        QrCode::format('png')->size(200)->generate('T202400001', public_path('qrcode.png'));
        return Inertia::render('Test/Qrcode', ['qrCode'=>'qrcode.png']);
    }

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
    public function show()
    {
        $response = Http::get('https://bphtb.patikab.go.id/pendaftaran');
        $headers = $response->headers();
        $hdrs = $headers['Set-Cookie'];
        $hd1 = substr($hdrs[0],0,strpos($hdrs[0],'expires',0));
        $hd2 = substr($hdrs[1],0,strpos($hdrs[1],'; expires',0));

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://bphtb.patikab.go.id/pendaftaran/datagrid-revisi');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'accept: */*',
            'accept-language: en-US,en;q=0.9,id;q=0.8,de-DE;q=0.7,de;q=0.6',
            'content-type: application/json',
            'origin: https://bphtb.patikab.go.id',
            'priority: u=1, i',
            'referer: https://bphtb.patikab.go.id/pendaftaran',
            'sec-ch-ua: "Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
            'sec-ch-ua-mobile: ?0',
            'sec-ch-ua-platform: "Windows"',
            'sec-fetch-dest: empty',
            'sec-fetch-mode: cors',
            'sec-fetch-site: same-origin',
            'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
            'x-csrf-token: jZfiMwFi344eaIykHhi15eh7MFjwC5m5B715obY5',
            'x-requested-with: XMLHttpRequest',
        ]);
        $hdrs = $headers['Set-Cookie'];
        $hd1 = substr($hdrs[0],0,strpos($hdrs[0],'expires',0));
        $hd2 = substr($hdrs[1],0,strpos($hdrs[1],'; expires',0));
        curl_setopt($ch, CURLOPT_COOKIE, sprintf('%s%s',$hd1,$hd2));
        curl_setopt($ch, CURLOPT_POSTFIELDS, '{"filter":{"nomor":"","tanggal":"01-01-2025 - 17-02-2025","jenis_transaksi":"","notaris":"37","nama_wp":"","nop":"","kode_bill":""},"sorting":{},"pagination":{"pageNumber":0,"pageSize":"10"}}');        curl_setopt($ch, CURLOPT_POSTFIELDS, '{"filter":{"nomor":"","tanggal":"01-01-2025 - 17-02-2025","jenis_transaksi":"","notaris":"37","nama_wp":"","nop":"","kode_bill":""},"sorting":{},"pagination":{"pageNumber":0,"pageSize":"10"}}');

        $response = curl_exec($ch);
        curl_close($ch);
    $data = null;
    // if($response->ok()){
        // $data = $response->body();
    // }
        return Inertia::render('Test/Test',['data'=>json_decode($response, true)]);
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

    public function pdf()
    {
        $row = request('row',1);
        $col = request('col',1);
        QrCode::format('png')->size(200)->generate('T202400001', public_path('qrcode.png'));
        // array(0, 0, 609.4488, 935.433)
        $pdf = Pdf::loadView('pdf.cetakQrcode',[
            'qrcode'=>'qrcode.png',
            'row'=>$row,
            'col'=>$col,
            'row_count'=>6,
            'col_count'=>5,
            ])->setPaper('a4', 'portrait');
        return $pdf->stream();
        // return 'data:application/pdf;base64,' . base64_encode($pdf->stream());

    }

}
