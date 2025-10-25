<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\BiayapermCollection;
use App\Http\Resources\Admin\BiayapermStatusCollection;
use App\Http\Resources\Admin\PermohonanCollection;
use App\Models\Akun;
use App\Models\Bayarbiayaperm;
use App\Models\Biayaperm;
use App\Models\Instansi;
use App\Models\Itemkegiatan;
use App\Models\Jurnalumum;
use App\Models\Keluarbiayaperm;
use App\Models\Metodebayar;
use App\Models\Permohonan;
use App\Models\Prosespermohonan;
use App\Models\Rekening;
use App\Models\Rincianbiayaperm;
use App\Models\Transpermohonan;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Closure;
use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;

class BiayapermController extends Controller
{
    /**
     * Display a listing of the resource.
     * Access All Permohonan - Biaya Permohonan
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
            $permission_name = 'Access All Permohonan - Biaya Permohonan';
            $this->all_permohonan = $this->user->hasPermissionTo($permission_name);
            return $next($request);
        });
    }

    public function index()
    {
        $transpermohonan_id = request('transpermohonan_id') ? request('transpermohonan_id') : null;
        $transpermohonan = Transpermohonan::find(request()->get('transpermohonan_id'));
        $permohonan = null;
        if ($transpermohonan) {
            $permohonan = $transpermohonan->permohonan;
        }
        $biayaperms = Prosespermohonan::query();
        $biayaperms = $biayaperms
            ->with('statusprosesperms', function ($q) {
                $q->where('active', true);
            })
            ->with('transpermohonan.jenispermohonan')
            ->with('transpermohonan.permohonan', function ($query) {
                $query->select('id', 'nama_pelepas', 'nama_penerima', 'atas_nama', 'jenishak_id', 'desa_id', 'nomor_hak', 'persil', 'klas', 'luas_tanah')
                    ->with('users:id,name', 'jenishak')
                    ->with('desa', function ($query) {
                        $query->select('id', 'nama_desa', 'kecamatan_id')->with('kecamatan:id,nama_kecamatan');
                    });
            });
        $biayaperms = $biayaperms->filter(Request::only('transpermohonan_id'));
        $biayaperms = $biayaperms->orderBy('id', 'desc')->paginate(10)->appends(request()->all());
        return Inertia::render('Admin/Biayaperm/Index', [
            'biayaperms' => $biayaperms,
            'permohonan' => $permohonan,
            'transpermohonan_id' => $transpermohonan_id,
            // 'transpermohonan' => Inertia::lazy(fn () => $transpermohonan),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permohonan = null;
        $biayaperms = [];
        $transpermohonan_id = request()->get('transpermohonan_id', null);
        $permohonan_id = request()->get('permohonan_id', null);
        $transpermohonan = null;
        $transpermohonanopt = null;
        $biayaperm = null;
        $metodebayars = Metodebayar::all();
        $itemkegiatans = [];
        $rincianbiayaperms =[];
        $instansis = Instansi::all();
        $rekenings = Rekening::all();

        if (request()->has('permohonan_id')) {
            $rec = Permohonan::with('users')->find(request()->get('permohonan_id'));

            if ($rec) {
                $permohonan = new PermohonanCollection($rec);
                if (count($rec->transpermohonans) > 0 && $transpermohonan_id == null) {
                    $transpermohonan_id = $rec->transpermohonans[0]->id;
                }
                $recs = Biayaperm::query();
                $recs = $recs->with('user')
                    ->where('transpermohonan_id', $transpermohonan_id);
                $recs = $recs->skip(0)->take(20)->get();

                if (count($recs) > 0) {
                    $biayaperms = BiayapermCollection::collection($recs);
                }

                $transpermohonan = Transpermohonan::with('permohonan')->find($transpermohonan_id);
                if ($transpermohonan) {
                    $transpermohonanopt = ['value' => $transpermohonan->id, 'label' => $transpermohonan->jenispermohonan->nama_jenispermohonan];
                    $itemkegiatans = Itemkegiatan::whereHas('grupitemkegiatans', function ($q) {
                        $q->whereIn('slug', ['pengeluaran']);
                    })->get();
                }
            }
            if (request()->has('biayaperm_id')) {
                $biayaperm = Biayaperm::with('transpermohonan')->find(request('biayaperm_id'));
            }
            $rincianbiayaperms = $transpermohonan->waitapproval_rincianbiayaperms;
        }
        // $biayaperms = collect($biayaperms)->map(function ($prosesperm) {
        //     $prosesperm->statusbiayaperms->each(fn ($s) => $s->user = User::find($s->pivot->user_id));
        //     return $prosesperm;
        // });
        return Inertia::render('Admin/Biayaperm/Create', [
            'permohonan' => $permohonan,
            'transpermohonans' => $permohonan ? collect($permohonan->transpermohonans)->map(function ($item) {
                return ['value' => $item['id'], 'label' => $item['jenispermohonan']['nama_jenispermohonan']];
            }) : [],
            'biayaperms' => $biayaperms,
            'transpermohonan' => $transpermohonan,
            'transpermohonanopt' => $transpermohonanopt,
            'permohonan_id' => $permohonan_id,
            'transpermohonan_id' => $transpermohonan_id,
            'biayaperm' => $biayaperm,
            'itemkegiatansOpts' => collect($itemkegiatans)->map(function ($item) {
                return ['value' => $item['id'], 'label' => $item['nama_itemkegiatan']];
            }),
            'metodebayars' => collect($metodebayars)->map(function ($item) {
                return ['value' => $item['id'], 'label' => $item['nama_metodebayar']];
            }),
            'rekenings' => collect($rekenings)->map(function ($item) {
                return ['value' => $item['id'], 'label' => $item['nama_rekening']];
            }),
            'rincianbiayapermOpts' => collect($rincianbiayaperms)->map(function ($item) {
                return ['value' => $item['id'], 'label' => sprintf('%s - %s',$item['id'],$item['ket_rincianbiayaperm']),'rincianbiayaperm'=>$item];
            }),
            'instansiOpts' => collect($instansis)->map(fn ($o) => ['label' => $o['nama_instansi'], 'value' => $o['id']]),
            'base_route'=>'admin.',
            'allPermohonan' =>$this->all_permohonan,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'transpermohonan_id' => ['required'],
            'jumlah_biayaperm' => ['required', 'numeric', 'min:0'],
            'jumlah_bayar' => ['required', 'numeric', 'min:0'],
            'kurang_bayar' => ['required', 'numeric', 'min:0'],
            'catatan_biayaperm' => ['nullable'],
            'image_biayaperm' => ['nullable'],
            'rincianbiayaperm_id' => ['nullable'],
            'info_rekening' =>'nullable',
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
                    $akun_kas = $rincianbiayaperm->rekening->akun_id;
                }
            $validated =  [
                'biayaperm_id' => $biayaperm->id,
                'saldo_awal' => $validated['jumlah_biayaperm'],
                'jumlah_bayar' =>  $validated['jumlah_bayar'],
                'saldo_akhir' => $validated['kurang_bayar'],
                'metodebayar_id' => $rincianbiayaperm->metodebayar_id,
                'info_rekening' => '',
                'rekening_id' => $rincianbiayaperm->rekening_id,
            //     'rekening_id' => ['required',  function (string $attribute, mixed $value, Closure $fail) {
            //     $rek = Rekening::find($value);
            //     if($rek){
            //         if($rek->metodebayar_id != request('metodebayar_id'))
            //         $fail("Rekening tidak sesuai metode bayar");
            //     }
            // }],
                'catatan_bayarbiayaperm' => $validated['catatan_biayaperm'],
                'image_bayarbiayaperm' => null,
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
            $ids=[];
            if($biayaperm->jumlah_bayar>0){
                $ju1 = Jurnalumum::create([
                'uraian' => $uraian,
                'akun_id' => Akun::getKodeAkun('kas'),
                'debet' => $biayaperm->jumlah_bayar,
                'kredit' => 0,
                'parent_id' => $parent_id
            ]);
            array_push($ids, $ju1->id);
        }
            if($biayaperm->kurang_bayar>0){
                $ju1 = Jurnalumum::create([
                    'uraian' => $uraian,
                    'akun_id' => $akun_piutang,
                    'debet' => $biayaperm->kurang_bayar,
                    'kredit' => 0,
                    'parent_id' => $parent_id
                ]);
                array_push($ids, $ju1->id);
            }
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

        return redirect()->back()->with('success', 'Biaya permohonan created.');
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
    public function update(Biayaperm $biayaperm)
    {
        $validated =  request()->validate([
            'transpermohonan_id' => ['required'],
            'jumlah_biayaperm' => ['required', 'numeric', 'min:0'],
            'jumlah_bayar' => ['required', 'numeric', 'min:0'],
            'kurang_bayar' => ['required', 'numeric', 'min:0'],
            'catatan_biayaperm' => ['required'],
            'image_biayaperm' => ['nullable']
        ]);

        $biayaperm->update(
            $validated
        );
        $recs = $biayaperm->jurnalumums;
        $akundebet = Akun::getKodeAkun('piutang');
        $akunkredit = Akun::getKodeAkun('pendapatan-operasional');
        if(count($recs) == 2){
            $rec = $recs[0];
            if($rec->jurnalumum_id == $akundebet){
                $rec->update(['debet'=>$biayaperm->kurang_bayar]);
            }else{
                $rec->update(['debet'=>$biayaperm->jumlah_biayaperm]);
            }
            $rec = $recs[1];
            if($rec->jurnalumum_id == $akunkredit){
                $rec->update(['kredit'=>$biayaperm->jumlah_biayaperm]);
            }else{
                $rec->update(['kredit'=>$biayaperm->kurang_bayar]);
            }
        }

        return redirect()->back()->with('success', 'Biaya permohonan updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Biayaperm $biayaperm)
    {
        $rec_biayaperm = Bayarbiayaperm::where('biayaperm_id', $biayaperm->id)->first();
        if ($rec_biayaperm) {
            return Redirect::back()->with('error', 'Biaya Permohonan tidak bisa dihapus.');
        }
        $jurnalumums = $biayaperm->jurnalumums;
        for ($i = 0; $i < count($jurnalumums); $i++) {
            $rec = $jurnalumums[$i];
            $rec->delete();
        }

        $biayaperm->delete();
        return Redirect::back()->with('success', 'Biaya Permohonan deleted.');
    }
    public function toPrint($biayaperms){
        $items =[];
        for ($i=0; $i < count($biayaperms) ; $i++) {
            $biayaperm = $biayaperms[$i];
            $nohak = $biayaperm->singkatan == 'C' ? $biayaperm->nomor_hak . ', Ps.' . $biayaperm->persil . ', ' . $biayaperm->klas : $biayaperm->nomor_hak;
            $permohonan = sprintf(
                            '%s,%s.%s, L.%sM2, Ds.%s - %s',
                            $biayaperm->nama_penerima,
                            $biayaperm->singkatan,
                            $nohak,
                            $biayaperm->luas_tanah,
                            $biayaperm->nama_desa,
                            $biayaperm->nama_kecamatan,
            );
            $users = collect($biayaperm->transpermohonan->permohonan->users)->pluck('name')->toArray();
            $item = [
                'id' => $biayaperm->id,
                'tgl_biayaperm' => Carbon::parse($biayaperm->updated_at)->format('d M Y'),
                'jumlah_biayaperm' => number_format($biayaperm->jumlah_biayaperm),
                'jumlah_bayar' => number_format($biayaperm->jumlah_bayar),
                'kurang_bayar' => number_format($biayaperm->kurang_bayar),
                'catatan_biayaperm' => $biayaperm->catatan_biayaperm,
                'image_biayaperm' => $biayaperm->image_biayaperm,
                'nama_jenispermohonan' => $biayaperm->nama_jenispermohonan,
                'permohonan' => $permohonan,
                'no_daftar' => $biayaperm->nodaftar_transpermohonan.'/'.$biayaperm->thdaftar_transpermohonan,
                'users' => implode(", ",count($users)>0?$users:[]),
            ];
            array_push($items, $item);
        }
        return $items;
    }
    public function statusBiayaperm()
    {
        $media = request('media', 'screen');
        $lunas = request('lunas', 0);
        $user_id = request('user_id');
        $cond = $lunas=='1'?'=':'>';
        $users = User::whereHas('roles', function($q){
            $q->whereIn('name', ['admin','staf']);
        })->get();
        $userOpts = collect($users)->map(fn ($o) => ['label' => $o['name'], 'value' => $o['id']])->toArray();
        $lunasOpts = [['value'=>'0','label'=>'Belum Lunas'], ['value'=>'1','label'=>'Sudah Lunas']];
        $pre = Biayaperm::where('kurang_bayar', $cond,0)
            ->select('biayaperms.*','nodaftar_transpermohonan','thdaftar_transpermohonan','nama_jenispermohonan','nama_jenishak','luas_tanah', 'nomor_hak','persil','klas', 'nama_penerima',
            'nama_desa','nama_kecamatan','jenishaks.singkatan')
            ->join('transpermohonans', 'transpermohonans.id', 'biayaperms.transpermohonan_id')
            ->join('jenispermohonans', 'jenispermohonans.id', 'transpermohonans.jenispermohonan_id')
            ->join('permohonans', 'permohonans.id', 'transpermohonans.permohonan_id')
            ->join('jenishaks', 'jenishaks.id', 'permohonans.jenishak_id')
            ->join('desas', 'desas.id', 'permohonans.desa_id')
            ->join('kecamatans', 'kecamatans.id', 'desas.kecamatan_id')
            ->orderBy('biayaperms.updated_at','desc');
         if($user_id){
            $result = $pre->whereHas('transpermohonan.permohonan.users', function ($query) use ($user_id) {
                $query->where('id', $user_id);
            });
         }
            $result = $pre->simplePaginate(20)->withQueryString();

        if ($media == 'print') {
            $ket = $lunas==1?'SUDAH LUNAS':'BELUM LUNAS';
            $tanggal = Carbon::now()->format('d M Y');
            $pdf = Pdf::loadView('pdf.lapStatusBiayaperm', [
                'judul_lap' => 'BIAYA PERMOHONAN '.$ket,
                'media' => $media,
                'biayaperms' => $this->toPrint($result),
                'tanggal' => $tanggal,
            ])->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
            return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
        }
        array_unshift($userOpts, ['value'=>'','label'=>"All Petugas"]);
        return Inertia::render(
            'Admin/Informasi/Keuangan/StatusBiayaperm',
            [
                'biayaperms' => BiayapermStatusCollection::collection($result),
                'lunasOpts' => $lunasOpts,
                'userOpts' => $userOpts,
                'lunas' => $lunas,
                'user_id' => $user_id,
            ]
        );
    }

    public function RincianbiayaOpts(Transpermohonan $transpermohonan)
    {
        $rincianbiayaperms = $transpermohonan->waitapproval_rincianbiayaperms;
        $rincianbiayapermOpts = collect($rincianbiayaperms)->map(function ($item) {
                return ['value' => $item['id'], 'label' => sprintf('%s - %s',$item['id'],$item['ket_rincianbiayaperm']),'rincianbiayaperm'=>$item];
            });
        return Response()->json($rincianbiayapermOpts);
    }
}
