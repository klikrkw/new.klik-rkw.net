<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\BiayapermCollection;
use App\Http\Resources\Admin\PermohonanCollection;
use App\Models\Bayarbiayaperm;
use App\Models\Biayaperm;
use App\Models\Itemkegiatan;
use App\Models\Metodebayar;
use App\Models\Permohonan;
use App\Models\Prosespermohonan;
use App\Models\Rekening;
use App\Models\Transpermohonan;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class BiayapermStafController extends Controller
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
        $rekenings = Rekening::all();

        if (request()->has('permohonan_id')) {
            $rec = Permohonan::with('users')->find(request()->get('permohonan_id'));

            if ($rec) {
                $permohonan = new PermohonanCollection($rec);
                $recp =$rec->where('id',request()->get('permohonan_id'))->whereHas('users', fn($q)=>$q->where('id',$this->user->id))->first();
                if(!$recp && !$this->all_permohonan){
                    //&& !$this->all_permohonan
                    throw new NotFoundHttpException();
                }

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

                // $transpermohonan = Transpermohonan::find($transpermohonan_id);
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
        }
        // $biayaperms = collect($biayaperms)->map(function ($prosesperm) {
        //     $prosesperm->statusbiayaperms->each(fn ($s) => $s->user = User::find($s->pivot->user_id));
        //     return $prosesperm;
        // });
        return Inertia::render('Staf/Biayaperm/Create', [
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
            'base_route'=>'staf.',
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
            'image_biayaperm' => ['nullable']
        ]);

        $biayaperm = Biayaperm::create(
            $validated
        );
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
            'catatan_biayaperm' => ['nullable'],
            'image_biayaperm' => ['nullable']
        ]);

        $biayaperm->update(
            $validated
        );
        return redirect()->back()->with('success', 'Biaya permohonan updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Biayaperm $biayaperm)
    {
        $bayarbiayaperm = Bayarbiayaperm::where('biayaperm_id', $biayaperm->id)->first();
        if ($bayarbiayaperm) {
            return Redirect::back()->with('error', 'Biaya Permohonan tidak bisa dihapus.');
        }

        $biayaperm->delete();
        return Redirect::back()->with('success', 'Biaya Permohonan deleted.');
    }
}
