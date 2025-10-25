<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateKeluarbiayapermuser;
use App\Http\Resources\Admin\DkeluarbiayapermuserCollection;
use App\Http\Resources\Admin\DkeluarbiayapermuserInfoCollection;
use App\Http\Resources\Admin\DkeluarbiayapermuserStafCollection;
use App\Http\Resources\Admin\KeluarbiayapermuserCollection;
use App\Http\Resources\Admin\TranspermohonanCollection;
use App\Models\Akun;
use App\Models\Dkeluarbiayapermuser;
use App\Models\Instansi;
use App\Models\Itemkegiatan;
use App\Models\Jurnalumum;
use App\Models\Kasbon;
use App\Models\Keluarbiayapermuser;
use App\Models\Metodebayar;
use App\Models\Prosespermohonan;
use App\Models\Rekening;
use App\Models\Statusprosesperm;
use App\Models\Transpermohonan;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use App\Traits\PeriodetimeTrait;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Closure;

class KeluarbiayapermuserController extends Controller
{
    use PeriodetimeTrait;
    /**
     * Display a listing of the resource.
     */
    private $base_route = null;
    private $is_admin = null;
    private $user = null;
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
            return $next($request);
        });
    }

    public function index()
    {
        $xstatus = [
            ['value' => '', 'label' => 'All Status'],
            ['value' => 'wait_approval', 'label' => 'Waiting Approval'],
            ['value' => 'approved', 'label' => 'Approved'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
            ['value' => 'finish', 'label' => 'finish'],
            ];
            $status = request('status',$xstatus[1]['value']);

        $keluarbiayapermusers = Keluarbiayapermuser::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $keluarbiayapermusers = $keluarbiayapermusers->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $keluarbiayapermusers = $keluarbiayapermusers->orderBy('id', 'desc');
        }
        $keluarbiayapermusers = $keluarbiayapermusers->with('kasbons');
        if ($this->is_admin) {
            if (request()->has('user_id')) {
                $keluarbiayapermusers = $keluarbiayapermusers->where('user_id', request('user_id'));
            }
        } else {
            $keluarbiayapermusers = $keluarbiayapermusers->where('user_id', $this->user->id);
        }
        $keluarbiayapermusers = $keluarbiayapermusers->where('status_keluarbiayapermuser',$status);
        $keluarbiayapermusers = $keluarbiayapermusers->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());
        $user = User::find(request('user_id'));
        return Inertia::render('Admin/Keluarbiayapermuser/Index', [
            'statusOpts' => $xstatus,
            'status' => $status,
            'filters' => Request::all('search'),
            'keluarbiayapermusers' => KeluarbiayapermuserCollection::collection($keluarbiayapermusers),
            'isAdmin' => $this->is_admin,
            'user' => $user?['value' => $user->id, 'label' => $user->name]:[],
            'base_route' => $this->base_route,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $user_id = Auth::id();
        $instansis = Instansi::all();
        $rekenings = Rekening::all();
        $metodebayars = Metodebayar::all();
        $kasbons = Kasbon::where('jenis_kasbon', 'permohonan')->where('status_kasbon', 'approved')->where('sisa_penggunaan', '>', '0')->where('user_id', $this->user->id)->get();
        return Inertia::render('Admin/Keluarbiayapermuser/Create', [
            // 'instansiOpts' => collect($instansis)->map(fn ($o) => ['label' => $o['nama_instansi'], 'value' => $o['id']]),
            'instansiOpts' => collect($instansis)->map(fn ($o) => ['label' => $o['nama_instansi'], 'value' => $o['id']]),
            'metodebayarOpts' => collect($metodebayars)->map(fn ($o) => ['label' => $o['nama_metodebayar'], 'value' => $o['id']]),
            'rekeningOpts' => collect($rekenings)->map(fn ($o) => ['label' => $o['nama_rekening'], 'value' => $o['id']]),
            'kasbonOpts' => collect($kasbons)->map(fn ($o) => ['label' => sprintf('%s - %s', $o['id'], number_format($o['jumlah_kasbon'])), 'value' => $o['id'], 'sisa_penggunaan' => $o['sisa_penggunaan'], 'instansi'=>$o['instansi']])->toArray(),
            // 'transpermohonan' => Inertia::lazy(fn () => $transpermohonan),
            'base_route' => $this->base_route,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'instansi_id' => ['required'],
            'metodebayar_id' => ['required'],
            'rekening_id' => ['required',  function (string $attribute, mixed $value, Closure $fail) {
                $rek = Rekening::find($value);
                if($rek){
                    if($rek->metodebayar_id != request('metodebayar_id'))
                    $fail("Rekening tidak sesuai metode bayar");
                }
            }],
            'kasbon_id' => ['nullable'],
            'saldo_awal' => ['nullable'],
            'jumlah_biaya' => ['nullable'],
            'saldo_akhir' => ['nullable'],
        ]);
        $kasbon = null;
        if (!empty($validated['kasbon_id'])) {
            $kasbon = Kasbon::find($validated['kasbon_id']);
            if ($kasbon) {
                $kasbon->update([
                    'status_kasbon' => 'used'
                ]);
                $validated['saldo_awal'] = $kasbon->jumlah_kasbon;
                $validated['saldo_akhir'] = $kasbon->jumlah_kasbon;
            }
        }

        $keluarbiayapermuser = Keluarbiayapermuser::create(
            $validated
        );
        if ($kasbon) {
            $keluarbiayapermuser->kasbons()->attach($kasbon->id);
        }
        // $permohonan->transpermohonans()->createMany($jenispermohonans);

        // if (count($jenispermohonan_ids) > 0) {
        //     $permohonan->jenispermohonans()->sync($jenispermohonan_ids);
        // }

        return to_route($this->base_route . 'transaksi.keluarbiayapermusers.edit', $keluarbiayapermuser->id)->with('success', 'Pengeluaran biaya created.');
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
    public function edit(Keluarbiayapermuser $keluarbiayapermuser)
    {

        Gate::authorize('update', $keluarbiayapermuser);

        $keluarbiayapermuser->instansi = $keluarbiayapermuser->instansi;
        $keluarbiayapermuser->metodebayar = $keluarbiayapermuser->metodebayar;
        $keluarbiayapermuser->rekening = $keluarbiayapermuser->rekening;
        $keluarbiayapermuser->kasbons = $keluarbiayapermuser->kasbons;
        $keluarbiayapermuser->user = $keluarbiayapermuser->user;
        // $keluarbiayapermuser = $keluarbiayapermuser->with(['user', 'instansi', 'metodebayar', 'kasbons'])->first();
        $itemkegiatans = Itemkegiatan::where('instansi_id', $keluarbiayapermuser->instansi_id)
            ->whereHas('grupitemkegiatans', function ($q) {
                $q->whereIn('slug', ['pengeluaran']);
            })->get();

        $status_keluarbiayapermusers = collect(['wait_approval', 'approved', 'cancelled', 'rejected'])->map(function ($item) {
            return ['value' => $item, 'label' => $item];
        });
        $dkeluarbiayapermusers = Dkeluarbiayapermuser::query();
        $dkeluarbiayapermusers = $dkeluarbiayapermusers
            ->select('dkeluarbiayapermusers.id', 'nama_penerima', 'nomor_hak', 'persil', 'klas', 'luas_tanah', 'singkatan', 'nama_itemkegiatan', 'jumlah_biaya', 'ket_biaya', 'nama_desa', 'nama_kecamatan')
            ->join('transpermohonans', 'transpermohonans.id', 'dkeluarbiayapermusers.transpermohonan_id')
            ->join('itemkegiatans', 'itemkegiatans.id', 'dkeluarbiayapermusers.itemkegiatan_id')
            ->join('permohonans', 'permohonans.id', 'transpermohonans.permohonan_id')
            ->join('jenishaks', 'jenishaks.id', 'permohonans.jenishak_id')
            ->join('desas', 'desas.id', 'permohonans.desa_id')
            ->join('kecamatans', 'kecamatans.id', 'desas.kecamatan_id')
            ->where('keluarbiayapermuser_id', $keluarbiayapermuser->id)
            ->orderBy('dkeluarbiayapermusers.id', 'asc')
            ->paginate(20);

        return Inertia::render('Admin/Keluarbiayapermuser/Edit', [
            'keluarbiayapermuser' => new KeluarbiayapermuserCollection($keluarbiayapermuser),
            'itemkegiatanOpts' => collect($itemkegiatans)->map(fn ($o) => ['label' => $o['nama_itemkegiatan'], 'value' => $o['id']]),
            'dkeluarbiayapermusers' => DkeluarbiayapermuserCollection::collection($dkeluarbiayapermusers),
            'status_keluarbiayapermusers' => $status_keluarbiayapermusers,
            'is_admin' => $this->is_admin,
            'base_route' => $this->base_route,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateStatus(Keluarbiayapermuser $keluarbiayapermuser)
    {
        $validated =  request()->validate([
            'status_keluarbiayapermuser' => ['required'],
        ]);
        $keluarbiayapermuser->update($validated);
        $kasbons = $keluarbiayapermuser->kasbons;
        if (count($kasbons) > 0) {
            $id = $kasbons[0]->id;
            $kasbon = Kasbon::find($id);
            if ($validated['status_keluarbiayapermuser'] === 'approved') {
            //     $kasbon->update(['status_kasbon' => 'finish']);
            //     $this->returSisaKasbon($kasbon, 0);
            // } elseif ($keluarbiayapermuser->status_keluarbiayapermuser == 'wait_approval') {
                // if ($keluarbiayapermuser->saldo_akhir > 0) {
                    $kasbon->update(['status_kasbon' => 'used']);
                    $this->returSisaKasbon($kasbon, $keluarbiayapermuser->saldo_akhir);
                // }
            }
        }
        return redirect()->back()->with('status Pengeluaran updated');
    }

    public function update(UpdateKeluarbiayapermuser $request, Keluarbiayapermuser $keluarbiayapermuser)
    {
        $dkeluarbiayapermuser = $keluarbiayapermuser->dkeluarbiayapermusers()->create($request->validated());
        //posting jurnalumum
        $akunkredit = $keluarbiayapermuser->rekening->akun_id;
        $akundebet = $dkeluarbiayapermuser->itemkegiatan->akun_id;
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
        //cek proses permohonan
        // $itemkegiatan = $dkeluarbiayapermuser->itemkegiatan;
        $itemprosesperm = $dkeluarbiayapermuser->itemkegiatan->itemprosesperms->first();
        $statusprosesperm = Statusprosesperm::where('nama_statusprosesperm', 'Proses')->first();
        if ($itemprosesperm) {
            $rec = Prosespermohonan::
            where('transpermohonan_id', $dkeluarbiayapermuser->transpermohonan_id)
            ->where('itemprosesperm_id', $itemprosesperm->id)->first();
            // if ($rec) {
            //     $rec->update([
            //         'transpermohonan_id' => $dkeluarbiayapermuser->transpermohonan_id,
            //         'itemprosesperm_id' => $itemprosesperm->id,
            //         'catatan_prosesperm' => '-',
            //         'statusprosesperm_id'=>$statusprosesperm->id,
            //         'is_alert'=>false,
            //         'start'=>$keluarbiayapermuser->updated_at,
            //         'end'=>$keluarbiayapermuser->updated_at,
            //     ]);
            $user = auth()->user();
            if(!$rec){

                $prosespermohonan = Prosespermohonan::create([
                'transpermohonan_id' => $dkeluarbiayapermuser->transpermohonan_id,
                'itemprosesperm_id' => $itemprosesperm->id,
                'catatan_prosesperm' => '-',
                // 'statusprosesperm_id'=>$statusprosesperm->id,
                'is_alert'=>false,
                'start'=>Carbon::parse($keluarbiayapermuser->updated_at)->addDay(),
                'end'=>Carbon::parse($keluarbiayapermuser->updated_at)->addDay(),
                ]);
            $validated = [
                'prosespermohonan_id' => $prosespermohonan->id,
                'statusprosesperm_id' => $statusprosesperm->id,
                'catatan_statusprosesperm' => '-',
                'user_id' => $user->id,
            ];
            $prosespermohonan->statusprosesperms()->attach($prosespermohonan->id, $validated);
            }else{
                $prosespermohonan = $rec;
            $validated = [
                'prosespermohonan_id' => $prosespermohonan->id,
                'statusprosesperm_id' => $statusprosesperm->id,
                'catatan_statusprosesperm' => '-',
                'user_id' => $user->id,
            ];
            $prosespermohonan->statusprosesperms()->detach($statusprosesperm->id);
            $ids = $prosespermohonan->statusprosesperms()->pluck('statusprosesperm_id');
            if (count($ids) > 0) {
                $prosespermohonan->statusprosesperms()->syncWithPivotValues($ids, ['active' => false]);
            }
            $prosespermohonan->statusprosesperms()->attach($prosespermohonan->id, $validated);
            }
        }

        $kasbons = $dkeluarbiayapermuser->keluarbiayapermuser->kasbons;

        if (count($kasbons) > 0) {
            $kasbon = $kasbons[0];
            $jmlbiaya = $keluarbiayapermuser->dkeluarbiayapermusers->sum('jumlah_biaya');
            $keluarbiayapermuser->update(
                [
                    // 'saldo_awal' => $kasbon->sisa_penggunaan,
                    'jumlah_biaya' => $jmlbiaya,
                    'saldo_akhir' => $keluarbiayapermuser->saldo_awal - $jmlbiaya,
                ]
            );
            $this->updateKasbon($kasbon->id, $dkeluarbiayapermuser->jumlah_biaya);
        } else {
            $jmlbiaya = $keluarbiayapermuser->dkeluarbiayapermusers->sum('jumlah_biaya');
            $keluarbiayapermuser->update(
                [
                    // 'saldo_awal' => 0,
                    'jumlah_biaya' => $jmlbiaya,
                    'saldo_akhir' => 0,
                ]
            );
        }


        return to_route($this->base_route . 'transaksi.keluarbiayapermusers.edit', $keluarbiayapermuser->id)->with('success', 'Pengeluaran biaya updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dkeluarbiayapermuser $dkeluarbiayapermuser)
    {
        //
    }
    public function destroyDkeluarbiayapermuser(Dkeluarbiayapermuser $dkeluarbiayapermuser)
    {
        $jurnalumums = $dkeluarbiayapermuser->jurnalumums;
        for ($i = 0; $i < count($jurnalumums); $i++) {
            $rec = $jurnalumums[$i];
            $rec->delete();
        }

        $kasbons = $dkeluarbiayapermuser->keluarbiayapermuser->kasbons;
        $keluarbiayapermuser = $dkeluarbiayapermuser->keluarbiayapermuser;

        if (count($kasbons) > 0) {
            $kasbon = $kasbons[0];
            $jmlbiaya = $dkeluarbiayapermuser->jumlah_biaya;
            $totbiaya = $keluarbiayapermuser->dkeluarbiayapermusers->sum('jumlah_biaya');
            $totbiaya = $totbiaya - $jmlbiaya;
            $dkeluarbiayapermuser->keluarbiayapermuser->update(
                [
                    // 'saldo_awal' => $kasbon->jumlah_kasbon,
                    // 'jumlah_biaya' => $totbiaya,
                    // 'saldo_akhir' => $kasbon->jumlah_kasbon - $totbiaya,
                    'saldo_awal' => $keluarbiayapermuser->saldo_awal,
                    'jumlah_biaya' => $totbiaya,
                    'saldo_akhir' => $keluarbiayapermuser->saldo_akhir + $jmlbiaya,
                    ]
            );
            $this->returKasbon($kasbon->id, $dkeluarbiayapermuser->jumlah_biaya);
        }else{
            $jmlbiaya = $dkeluarbiayapermuser->jumlah_biaya;
            $totbiaya = $keluarbiayapermuser->dkeluarbiayapermusers->sum('jumlah_biaya');
            $totbiaya = $totbiaya - $jmlbiaya;
            $dkeluarbiayapermuser->keluarbiayapermuser->update(
                [
                    'saldo_awal' => 0,
                    'jumlah_biaya' => $totbiaya,
                    'saldo_akhir' => 0,
                ]
            );
        }

        $dkeluarbiayapermuser->delete();
        return Redirect::back()->with('success', 'Pengeluaran deleted.');
    }
    public function list()
    {
        $transpermohonan_id = request('transpermohonan_id');
        $dkeluarbiayapermusers = DKeluarbiayapermuser::query();
        $dkeluarbiayapermusers = $dkeluarbiayapermusers->with('itemkegiatan:id,nama_itemkegiatan')
            ->with('keluarbiayapermuser', function ($q) {
                $q->select('id', 'metodebayar_id', 'user_id', 'instansi_id')
                    ->with(['user:id,name', 'metodebayar:id,nama_metodebayar', 'instansi:id,nama_instansi']);
            })
            ->where('transpermohonan_id', '=', $transpermohonan_id);
        $dkeluarbiayapermusers = $dkeluarbiayapermusers->orderBy('dkeluarbiayapermusers.id', 'desc')
            ->cursorPaginate(10)->withQueryString();
        return DkeluarbiayapermuserStafCollection::collection($dkeluarbiayapermusers);
        // return $dkeluarbiayapermusers;
    }
    public function getTotalPengeluaran()
    {
        $transpermohonan_id = request('transpermohonan_id');
        $totalPengeluaran = Dkeluarbiayapermuser::where('transpermohonan_id', '=', $transpermohonan_id)->sum('jumlah_biaya');
        return number_format($totalPengeluaran);
    }
    public function updateKasbon($id, $jumlah_biaya)
    {
        $kasbon = Kasbon::find($id);
        if ($kasbon) {
            $sisapenggunaan = $kasbon->sisa_penggunaan;
            $jmlkasbon = $kasbon->jumlah_kasbon;
            $jmlpenggunaan = $kasbon->jumlah_penggunaan;
            $tpenggunaan = $jmlpenggunaan + $jumlah_biaya;
            $jsisa =  $jmlkasbon - $tpenggunaan;
            if ($jsisa < 0) {
                $tpenggunaan = $jmlkasbon;
                $jsisa = 0;
            }
            //posting jurnalumum
            if ($sisapenggunaan > 0) {
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
                }
            }
        }
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
    public function lapKeluarbiayapermstaf(Keluarbiayapermuser $keluarbiayapermuser)
    {
        $keluarbiayapermuser->tanggal = Carbon::parse($keluarbiayapermuser->created_at)->format('d M Y');
        $keluarbiayapermuser->instansi = $keluarbiayapermuser->instansi;
        $keluarbiayapermuser->metodebayar = $keluarbiayapermuser->metodebayar;
        $keluarbiayapermuser->kasbons = $keluarbiayapermuser->kasbons;
        $keluarbiayapermuser->user = $keluarbiayapermuser->user;
        $dkeluarbiayapermusers = Dkeluarbiayapermuser::query();
        $dkeluarbiayapermusers = $dkeluarbiayapermusers
            ->select('dkeluarbiayapermusers.id', 'nama_penerima', 'nomor_hak', 'persil', 'klas', 'luas_tanah', 'singkatan', 'nama_itemkegiatan', 'jumlah_biaya', 'ket_biaya', 'nama_desa', 'nama_kecamatan')
            ->join('transpermohonans', 'transpermohonans.id', 'dkeluarbiayapermusers.transpermohonan_id')
            ->join('itemkegiatans', 'itemkegiatans.id', 'dkeluarbiayapermusers.itemkegiatan_id')
            ->join('permohonans', 'permohonans.id', 'transpermohonans.permohonan_id')
            ->join('jenishaks', 'jenishaks.id', 'permohonans.jenishak_id')
            ->join('desas', 'desas.id', 'permohonans.desa_id')
            ->join('kecamatans', 'kecamatans.id', 'desas.kecamatan_id')
            ->where('keluarbiayapermuser_id', $keluarbiayapermuser->id)
            ->orderBy('dkeluarbiayapermusers.id', 'asc')
            ->take(100)->skip(0)->get();
        $dkeluarbiayapermusers = collect($dkeluarbiayapermusers)->map((function ($item, $i) {
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
        $media = request('media','print');
        $qr_kode = sprintf("lapkeluarbiayaprm_%s.png", $this->user->id);
        $xpath = url()->current().'/?media=screen';
        QrCode::format('png')->size(100)->generate($xpath, public_path($qr_kode));
        $data = [
            'qrcode' => config('app.qrcodeurl',''). $qr_kode,
            'judul_lap' => 'PENGELUARAN BIAYA PERMOHONAN',
            'keluarbiayapermuser' => $keluarbiayapermuser,
            'dkeluarbiayapermusers' => $dkeluarbiayapermusers,
            'tanggal' => $tanggal,
        ];
        if($media == 'print'){
            $pdf = Pdf::loadView('pdf.lapKeluarbiayauser', $data)->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
            return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
            }else{
            return view('lapKeluarbiayauser', $data);
        }
    }
    public function infoKeluarbiayapermuser()
    {
        $period_opts = $this->getPeriodOpts();
        $period = request('period', 'this_week');
        $periods = $this->getPeriodTimes($period);
        $date1 = Carbon::now();
        $date2 = Carbon::now();
        // $last_day = $date2->daysInMonth;
        $now = Carbon::now();
        $prev = $date1->subMonths(1);
        // $prev = $date1->setDay(1);

        if (request()->has(['date1']) && request()->has(['date2'])) {
            $now = Carbon::parse(request('date2'));
            $prev = Carbon::parse(request('date1'));
        }

        $itemkegiatan_id = request('itemkegiatan_id','all');
        if($itemkegiatan_id == 'all'){
            $itemkegiatan_id=null;
        }
        $itemkegiatanOpts = Itemkegiatan::all();

        $dkeluarbiayapermusers = Dkeluarbiayapermuser::query();
        $dkeluarbiayapermusers = $dkeluarbiayapermusers->selectRaw('dkeluarbiayapermusers.*')
            // ->with('keluarbiaya', function ($q) {
            //     $q->where('status_keluarbiaya', 'approveda');
            //     if (request()->has('user_id')) {
            //     $q->where('user_id', request('user_id'));
            //     }
            // });

            ->join('keluarbiayapermusers','keluarbiayapermusers.id','dkeluarbiayapermusers.keluarbiayapermuser_id');
            $dkeluarbiayapermusers = $dkeluarbiayapermusers->whereRaw('dkeluarbiayapermusers.created_at >= ? and dkeluarbiayapermusers.created_at <= ?',  [$periods])
            ->with(['itemkegiatan','keluarbiayapermuser.instansi','keluarbiayapermuser.rekening','keluarbiayapermuser.user','transpermohonan.permohonan','transpermohonan.permohonan.desa',
            'transpermohonan.permohonan.jenishak',
            'transpermohonan.permohonan.desa.kecamatan']);

            $dkeluarbiayapermusers = $dkeluarbiayapermusers->filter(Request::only(['search','itemkegiatan_id','user_id','transpermohonan_id']));
            if (request()->has(['sortBy', 'sortDir'])) {
                $dkeluarbiayapermusers = $dkeluarbiayapermusers->orderBy(request('sortBy'), request('sortDir'));
            }
        $dkeluarbiayapermusers = $dkeluarbiayapermusers->paginate(10)->appends(request()->all());
        $itemkegiatanOpts = collect($itemkegiatanOpts)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_itemkegiatan']])->toArray();
        $allOpts = ['value' => '', 'label' => 'All Kegiatan'];
        array_unshift($itemkegiatanOpts, $allOpts);
        $user = User::find(request('user_id'));
        $transpermohonan = request('transpermohonan_id')?Transpermohonan::find(request('transpermohonan_id')):null;
        return Inertia::render('Admin/Informasi/Keuangan/InfoKeluarbiayapermuser', [
            'itemkegiatanOpts' => $itemkegiatanOpts,
            'dkeluarbiayapermusers' => DkeluarbiayapermuserInfoCollection::collection($dkeluarbiayapermusers),
            'base_route' =>$this->base_route,
            'periodOpts' => $period_opts,
            'period' => $period,
            'date1' => $prev->format('Y-m-d'),
            'date2' => $now->format('Y-m-d'),
            'isAdmin' =>$this->is_admin,
            'user' => $user?['value' => $user->id, 'label' => $user->name]:[],
            'ctranspermohonan' => $transpermohonan? new TranspermohonanCollection($transpermohonan):null,
            // 'transpermohonan' => Inertia::lazy(fn () => $transpermohonan),
        ]);
    }

}
