<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateKeluarbiayapermuser;
use App\Http\Resources\Admin\DkeluarbiayapermuserCollection;
use App\Http\Resources\Admin\DkeluarbiayapermuserInfoCollection;
use App\Http\Resources\Admin\DkeluarbiayapermuserStafCollection;
use App\Http\Resources\Admin\KeluarbiayapermCollection;
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
use App\Models\Rekening;
use App\Models\Transpermohonan;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use App\Traits\PeriodetimeTrait;

class KeluarbiayapermuserStafController extends Controller
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
                $keluarbiayapermusers = $keluarbiayapermusers->where('user_id', $this->user->id);
            }
        } else {
            $keluarbiayapermusers = $keluarbiayapermusers->where('user_id', $this->user->id);
        }
        $keluarbiayapermusers = $keluarbiayapermusers->where('status_keluarbiayapermuser',$status);
        $keluarbiayapermusers = $keluarbiayapermusers->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Staf/Keluarbiayapermuser/Index', [
            'statusOpts' => $xstatus,
            'status' => $status,
            'cstatus' => $xstatus[1]['value'],
            'filters' => Request::all('search'),
            'keluarbiayapermusers' => KeluarbiayapermuserCollection::collection($keluarbiayapermusers),
            'isAdmin' => $this->is_admin,
            'user' => ['value' => $this->user->id, 'label' => $this->user->name],
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
        $kasbons = Kasbon::where('status_kasbon', 'approved')->where('sisa_penggunaan', '>', '0')->where('user_id', $this->user->id)->get();
        return Inertia::render('Staf/Keluarbiayapermuser/Create', [
            'instansiOpts' => collect($instansis)->map(fn ($o) => ['label' => $o['nama_instansi'], 'value' => $o['id']]),
            // 'instansiOpts' => collect($kasbons)->map(fn ($o) => ['label' => $o->instansi['nama_instansi'], 'value' => $o->instansi['id']]),
            'metodebayarOpts' => collect($metodebayars)->map(fn ($o) => ['label' => $o['nama_metodebayar'], 'value' => $o['id']]),
            'rekeningOpts' => collect($rekenings)->map(fn ($o) => ['label' => $o['nama_rekening'], 'value' => $o['id']]),
            'kasbonOpts' => collect($kasbons)->map(fn ($o) => ['label' => number_format($o['sisa_penggunaan']), 'value' => $o['id'], 'sisa_penggunaan' => $o['sisa_penggunaan'], 'instansi'=>$o['instansi']])->toArray(),
            // 'transpermohonan' => Inertia::lazy(fn () => $transpermohonan),
            'base_route' => $this->base_route,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $validated =  request()->validate([
        //     'instansi_id' => ['required'],
        //     'metodebayar_id' => ['required'],
        //     'kasbon_id' => ['nullable'],
        // ]);
        // $keluarbiayapermuser = Keluarbiayapermuser::create(
        //     $validated
        // );
        // $kasbon = null;
        // if (!empty($validated['kasbon_id'])) {
        //     // $keluarbiayapermuser->kasbons()->attach($validated['kasbon_id']);
        //     $kasbon = Kasbon::find($validated['kasbon_id']);
        //     if ($kasbon) {
        //         $keluarbiayapermuser->kasbons()->attach($kasbon->id);
        //         $kasbon->update([
        //             'status_kasbon' => 'used'
        //         ]);
        //     }
        // }

        $validated =  request()->validate([
            'instansi_id' => ['required'],
            'metodebayar_id' => ['required'],
            'rekening_id' => ['required'],
            'kasbon_id' => ['nullable'],
            'saldo_awal' => ['nullable'],
            'jumlah_biaya' => ['nullable'],
            'saldo_akhir' => ['nullable'],
            'rekening_id' => ['required'],
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

        return Inertia::render('Staf/Keluarbiayapermuser/Edit', [
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
                    'saldo_akhir' => $keluarbiayapermuser->metodebayar->id == '1'? $keluarbiayapermuser->saldo_awal - $jmlbiaya:0,
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
                        'uraian' => $uraian,
                        'akun_id' => $akunpiutang,
                        'debet' => $jsisa,
                        'kredit' => 0,
                        'parent_id' => $parent_id
                    ]);
                    $ju2 = Jurnalumum::updateOrCreate(['id' => $ids[1]], [
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
                    'uraian' => $uraian,
                    'akun_id' => $akunpiutang,
                    'debet' => $jsisa,
                    'kredit' => 0,
                    'parent_id' => $parent_id
                ]);
                $ju2 = Jurnalumum::updateOrCreate(['id' => $ids[1]], [
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
        $data = [
            'judul_lap' => 'PENGELUARAN BIAYA',
            'keluarbiayapermuser' => $keluarbiayapermuser,
            'dkeluarbiayapermusers' => $dkeluarbiayapermusers,
            'tanggal' => $tanggal,
        ];
        $pdf = Pdf::loadView('pdf.lapKeluarbiayauser', $data)->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
        // return view('pdf.lapKeluarbiayauser', compact('judul_lap', 'subjudul_lap'));
        // return $pdf->stream('lapKeluarbiayauser.pdf');
        return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
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
        $dkeluarbiayapermusers = $dkeluarbiayapermusers
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
        return Inertia::render('Staf/Informasi/Keuangan/InfoKeluarbiayapermuser', [
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
