<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\DrincianbiayapermCollection;
use App\Http\Resources\Admin\PermohonanCollection;
use App\Http\Resources\Admin\PermohonanListResource;
use App\Http\Resources\Admin\RincianbiayapermCollection;
use App\Http\Resources\Admin\RincianbiayapermDetailCollection;
use App\Models\Biayaperm;
use App\Models\Drincianbiayaperm;
use App\Models\Itemrincianbiayaperm;
use App\Models\Metodebayar;
use App\Models\Permohonan;
use App\Models\Rekening;
use App\Models\Rincianbiayaperm;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Traits\FirebaseTrait;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class RincianbiayapermController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use FirebaseTrait;
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
            $permission_name = 'Access All Permohonan - Rincian Biaya Permohonan';
            $this->all_permohonan = $this->user->hasPermissionTo($permission_name);

            return $next($request);
        });
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cuser = request()->user();
        $user_id = request('user_id');
        $rincianbiayaperms = Rincianbiayaperm::query();
        $rincianbiayaperms = $rincianbiayaperms
        ->select('rincianbiayaperms.*', 'nama_penerima', 'nomor_hak', 'persil', 'klas', 'luas_tanah', 'singkatan',  'nama_desa', 'nama_kecamatan','nama_jenispermohonan')
        ->selectRaw('concat(transpermohonans.nodaftar_transpermohonan,"/",transpermohonans.thdaftar_transpermohonan) as no_daftar')
        ->join('transpermohonans','transpermohonans.id','rincianbiayaperms.transpermohonan_id')
        ->join('jenispermohonans','jenispermohonans.id','transpermohonans.jenispermohonan_id')
        ->join('permohonans','permohonans.id','transpermohonans.permohonan_id')
        ->join('jenishaks', 'jenishaks.id', 'permohonans.jenishak_id')
        ->join('desas','desas.id','permohonans.desa_id')
        ->join('kecamatans','kecamatans.id','desas.kecamatan_id');

        if (request()->has(['sortBy', 'sortDir'])) {
            $rincianbiayaperms = $rincianbiayaperms->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $rincianbiayaperms = $rincianbiayaperms->orderBy('id', 'desc');
        }
        if ($this->is_admin) {
            if (request()->has('user_id')) {
                $user_id = request('user_id');
                $this->user = User::find($user_id);
                $rincianbiayaperms = $rincianbiayaperms->where('user_id', request('user_id'));
            }
        } else {
            $rincianbiayaperms = $rincianbiayaperms->where('user_id', $cuser->id);
        }
        $rincianbiayaperms = $rincianbiayaperms->filter(Request::only('search','status'))
            ->paginate(10)
            ->appends(Request::all());
            $xstatus = [
                ['value' => 'wait_approval', 'label' => 'Waiting Approval'],
                ['value' => 'approved', 'label' => 'Approved', 'isDisabled'],
                ['value' => 'cancelled', 'label' => 'Cancelled', 'isDisabled'],
                ['value' => 'finish', 'label' => 'finish', 'isDisabled'],
                ];
            $curstatus = request('status','');
        return Inertia::render('Admin/Rincianbiayaperm/Index', [
            'filters' => Request::all('search'),
            'rincianbiayaperms' => RincianbiayapermCollection::collection($rincianbiayaperms),
            'isAdmin' => $this->is_admin,
            'user' => ['value' => $this->user->id, 'label' => $this->user->name],
            'base_route' => $this->base_route,
            'statusOpts' => $xstatus,
            'curstatus' => $curstatus,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $metodebayars = Metodebayar::all();
        $rekenings = Rekening::all();
        $itemrincianbiayaperms = Itemrincianbiayaperm::all();
        $cuser = request()->user();
        $is_admin = $cuser ? $cuser->hasRole('admin') : false;
        $permohonan_id = request('permohonan_id');
        $transpermohonan_id = request()->get('transpermohonan_id');
        $transpermohonanOpt=null;
        $permohonan = Permohonan::query();
        $res_permohonan = null;
        $transpermohonanOpts = [];
        if($permohonan_id){
            $permohonan = Permohonan::find($permohonan_id);
            if($permohonan){
                $res_permohonan = new PermohonanCollection($permohonan);
                $transpermohonanOpts  = collect($permohonan->transpermohonans)->map(function ($item) {
                    return ['value' => $item['id'], 'label' => $item['jenispermohonan']['nama_jenispermohonan']];
                });
                $transpermohonanOpt = $transpermohonanOpts->filter(function($item) use($transpermohonan_id){
                    return $item['value'] === $transpermohonan_id;
                })->first();
            }
        }

        return Inertia::render(
            'Admin/Rincianbiayaperm/Create',
            [
            'itemrincianbiayapermOpts' => collect($itemrincianbiayaperms)->map(fn ($o) => ['label' => $o['nama_instansi'], 'value' => $o['id']]),
            'base_route' => $this->base_route,
            'metodebayarOpts' => collect($metodebayars)->map(fn ($o) => ['label' => $o['nama_metodebayar'], 'value' => $o['id']]),
            'rekeningOpts' => collect($rekenings)->map(fn ($o) => ['label' => $o['nama_rekening'], 'value' => $o['id']]),
            'transpermohonanOpts' => $transpermohonanOpts,
            'transpermohonanOpt' => $transpermohonanOpt,
            'permohonan' => $res_permohonan,
            'permohonan_id' => $permohonan_id,
            'transpermohonan_id' => $transpermohonan_id,
            'isAdmin' => $this->is_admin,
            'allPermohonan' =>$this->all_permohonan,
        ],
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
            'total_pemasukan' => ['required', 'numeric'],
            'total_pengeluaran' => ['required', 'numeric'],
            'sisa_saldo' => ['required', 'numeric'],
            'ket_rincianbiayaperm' => ['nullable'],
            // 'status_rincianbiayaperm' => ['required'],
            'transpermohonan_id' => ['required'],
            'metodebayar_id' => ['required'],
            'rekening_id' => ['required'],
        ]);

        $rincianbiayaperm = Rincianbiayaperm::create(
            $validated
        );

        // }

        //send firebase message to mobile
        // $this->sendMessageToMobile('Rincianbiayaperm Baru','rincianbiayaperm baru ditambahkan','admin');

        return to_route('admin.transaksi.rincianbiayaperms.edit', $rincianbiayaperm->id)->with('success', 'Rincianbiayaperm created.');
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
    public function edit(Rincianbiayaperm $rincianbiayaperm)
    {
        $itemrincianbiayaperms = Itemrincianbiayaperm::all();

        $rincianbiayaperm->user = $rincianbiayaperm->user;
        $rincianbiayaperm->metodebayar = $rincianbiayaperm->metodebayar;
        $rincianbiayaperm->transpermohonan = $rincianbiayaperm->transpermohonan;
        $rincianbiayaperm->transpermohonan->jenispermohonan = $rincianbiayaperm->transpermohonan->jenispermohonan;
        $permohonan = PermohonanListResource::collection([$rincianbiayaperm->transpermohonan->permohonan]);
        $drincianbiayaperms = Drincianbiayaperm::query();
        $drincianbiayaperms = $drincianbiayaperms->with('itemrincianbiayaperm')->where('rincianbiayaperm_id',$rincianbiayaperm->id)->paginate(20)->appends(Request::all());

        return Inertia::render('Admin/Rincianbiayaperm/Edit', [
            'rincianbiayaperm' => $rincianbiayaperm,
            'itemrincianbiayapermOpts' => collect($itemrincianbiayaperms)->map(fn ($o) => ['label' => $o['nama_itemrincianbiayaperm'], 'value' => $o['id'],'jenis_itemrincianbiayaperm'=>$o['jenis_itemrincianbiayaperm']]),
            'base_route' => $this->base_route,
            'isAdmin' => $this->is_admin,
            'permohonan' => count($permohonan)>0?$permohonan[0]:null,
            'drincianbiayaperms' => DrincianbiayapermCollection::collection($drincianbiayaperms),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rincianbiayaperm $rincianbiayaperm)
    {

        $validated =  request()->validate([
            'rincianbiayaperm_id' => ['required'],
            'itemrincianbiayaperm_id' => ['required'],
            'jumlah_biaya' => ['required', 'numeric','min:1'],
            'ket_biaya' => ['nullable'],
        ]);
        // update 'total_pemasukan', 'total_pengeluaran', 'sisa_saldo'
        Drincianbiayaperm::create($validated);
        $total_pemasukan = $rincianbiayaperm->drincianbiayaperms()->whereRelation('itemrincianbiayaperm', 'jenis_itemrincianbiayaperm', 'pemasukan')->sum('jumlah_biaya');
        $total_pengeluaran = $rincianbiayaperm->drincianbiayaperms()->whereRelation('itemrincianbiayaperm', 'jenis_itemrincianbiayaperm', 'pengeluaran')->sum('jumlah_biaya');
        $total_piutang = $rincianbiayaperm->drincianbiayaperms()->whereRelation('itemrincianbiayaperm', 'jenis_itemrincianbiayaperm', 'piutang')->sum('jumlah_biaya');
        $sisa_saldo = $total_pemasukan - $total_pengeluaran - $total_piutang;
        $rincianbiayaperm->update(['total_pemasukan'=>$total_pemasukan, 'total_pengeluaran'=>$total_pengeluaran,'total_piutang'=>$total_piutang, 'sisa_saldo'=>$sisa_saldo]);
         return to_route('admin.transaksi.rincianbiayaperms.edit',$rincianbiayaperm->id)->with('success', 'Rincianbiayaperm Added');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroyDrincianbiayaperm(Drincianbiayaperm $drincianbiayaperm)
    {
        $rincianbiayaperm = $drincianbiayaperm->rincianbiayaperm;
        $drincianbiayaperm->delete();
        $total_pemasukan = $rincianbiayaperm->drincianbiayaperms()->whereRelation('itemrincianbiayaperm', 'jenis_itemrincianbiayaperm', 'pemasukan')->sum('jumlah_biaya');
        $total_pengeluaran = $rincianbiayaperm->drincianbiayaperms()->whereRelation('itemrincianbiayaperm', 'jenis_itemrincianbiayaperm', 'pengeluaran')->sum('jumlah_biaya');
        $total_piutang = $rincianbiayaperm->drincianbiayaperms()->whereRelation('itemrincianbiayaperm', 'jenis_itemrincianbiayaperm', 'piutang')->sum('jumlah_biaya');
        $sisa_saldo = $total_pemasukan - $total_pengeluaran - $total_piutang;
        $rincianbiayaperm->update(['total_pemasukan'=>$total_pemasukan, 'total_pengeluaran'=>$total_pengeluaran,'total_piutang'=>$total_piutang, 'sisa_saldo'=>$sisa_saldo]);
        return Redirect::back()->with('success', 'Jenis Permohonan deleted.');
    }
    private function toArray($rec): array
    {
        $nohak = $rec->singkatan == 'C' ? $rec->nomor_hak . ', Ps.' . $rec->persil . ', ' . $rec->klas : $rec->nomor_hak;
        return [
            'id' => $rec->id,
            'permohonan' => sprintf(
                '%s, %s, %s.%s, L.%sM2, Ds.%s - %s',
                $rec->nama_penerima,
                $rec->nama_jenispermohonan,
                $rec->singkatan,
                $nohak,
                $rec->luas_tanah,
                $rec->nama_desa,
                $rec->nama_kecamatan,
            ),
            'user' => $rec->user,
            'tanggal' => Carbon::parse($rec->created_at)->format('d M Y'),
            'total_pemasukan' => number_format($rec->total_pemasukan),
            'total_pengeluaran' => number_format($rec->total_pengeluaran),
            'total_piutang' => number_format($rec->total_piutang),
            'sisa_saldo' => number_format($rec->sisa_saldo),
            'ket_rincianbiayaperm' => $rec->ket_rincianbiayaperm,
        ];
    }

    public function lapRincianbiayaperm(Rincianbiayaperm $rincianbiayaperm)
    {

        $rincianbiayaperm->tanggal = Carbon::parse($rincianbiayaperm->created_at)->format('d M Y');
        $tanggal = Carbon::now()->format('d M Y');
        $rincianbiayaperms = Rincianbiayaperm::query();
        $rincianbiayaperms = $rincianbiayaperms
        ->select('rincianbiayaperms.*', 'nama_penerima', 'nomor_hak', 'persil', 'klas', 'luas_tanah', 'singkatan',  'nama_desa', 'nama_kecamatan','nama_jenispermohonan')
        ->join('transpermohonans','transpermohonans.id','rincianbiayaperms.transpermohonan_id')
        ->join('jenispermohonans','jenispermohonans.id','transpermohonans.jenispermohonan_id')
        ->join('permohonans','permohonans.id','transpermohonans.permohonan_id')
        ->join('jenishaks', 'jenishaks.id', 'permohonans.jenishak_id')
        ->join('desas','desas.id','permohonans.desa_id')
        ->join('kecamatans','kecamatans.id','desas.kecamatan_id')
            ->where('rincianbiayaperms.id', $rincianbiayaperm->id)
            ->orderBy('rincianbiayaperms.id', 'asc')
            ->take(1)->skip(0)->first();
        $rincianbiayaperms = $this->toArray($rincianbiayaperms);

        $drincianbiayaperms = Drincianbiayaperm::query();
        $drincianbiayaperms = $drincianbiayaperms->with('itemrincianbiayaperm')->where('rincianbiayaperm_id',$rincianbiayaperm->id)->paginate(20)->appends(Request::all());

        $data = [
            'judul_lap' => 'RINCIAN BIAYA PERMOHONAN',
            'tanggal' => $tanggal,
            'rincianbiayaperm'=>$rincianbiayaperms,
            'drincianbiayaperms' => $drincianbiayaperms,
        ];
        $pdf = Pdf::loadView('pdf.lapRincianbiayaperm', $data)->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
        // return view('pdf.lapKeluarbiayauser', compact('judul_lap', 'subjudul_lap'));
        // return $pdf->stream('lapKeluarbiayauser.pdf');
        return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
    }
    public function list()
    {
        $biayaperm_id = request('biayaperm_id');
        $rincianbiayaperms = [];
        $biayaperm = Biayaperm::find($biayaperm_id);
        if($biayaperm){
            $rincianbiayaperms = $biayaperm->rincianbiayaperms;
        }
        return RincianbiayapermDetailCollection::collection($rincianbiayaperms);
    }

    public function destroy(Rincianbiayaperm $rincianbiayaperm)
    {
        if($rincianbiayaperm->status_rincianbiayaperm === 'wait_approval'){
            $rincianbiayaperm->delete();
            return Redirect::back()->with('success', 'Rincian Biaya deleted.');
        }else{
            return Redirect::back()->with('error', 'Rincian Biaya tidak bisa dihapus.');
        }
    }

}
