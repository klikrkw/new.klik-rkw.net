<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateDkasbon;
use App\Http\Resources\Admin\DkasbonCollection;
use App\Http\Resources\Admin\DkasbonnopermCollection;
use App\Http\Resources\Admin\KasbonCollection;
use App\Models\Akun;
use App\Models\Anggarankeluarbiayaperm;
use App\Models\Dkasbon;
use App\Models\Dkasbonnoperm;
use App\Models\Instansi;
use App\Models\Itemkegiatan;
use App\Models\Jurnalumum;
use App\Models\Kasbon;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class KasbonStafController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private $base_route = null;
    private $is_admin = null;
    private $user = null;
    private $all_permohonan = false;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->base_route = 'staf.';
            $user = request()->user();
            $this->user = $user;
            $role = $user->hasRole('admin');
            $this->is_admin = false;
            if ($role == 'admin') {
                $this->is_admin = true;
                $this->base_route = 'admin.';
            }
            $permission_name = 'Access All Permohonan - Kasbon';
            $this->all_permohonan = $this->user->hasPermissionTo($permission_name);
            return $next($request);
        });
    }

    public function index()
    {
        $cuser = request()->user();
        $user_id = request('user_id');
        $user = null;
        $kasbons = Kasbon::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $kasbons = $kasbons->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $kasbons = $kasbons->orderBy('id', 'desc');
        }
        if ($this->is_admin) {
            if (request()->has('user_id')) {
                $user_id = request('user_id');
                $user = User::find($user_id);
                $kasbons = $kasbons->where('user_id', request('user_id'));
            }
        } else {
            $kasbons = $kasbons->where('user_id', $cuser->id);
        }
        $kasbons = $kasbons->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Staf/Kasbon/Index', [
            'filters' => Request::all('search'),
            'kasbons' => KasbonCollection::collection($kasbons),
            'isAdmin' => $this->is_admin,
            'user' => $user ? ['value' => $this->user->id, 'label' => $this->user->name] : null,
            'base_route' =>$this->base_route,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $instansis = Instansi::all();
        $xstatus_kasbons = [
            ['value' => 'wait_approval', 'label' => 'Waiting Approval'],
            ['value' => 'approved', 'label' => 'Approved', 'isDisabled'],
            ['value' => 'cancelled', 'label' => 'Cancelled', 'isDisabled'],
            ['value' => 'finish', 'label' => 'finish', 'isDisabled'],
        ];
        $xjenis_kasbons = [
            ['value' => 'permohonan', 'label' => 'Permohonan'],
            ['value' => 'non_permohonan', 'label' => 'Non Permohonan'],
        ];
        $status_kasbons = [];
        $cuser = request()->user();
        $is_admin = $cuser ? $cuser->hasRole('admin') : false;
        if ($is_admin) {
            array_push($status_kasbons, $xstatus_kasbons[0], $xstatus_kasbons[1]);
        } else {
            array_push($status_kasbons, $xstatus_kasbons[0]);
        }
        $msg_users = User::whereHas('roles', function($q){
            $q->where('name','=','staf');
        })->pluck('id');

        return Inertia::render(
            'Staf/Kasbon/Create',
            ['statuskasbonOpts' => $status_kasbons,
            'instansiOpts' => collect($instansis)->map(fn ($o) => ['label' => $o['nama_instansi'], 'value' => $o['id']]),
            'jeniskasbonOpts' => $xjenis_kasbons,
            'isAdmin' => $is_admin,
            'base_route'=>$this->base_route]
        );
    }

    public function create1()
    {
        $instansis = Instansi::all();
        $xstatus_kasbons = [
            ['value' => 'wait_approval', 'label' => 'Waiting Approval'],
            ['value' => 'approved', 'label' => 'Approved', 'isDisabled'],
            ['value' => 'cancelled', 'label' => 'Cancelled', 'isDisabled'],
        ];
        $status_kasbons = [];
        $cuser = request()->user();
        $is_admin = $cuser ? $cuser->hasRole('admin') : false;
        if ($is_admin) {
            array_push($status_kasbons, $xstatus_kasbons[0], $xstatus_kasbons[1]);
        } else {
            array_push($status_kasbons, $xstatus_kasbons[0]);
        }

        return Inertia::render(
            'Staf/Kasbon/Create',
            ['statuskasbonOpts' => $status_kasbons,
            'instansiOpts' => collect($instansis)->map(fn ($o) => ['label' => $o['nama_instansi'], 'value' => $o['id']]),
            'isAdmin' => $is_admin]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            // 'id' => ['required'],
            // 'user_id' => ['required'],
            'user_id' => [Rule::requiredIf(function () {
                return request()->user()->hasRole('admin');
            })],
            'jumlah_kasbon' => ['required', 'numeric', 'min:1'],
            'jumlah_penggunaan' => ['required', 'numeric'],
            'sisa_penggunaan' => ['required', 'numeric'],
            'keperluan' => ['required'],
            'status_kasbon' => ['required'],
            'instansi_id' => ['required'],
        ]);

        $kasbon = Kasbon::create(
            $validated
        );

        //posting jurnalumum
        if ($kasbon->status_kasbon == 'approved') {
            $akunkredit = Akun::getKodeAkun('kas');
            $akundebet = Akun::getKodeAkun('piutang');
            $uraian = 'Kasbon Approved' . $kasbon->user->name . ' - ' . $kasbon->keperluan;
            $parent_id = $kasbon->id;
            $ju1 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akundebet,
                'debet' => $kasbon->jumlah_kasbon,
                'kredit' => 0,
                'parent_id' => $parent_id
            ]);
            $ju2 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akunkredit,
                'debet' => 0,
                'kredit' => $kasbon->jumlah_kasbon,
                'parent_id' => $parent_id
            ]);
            $ids = [$ju1->id, $ju2->id];
            $kasbon->jurnalumums()->attach($ids);
        }

        return to_route('staf.transaksi.kasbons.index')->with('success', 'Kasbon created.');
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
    public function edit(Kasbon $kasbon)
    {
        $statusksb = $kasbon->status_kasbon;
        $instansi = $kasbon->instansi;
        $xstatus_kasbons = [
            ['value' => 'wait_approval', 'label' => 'Waiting Approval'],
            ['value' => 'approved', 'label' => 'Approved', 'isDisabled'],
            ['value' => 'cancelled', 'label' => 'Cancelled', 'isDisabled'],
            ['value' => 'finish', 'label' => 'finish', 'isDisabled'],
        ];
        $status_kasbons = [];
        if ($statusksb == 'wait_approval') {
            array_push($status_kasbons, $xstatus_kasbons[1]);
        } elseif ($statusksb == 'approved' & $kasbon->sisa_penggunaan == $kasbon->jumlah_kasbon) {
            array_push($status_kasbons, $xstatus_kasbons[2]);
        } elseif ($statusksb == 'used' & $kasbon->sisa_penggunaan > 0) {
            array_push($status_kasbons, $xstatus_kasbons[3]);
        }
        $kasbon->user = $kasbon->user;

        $itemkegiatans = Itemkegiatan::where('instansi_id', $instansi->id)
        ->whereHas('grupitemkegiatans', function ($q) {
            $q->whereIn('slug', ['pengeluaran']);
        })->get();

        $dkasbons = Dkasbon::query();
        if($kasbon->jenis_kasbon == 'permohonan'){
        $dkasbons = $dkasbons
            ->select('dkasbons.id', 'nama_penerima', 'nomor_hak', 'persil', 'klas', 'luas_tanah', 'singkatan', 'nama_itemkegiatan', 'jumlah_biaya', 'ket_biaya', 'nama_desa', 'nama_kecamatan')
            ->join('transpermohonans', 'transpermohonans.id', 'dkasbons.transpermohonan_id')
            ->join('itemkegiatans', 'itemkegiatans.id', 'dkasbons.itemkegiatan_id')
            ->join('permohonans', 'permohonans.id', 'transpermohonans.permohonan_id')
            ->join('jenishaks', 'jenishaks.id', 'permohonans.jenishak_id')
            ->join('desas', 'desas.id', 'permohonans.desa_id')
            ->join('kecamatans', 'kecamatans.id', 'desas.kecamatan_id')
            ->where('kasbon_id', $kasbon->id)
            ->orderBy('dkasbons.id', 'asc')
            ->paginate(20);
    }else{
        $dkasbons = Dkasbonnoperm::query();
        $dkasbons = $dkasbons
        ->select('dkasbonnoperms.id', 'nama_itemkegiatan', 'jumlah_biaya', 'ket_biaya')
        ->join('itemkegiatans', 'itemkegiatans.id', 'dkasbonnoperms.itemkegiatan_id')
        ->where('kasbon_id', $kasbon->id)
        ->orderBy('dkasbonnoperms.id', 'asc')
        ->paginate(20);
    }

        return Inertia::render('Staf/Kasbon/Edit', [
            'kasbon' => new KasbonCollection($kasbon),
            'instansi' => $instansi,
            'statuskasbonOpts' => $status_kasbons,
            'statuskasbonOpt' => null,
            'itemkegiatanOpts' => collect($itemkegiatans)->map(fn ($o) => ['label' => $o['nama_itemkegiatan'], 'value' => $o['id']]),
            'is_admin' => $this->is_admin,
            'base_route' => $this->base_route,
            'allPermohonan' =>$this->all_permohonan,
            'dkasbons' => $kasbon->jenis_kasbon == 'permohonan'?DkasbonCollection::collection($dkasbons):DkasbonnopermCollection::collection($dkasbons),
            // 'statuskasbonOpt' => collect($status_kasbons)->filter(function ($v) use ($kasbon) {
            // return $v['value'] == $kasbon->status_kasbon;
            // })->first(),
        ]);
    }

    public function edit1(Kasbon $kasbon)
    {
        $instansi = $kasbon->instansi;
        $statusksb = $kasbon->status_kasbon;
        $xstatus_kasbons = [
            ['value' => 'wait_approval', 'label' => 'Waiting Approval'],
            ['value' => 'approved', 'label' => 'Approved', 'isDisabled'],
            ['value' => 'cancelled', 'label' => 'Cancelled', 'isDisabled'],
        ];
        $status_kasbons = [];
        if ($statusksb == 'wait_approval') {
            array_push($status_kasbons, $xstatus_kasbons[1]);
        } elseif ($statusksb == 'approved' & $kasbon->sisa_penggunaan == $kasbon->jumlah_kasbon) {
            array_push($status_kasbons, $xstatus_kasbons[2]);
        }
        $kasbon->user = $kasbon->user;
        return Inertia::render('Staf/Kasbon/Edit', [
            'kasbon' => $kasbon,
            'instansi' => $instansi,
            'statuskasbonOpts' => $status_kasbons,
            'statuskasbonOpt' => null,
            // 'statuskasbonOpt' => collect($status_kasbons)->filter(function ($v) use ($kasbon) {
            // return $v['value'] == $kasbon->status_kasbon;
            // })->first(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDkasbon $request, Kasbon $kasbon)
    {
        $jmlbiaya = 0;
        if($kasbon->jenis_kasbon =='permohonan'){
            $dkasbon = $kasbon->dkasbons()->create($request->validated());
            $jmlbiaya = $kasbon->dkasbons->sum('jumlah_biaya');
        }else{
            $dkasbon = $kasbon->dkasbonnoperms()->create($request->validated());
            $jmlbiaya = $kasbon->dkasbonnoperms->sum('jumlah_biaya');
        }
        $kasbon->update(
            [
                // 'saldo_awal' => 0,
                'jumlah_kasbon' => $jmlbiaya,
                // 'jumlah_penggunaan' => 0,
                'sisa_penggunaan' => $kasbon->sisa_penggunaan + $request['jumlah_biaya'],
            ]
        );
        return to_route($this->base_route . 'transaksi.kasbons.edit', $kasbon->id)->with('success', 'Kasbon updated.');
    }

    public function update1(Request $request, Kasbon $kasbon)
    {
        $validated =  request()->validate([
            // 'id' => ['required'],
            'jumlah_kasbon' => ['required', 'numeric'],
            'jumlah_penggunaan' => ['required', 'numeric'],
            'sisa_penggunaan' => ['required', 'numeric'],
            'keperluan' => ['required'],
            'status_kasbon' => ['required'],
        ]);

        $kasbon->update($validated);
        //posting jurnalumum
        if ($kasbon->status_kasbon == 'approved') {
            $akunkredit = Akun::getKodeAkun('kas');
            $akundebet = Akun::getKodeAkun('piutang');
            $uraian = 'Kasbon Approved, ' . $kasbon->user->name . ' - ' . $kasbon->keperluan;
            $parent_id = $kasbon->id;
            $ju1 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akundebet,
                'debet' => $kasbon->jumlah_kasbon,
                'kredit' => 0,
                'parent_id' => $parent_id
            ]);
            $ju2 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akunkredit,
                'debet' => 0,
                'kredit' => $kasbon->jumlah_kasbon,
                'parent_id' => $parent_id
            ]);
            $ids = [$ju1->id, $ju2->id];
            $kasbon->jurnalumums()->attach($ids);
        } elseif ($kasbon->status_kasbon == 'cancelled') {
            $akundebet = Akun::getKodeAkun('kas');
            $akunkredit = Akun::getKodeAkun('piutang');
            $uraian = 'Kasbon Cancelled, ' . $kasbon->user->name . ' - ' . $kasbon->keperluan;
            $parent_id = $kasbon->id;
            $ju1 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akundebet,
                'debet' => $kasbon->jumlah_kasbon,
                'kredit' => 0,
                'parent_id' => $parent_id
            ]);
            $ju2 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => $akunkredit,
                'debet' => 0,
                'kredit' => $kasbon->jumlah_kasbon,
                'parent_id' => $parent_id
            ]);
            $ids = [$ju1->id, $ju2->id];
            $kasbon->jurnalumums()->attach($ids);
        }


        return to_route('staf.transaksi.kasbons.index')->with('success', 'Kasbon Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kasbon $kasbon)
    {
        $kasbon->delete();
        return Redirect::back()->with('success', 'Kasbon deleted.');
    }

    private function toArray($rec): array
    {
        $nohak = $rec->singkatan == 'C' ? $rec->nomor_hak . ', Ps.' . $rec->persil . ', ' . $rec->klas : $rec->nomor_hak;
        return [
            'id' => $rec->id,
            'permohonan' => sprintf(
                '%s,%s.%s, L.%sM2, Ds.%s - %s',
                $rec->nama_penerima,
                $rec->singkatan,
                $nohak,
                $rec->luas_tanah,
                $rec->nama_desa,
                $rec->nama_kecamatan,
            ),
            'nama_itemkegiatan' => $rec->nama_itemkegiatan,
            'jumlah_biaya' => number_format($rec->jumlah_biaya),
            'ket_biaya' => $rec->ket_biaya,
        ];
    }

    public function lapKasbon(Kasbon $kasbon)
    {

        $kasbon->tanggal = Carbon::parse($kasbon->created_at)->format('d M Y');
        $kasbon->user = $kasbon->user;
        $kasbon->instansi = $kasbon->instansi;
        $tanggal = Carbon::now()->format('d M Y');
        $anggarankeluarbiayaperms = Anggarankeluarbiayaperm::query();
        $anggarankeluarbiayaperms = $anggarankeluarbiayaperms
            ->select('anggarankeluarbiayaperms.id', 'nama_penerima', 'nomor_hak', 'persil', 'klas', 'luas_tanah', 'singkatan', 'nama_itemkegiatan', 'jumlah_biaya', 'ket_biaya', 'nama_desa', 'nama_kecamatan')
            ->join('transpermohonans', 'transpermohonans.id', 'anggarankeluarbiayaperms.transpermohonan_id')
            ->join('itemkegiatans', 'itemkegiatans.id', 'anggarankeluarbiayaperms.itemkegiatan_id')
            ->join('permohonans', 'permohonans.id', 'transpermohonans.permohonan_id')
            ->join('jenishaks', 'jenishaks.id', 'permohonans.jenishak_id')
            ->join('desas', 'desas.id', 'permohonans.desa_id')
            ->join('kecamatans', 'kecamatans.id', 'desas.kecamatan_id')
            ->where('kasbon_id', $kasbon->id)
            ->orderBy('anggarankeluarbiayaperms.id', 'asc')
            ->take(100)->skip(0)->get();
            $anggarankeluarbiayaperms = collect($anggarankeluarbiayaperms)->map(function($rec){
                return $this->toArray($rec);
            });
        $data = [
            'judul_lap' => 'KASBON',
            'kasbon' => $kasbon,
            'tanggal' => $tanggal,
            'anggarankeluarbiayaperms'=>$anggarankeluarbiayaperms,
        ];
        $pdf = Pdf::loadView('pdf.lapKasbon', $data)->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
        // return view('pdf.lapKeluarbiayauser', compact('judul_lap', 'subjudul_lap'));
        // return $pdf->stream('lapKeluarbiayauser.pdf');
        return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
    }
    public function lapKasbonStaf(Kasbon $kasbon)
    {
        $kasbon->tanggal = Carbon::parse($kasbon->created_at)->format('d M Y');
        $kasbon->instansi = $kasbon->instansi;
        $kasbon->user = $kasbon->user;
        $data =[];
        $filelap='pdf.lapKasbonstaf';
        if($kasbon->jenis_kasbon == 'permohonan'){
        $dkasbons = Dkasbon::query();
        $dkasbons = $dkasbons
            ->select('dkasbons.id', 'nama_penerima', 'nomor_hak', 'persil', 'klas', 'luas_tanah', 'singkatan', 'nama_itemkegiatan', 'jumlah_biaya', 'ket_biaya', 'nama_desa', 'nama_kecamatan')
            ->join('transpermohonans', 'transpermohonans.id', 'dkasbons.transpermohonan_id')
            ->join('itemkegiatans', 'itemkegiatans.id', 'dkasbons.itemkegiatan_id')
            ->join('permohonans', 'permohonans.id', 'transpermohonans.permohonan_id')
            ->join('jenishaks', 'jenishaks.id', 'permohonans.jenishak_id')
            ->join('desas', 'desas.id', 'permohonans.desa_id')
            ->join('kecamatans', 'kecamatans.id', 'desas.kecamatan_id')
            ->where('kasbon_id', $kasbon->id)
            ->orderBy('dkasbons.id', 'asc')
            ->take(100)->skip(0)->get();
        $dkasbons = collect($dkasbons)->map((function ($item, $i) {
            $nohak = $item['singkatan'] == 'C' ? $item['nomor_hak'] . ', Ps.' . $item['persil'] . ', ' . $item['klas'] : $item['nomor_hak'];
            return [
                'nourut' => ($i + 1) . '.',
                'id' => $item['id'],
                'permohonan' => sprintf(
                    '%s,%s.%s, L.%sM2, Ds.%s - %s',
                    $item['nama_penerima'],
                    $item['singkatan'],
                    $nohak,
                    $item['luas_tanah'],
                    $item['nama_desa'],
                    $item['nama_kecamatan'],
                ),
                'nama_itemkegiatan' => $item['nama_itemkegiatan'],
                'jumlah_biaya' => number_format($item['jumlah_biaya']),
                'ket_biaya' => $item['ket_biaya'],
            ];
        }));
        $tanggal = Carbon::now()->format('d M Y');
        $data = [
            'judul_lap' => 'KASBON PENGELUARAN BIAYA',
            'kasbon' => $kasbon,
            'dkasbons' => $dkasbons,
            'tanggal' => $tanggal,
        ];
    }else{
        $filelap='pdf.lapKasbonnopermstaf';
        $dkasbons = Dkasbonnoperm::query();
        $dkasbons = $dkasbons
            ->select('dkasbonnoperms.id', 'nama_itemkegiatan', 'jumlah_biaya', 'ket_biaya')
            ->join('itemkegiatans', 'itemkegiatans.id', 'dkasbonnoperms.itemkegiatan_id')
            ->where('kasbon_id', $kasbon->id)
            ->orderBy('dkasbonnoperms.id', 'asc')
            ->take(100)->skip(0)->get();
        $dkasbons = collect($dkasbons)->map((function ($item, $i) {
            return [
                'nourut' => ($i + 1) . '.',
                'id' => $item['id'],
                'nama_itemkegiatan' => $item['nama_itemkegiatan'],
                'jumlah_biaya' => number_format($item['jumlah_biaya']),
                'ket_biaya' => $item['ket_biaya'],
            ];
        }));
        $tanggal = Carbon::now()->format('d M Y');
        $data = [
            'judul_lap' => 'KASBON PENGELUARAN BIAYA',
            'kasbon' => $kasbon,
            'dkasbons' => $dkasbons,
            'tanggal' => $tanggal,
        ];

    }
        $pdf = Pdf::loadView($filelap, $data)->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
        // return view('pdf.lapKeluarbiayauser', compact('judul_lap', 'subjudul_lap'));
        // return $pdf->stream('lapKeluarbiayauser.pdf');
        return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
    }

}
