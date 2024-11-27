<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AnggarankeluarbiayapermCollection;
use App\Models\Anggarankeluarbiayaperm;
use App\Models\Instansi;
use App\Models\Itemkegiatan;
use App\Models\Kasbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AnggarankeluarbiayapermController extends Controller
{
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
    public function create(Kasbon $kasbon)
    {
        $itemkegiatans = Itemkegiatan::where('instansi_id', $kasbon->instansi_id)
        ->whereHas('grupitemkegiatans', function ($q) {
            $q->whereIn('slug', ['pengeluaran']);
        })->get();
        $kasbon = $kasbon;
        $kasbon->instansi = $kasbon->instansi;
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
            ->paginate(20);
        $total_biaya=Anggarankeluarbiayaperm::where('kasbon_id',$kasbon->id)->sum('jumlah_biaya');
        return Inertia::render('Admin/Anggarankeluarbiayaperm/Create', [
            'itemkegiatanOpts' => collect($itemkegiatans)->map(fn ($o) => ['label' => $o['nama_itemkegiatan'], 'value' => $o['id']]),
            'kasbon' => $kasbon,
            'anggarankeluarbiayaperms' => AnggarankeluarbiayapermCollection::collection($anggarankeluarbiayaperms),
            'base_route' => $this->base_route,
            'total_biaya' => number_format($total_biaya),
            'is_admin' => $this->is_admin,
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'kasbon_id' => ['required'],
            'itemkegiatan_id' => ['required'],
            'transpermohonan_id' =>['required'],
            'jumlah_biaya' => ['required'],
            'ket_biaya' => ['required'],
        ]);

        $anggarankeluarbiayaperm = Anggarankeluarbiayaperm::create(
            $validated
        );

        $total_biaya=Anggarankeluarbiayaperm::where('kasbon_id',$anggarankeluarbiayaperm->kasbon_id)->sum('jumlah_biaya');
        $kasbon = $anggarankeluarbiayaperm->kasbon;
        if($kasbon && $total_biaya>0){
            if($kasbon->status_kasbon === 'wait_approval'){
                $kasbon->update([
                    'jumlah_kasbon' => $total_biaya,
                    'sisa_penggunaan' => $total_biaya - $kasbon->jumlah_penggunaan
                ]);
            }
        }
        return to_route($this->base_route . 'transaksi.anggarankeluarbiayaperms.create', $anggarankeluarbiayaperm->kasbon_id)->with('success', 'Pengeluaran biaya created.');
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
    public function destroy(Anggarankeluarbiayaperm $anggarankeluarbiayaperm)
    {
        $kasbon = $anggarankeluarbiayaperm->kasbon;
        if($kasbon){
            $anggarankeluarbiayaperm->delete();
            $total_biaya=Anggarankeluarbiayaperm::where('kasbon_id',$anggarankeluarbiayaperm->kasbon_id)->sum('jumlah_biaya');
            if($kasbon->status_kasbon === 'wait_approval'){
                $kasbon->update([
                    'jumlah_kasbon' => $total_biaya,
                    'sisa_penggunaan' => $total_biaya - $kasbon->jumlah_penggunaan
                ]);
            }
        }else{
            return Redirect::back()->with('error', 'Hapus data gagal, Jumlah Kasbon tidak boleh kosong.');
        }
        return Redirect::back()->with('success', 'Anggaran Pengeluaran deleted.');
    }
}
