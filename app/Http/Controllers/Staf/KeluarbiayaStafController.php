<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateKeluarbiaya;
use App\Http\Resources\Admin\DkeluarbiayaCollection;
use App\Http\Resources\Admin\DkeluarbiayaInfoCollection;
use App\Http\Resources\Admin\KeluarbiayaCollection;
use App\Models\Akun;
use App\Models\Dkeluarbiaya;
use App\Models\Instansi;
use App\Models\Itemkegiatan;
use App\Models\Jurnalumum;
use App\Models\Kasbon;
use App\Models\Keluarbiaya;
use App\Models\Metodebayar;
use App\Models\Rekening;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use App\Traits\PeriodetimeTrait;

class KeluarbiayaStafController extends Controller
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
        $keluarbiayas = Keluarbiaya::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $keluarbiayas = $keluarbiayas->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $keluarbiayas = $keluarbiayas->orderBy('id', 'desc');
        }
        $keluarbiayas = $keluarbiayas->with('kasbons');
        if ($this->is_admin) {
            if (request()->has('user_id')) {
                $keluarbiayas = $keluarbiayas->where('user_id', $this->user->id);
            }
        } else {
            $keluarbiayas = $keluarbiayas->where('user_id', $this->user->id);
        }
        $keluarbiayas = $keluarbiayas->where('status_keluarbiaya',$status);
        $keluarbiayas = $keluarbiayas->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Staf/Keluarbiaya/Index', [
            'statusOpts' => $xstatus,
            'status' => $status,
            'filters' => Request::all('search'),
            'keluarbiayas' => KeluarbiayaCollection::collection($keluarbiayas),
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
        $metodebayars = Metodebayar::all();
        $rekenings = Rekening::all();
        $kasbons = Kasbon::where('status_kasbon', 'approved')->where('sisa_penggunaan', '>', '0')->where('user_id', $this->user->id)->get();
        return Inertia::render('Staf/Keluarbiaya/Create', [
            'instansiOpts' => collect($instansis)->map(fn ($o) => ['label' => $o['nama_instansi'], 'value' => $o['id']]),
            'metodebayarOpts' => collect($metodebayars)->map(fn ($o) => ['label' => $o['nama_metodebayar'], 'value' => $o['id']]),
            'kasbonOpts' => collect($kasbons)->map(fn ($o) => ['label' => number_format($o['sisa_penggunaan']), 'value' => $o['id'], 'sisa_penggunaan' => $o['sisa_penggunaan']])->toArray(),
            'rekeningOpts' => collect($rekenings)->map(fn ($o) => ['label' => $o['nama_rekening'], 'value' => $o['id']]),
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
            'rekening_id' => ['required'],
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

        $keluarbiaya = Keluarbiaya::create(
            $validated
        );
        if ($kasbon) {
            $keluarbiaya->kasbons()->attach($kasbon->id);
        }
        // $permohonan->transpermohonans()->createMany($jenispermohonans);

        // if (count($jenispermohonan_ids) > 0) {
        //     $permohonan->jenispermohonans()->sync($jenispermohonan_ids);
        // }

        return to_route($this->base_route . 'transaksi.keluarbiayas.edit', $keluarbiaya->id)->with('success', 'Pengeluaran biaya created.');
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
    public function edit(Keluarbiaya $keluarbiaya)
    {

        Gate::authorize('update', $keluarbiaya);

        $keluarbiaya->instansi = $keluarbiaya->instansi;
        $keluarbiaya->metodebayar = $keluarbiaya->metodebayar;
        $keluarbiaya->rekening = $keluarbiaya->rekening;
        $keluarbiaya->kasbons = $keluarbiaya->kasbons;
        $keluarbiaya->user = $keluarbiaya->user;
        // $keluarbiaya = $keluarbiaya->with(['user', 'instansi', 'metodebayar', 'kasbons'])->first();
        $itemkegiatans = Itemkegiatan::where('instansi_id', $keluarbiaya->instansi_id)
            ->whereHas('grupitemkegiatans', function ($q) {
                $q->whereIn('slug', ['pengeluaran']);
            })->get();

        $status_keluarbiayas = collect(['wait_approval', 'approved', 'cancelled', 'rejected'])->map(function ($item) {
            return ['value' => $item, 'label' => $item];
        });
        $dkeluarbiayas = Dkeluarbiaya::query();
        $dkeluarbiayas = $dkeluarbiayas
            ->select('dkeluarbiayas.id', 'nama_itemkegiatan', 'jumlah_biaya', 'ket_biaya')
            ->join('itemkegiatans', 'itemkegiatans.id', 'dkeluarbiayas.itemkegiatan_id')
            ->where('keluarbiaya_id', $keluarbiaya->id)
            ->orderBy('dkeluarbiayas.id', 'asc')
            ->paginate(20);

        return Inertia::render('Staf/Keluarbiaya/Edit', [
            'keluarbiaya' => new KeluarbiayaCollection($keluarbiaya),
            'itemkegiatanOpts' => collect($itemkegiatans)->map(fn ($o) => ['label' => $o['nama_itemkegiatan'], 'value' => $o['id']]),
            'dkeluarbiayas' => DkeluarbiayaCollection::collection($dkeluarbiayas),
            'status_keluarbiayas' => $status_keluarbiayas,
            'is_admin' => $this->is_admin,
            'base_route' => $this->base_route,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateStatus(Keluarbiaya $keluarbiaya)
    {
        $validated =  request()->validate([
            'status_keluarbiaya' => ['required'],
        ]);
        $keluarbiaya->update($validated);
        $kasbons = $keluarbiaya->kasbons;
        if (count($kasbons) > 0) {
            $id = $kasbons[0]->id;
            $kasbon = Kasbon::find($id);
            if ($keluarbiaya->status_keluarbiaya == 'approved') {
                $kasbon->update(['status_kasbon' => 'finish']);
                $this->returSisaKasbon($kasbon, 0);
            } elseif ($keluarbiaya->status_keluarbiaya == 'wait_approval') {
                if ($keluarbiaya->saldo_akhir > 0) {
                    $kasbon->update(['status_kasbon' => 'used']);
                    $this->returSisaKasbon($kasbon, $keluarbiaya->saldo_akhir);
                }
            }
        }
        return redirect()->back()->with('status Pengeluaran updated');
    }

    public function update(UpdateKeluarbiaya $request, Keluarbiaya $keluarbiaya)
    {
        $dkeluarbiaya = $keluarbiaya->dkeluarbiayas()->create($request->validated());
        //posting jurnalumum
        $akunkredit = $keluarbiaya->rekening->akun_id;
        $akundebet = $dkeluarbiaya->itemkegiatan->akun_id;
        $uraian = $dkeluarbiaya->itemkegiatan->nama_itemkegiatan
            . ' - ' . $dkeluarbiaya->ket_biaya;
        $parent_id = $dkeluarbiaya->keluarbiaya_id;
        $ju1 = Jurnalumum::create([
            'uraian' => $uraian,
            'akun_id' => $akundebet,
            'debet' => $dkeluarbiaya->jumlah_biaya,
            'kredit' => 0,
            'parent_id' => $parent_id
        ]);
        $ju2 = Jurnalumum::create([
            'uraian' => $uraian,
            'akun_id' => $akunkredit,
            'debet' => 0,
            'kredit' => $dkeluarbiaya->jumlah_biaya,
            'parent_id' => $parent_id
        ]);
        $ids = [$ju1->id, $ju2->id];
        $dkeluarbiaya->jurnalumums()->attach($ids);

        $kasbons = $dkeluarbiaya->keluarbiaya->kasbons;
        if (count($kasbons) > 0) {
            $kasbon = $kasbons[0];
            $jmlbiaya = $keluarbiaya->dkeluarbiayas->sum('jumlah_biaya');
            $keluarbiaya->update(
                [
                    // 'saldo_awal' => $kasbon->sisa_penggunaan,
                    'jumlah_biaya' => $jmlbiaya,
                    'saldo_akhir' => $keluarbiaya->saldo_awal - $jmlbiaya,
                ]
            );
            $this->updateKasbon($kasbon->id, $dkeluarbiaya->jumlah_biaya);
        } else {
            $jmlbiaya = $keluarbiaya->dkeluarbiayas->sum('jumlah_biaya');
            $keluarbiaya->update(
                [
                    // 'saldo_awal' => 0,
                    'jumlah_biaya' => $jmlbiaya,
                    'saldo_akhir' => $keluarbiaya->metodebayar->id == '1'? $keluarbiaya->saldo_awal - $jmlbiaya:0,
                ]
            );
        }

        return to_route($this->base_route . 'transaksi.keluarbiayas.edit', $keluarbiaya->id)->with('success', 'Pengeluaran biaya updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dkeluarbiaya $dkeluarbiaya)
    {
        //
    }
    public function destroyDkeluarbiaya(Dkeluarbiaya $dkeluarbiaya)
    {
        $jurnalumums = $dkeluarbiaya->jurnalumums;
        for ($i = 0; $i < count($jurnalumums); $i++) {
            $rec = $jurnalumums[$i];
            $rec->delete();
        }

        $kasbons = $dkeluarbiaya->keluarbiaya->kasbons;
        $keluarbiaya = $dkeluarbiaya->keluarbiaya;
        if (count($kasbons) > 0) {
            $kasbon = $kasbons[0];
            $jmlbiaya = $dkeluarbiaya->jumlah_biaya;
            $totbiaya = $keluarbiaya->dkeluarbiayas->sum('jumlah_biaya');
            $totbiaya = $totbiaya - $jmlbiaya;
            $dkeluarbiaya->keluarbiaya->update(
                [
                    'saldo_awal' => $keluarbiaya->saldo_awal,
                    'jumlah_biaya' => $totbiaya,
                    'saldo_akhir' => $keluarbiaya->saldo_akhir + $jmlbiaya,
                ]
            );
            $this->returKasbon($kasbon->id, $dkeluarbiaya->jumlah_biaya);
        }else{
            $jmlbiaya = $dkeluarbiaya->jumlah_biaya;
            $totbiaya = $keluarbiaya->dkeluarbiayas->sum('jumlah_biaya');
            $totbiaya = $totbiaya - $jmlbiaya;
            $dkeluarbiaya->keluarbiaya->update(
                [
                    'saldo_awal' => 0,
                    'jumlah_biaya' => $totbiaya,
                    'saldo_akhir' => 0,
                ]
            );
        }

        $dkeluarbiaya->delete();
        return Redirect::back()->with('success', 'Pengeluaran deleted.');
    }
    public function list()
    {
        $keluarbiaya_id = request('keluarbiaya_id');
        $dkeluarbiayas = DKeluarbiaya::query();
        $dkeluarbiayas = $dkeluarbiayas->with('itemkegiatan:id,nama_itemkegiatan')
            ->with('keluarbiaya', function ($q) {
                $q->select('id', 'metodebayar_id', 'user_id', 'instansi_id')
                    ->with(['user:id,name', 'metodebayar:id,nama_metodebayar', 'instansi:id,nama_instansi']);
            })
            ->where('keluarbiaya_id', '=', $keluarbiaya_id);
        $dkeluarbiayas = $dkeluarbiayas->orderBy('dkeluarbiayas.id', 'desc')
            ->cursorPaginate(10)->withQueryString();
        return DkeluarbiayaCollection::collection($dkeluarbiayas);
        // return $dkeluarbiayas;
    }
    public function getTotalPengeluaran()
    {
        $keluarbiaya_id = request('keluarbiaya_id');
        $totalPengeluaran = Dkeluarbiaya::where('keluarbiaya_id', '=', $keluarbiaya_id)->sum('jumlah_biaya');
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
    public function returSisaKasbon($kasbon, $jumlah)
    {
        $jsisa = $kasbon->sisa_penggunaan;
        //posting jurnalumum
        if ($jsisa > 0) {
            $akunkas = Akun::getKodeAkun('kas');
            $akunpiutang = Akun::getKodeAkun('piutang');
            $uraian = 'Kasbon Used - ' . $kasbon->user->name . ' - ' . $kasbon->keperluan;
            $parent_id = $kasbon->id;
            $ids = $kasbon->jurnalumums()->pluck('id');
            if (count($ids) == 2) {
                $ju1 = Jurnalumum::updateOrCreate(['id' => $ids[0]], [
                    'uraian' => $uraian,
                    'akun_id' => $akunpiutang,
                    'debet' => $jumlah,
                    'kredit' => 0,
                    'parent_id' => $parent_id
                ]);
                $ju2 = Jurnalumum::updateOrCreate(['id' => $ids[1]], [
                    'uraian' => $uraian,
                    'akun_id' => $akunkas,
                    'debet' => 0,
                    'kredit' => $jumlah,
                    'parent_id' => $parent_id
                ]);
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
    public function lapKeluarbiayastaf(Keluarbiaya $keluarbiaya)
    {
        $keluarbiaya->tanggal = Carbon::parse($keluarbiaya->created_at)->format('d M Y');
        $keluarbiaya->instansi = $keluarbiaya->instansi;
        $keluarbiaya->metodebayar = $keluarbiaya->metodebayar;
        $keluarbiaya->kasbons = $keluarbiaya->kasbons;
        $keluarbiaya->user = $keluarbiaya->user;
        $dkeluarbiayas = Dkeluarbiaya::query();
        $dkeluarbiayas = $dkeluarbiayas
            ->select('dkeluarbiayas.id', 'nama_itemkegiatan', 'jumlah_biaya', 'ket_biaya')
            ->join('itemkegiatans', 'itemkegiatans.id', 'dkeluarbiayas.itemkegiatan_id')
            ->where('keluarbiaya_id', $keluarbiaya->id)
            ->orderBy('dkeluarbiayas.id', 'asc')
            ->take(100)->skip(0)->get();
        $dkeluarbiayas = collect($dkeluarbiayas)->map((function ($item, $i) {
            return [
                'nourut' => ($i + 1) . '.',
                'id' => $item['id'],
                'nama_itemkegiatan' => $item['nama_itemkegiatan'],
                'jumlah_biaya' => number_format($item['jumlah_biaya']),
                'ket_biaya' => $item['ket_biaya'],
                'image_dkeluarbiaya' => $item['image_dkeluarbiaya'],
            ];
        }));
        $tanggal = Carbon::now()->format('d M Y');
        $data = [
            'judul_lap' => 'PENGELUARAN BIAYA',
            'keluarbiaya' => $keluarbiaya,
            'dkeluarbiayas' => $dkeluarbiayas,
            'tanggal' => $tanggal,
        ];
        $pdf = Pdf::loadView('pdf.lapKeluarbiaya', $data)->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
        // return view('pdf.lapKeluarbiayauser', compact('judul_lap', 'subjudul_lap'));
        // return $pdf->stream('lapKeluarbiayauser.pdf');
        return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
    }
    public function infoKeluarbiayaStaf()
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

        $dkeluarbiayas = Dkeluarbiaya::query();
        $dkeluarbiayas = $dkeluarbiayas
            // ->with('keluarbiaya', function ($q) {
            //     $q->where('status_keluarbiaya', 'approveda');
            //     if (request()->has('user_id')) {
            //     $q->where('user_id', request('user_id'));
            //     }
            // });

            ->join('keluarbiayas','keluarbiayas.id','dkeluarbiayas.keluarbiaya_id');

            $dkeluarbiayas = $dkeluarbiayas->whereRaw('dkeluarbiayas.created_at >= ? and dkeluarbiayas.created_at <= ?',  [$periods])
            ->with(['itemkegiatan','keluarbiaya.instansi','keluarbiaya.rekening','keluarbiaya.user']);

            $dkeluarbiayas = $dkeluarbiayas->filter(Request::only(['search','itemkegiatan_id','user_id']));
            if (request()->has(['sortBy', 'sortDir'])) {
                $dkeluarbiayas = $dkeluarbiayas->orderBy(request('sortBy'), request('sortDir'));
            }
        $dkeluarbiayas = $dkeluarbiayas->paginate(10)->appends(request()->all());
        $itemkegiatanOpts = collect($itemkegiatanOpts)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_itemkegiatan']])->toArray();
        $allOpts = ['value' => '', 'label' => 'All Kegiatan'];
        array_unshift($itemkegiatanOpts, $allOpts);
        $user = User::find(request('user_id'));
        return Inertia::render('Staf/Informasi/Keuangan/InfoKeluarbiaya', [
            'itemkegiatanOpts' => $itemkegiatanOpts,
            'dkeluarbiayas' => DkeluarbiayaInfoCollection::collection($dkeluarbiayas),
            'base_route' =>$this->base_route,
            'periodOpts' => $period_opts,
            'period' => $period,
            'date1' => $prev->format('Y-m-d'),
            'date2' => $now->format('Y-m-d'),
            'isAdmin' =>$this->is_admin,
            'user' => $user?['value' => $user->id, 'label' => $user->name]:[],
            // 'transpermohonan' => Inertia::lazy(fn () => $transpermohonan),
        ]);
    }

}
