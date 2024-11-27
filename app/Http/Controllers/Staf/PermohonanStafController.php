<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PermohonanCollection;
use App\Http\Resources\Admin\PermohonanListResource;
use App\Http\Resources\Admin\TranspermohonanCollection;
use App\Models\Desa;
use App\Models\Fieldcatatan;
use App\Models\Itemprosesperm;
use App\Models\Jenishak;
use App\Models\Jenispermohonan;
use App\Models\Permohonan;
use App\Models\Transpermohonan;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class PermohonanStafController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private $base_route = null;
    private $is_admin = null;
    private $user = null;
    private $base_dir = null;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->base_route = 'staf.';
            $this->base_dir = 'Staf';
            $user = request()->user();
            $this->user = $user;
            $role = $user->hasRole('admin');
            $this->is_admin = false;
            if ($role == 'admin') {
                $this->is_admin = true;
                $this->base_route = 'admin.';
                $this->base_dir = 'Admin';
            }
            return $next($request);
        });
    }

     public function index()
    {
        $users = User::whereHas('roles', function($q){
            $q->whereIn('name', ['admin','staf']);
        })->get();
        $userOpts = collect($users)->map(fn ($o) => ['label' => $o['name'], 'value' => $o['id']])->toArray();
        array_unshift($userOpts, ['value'=>'','label'=>"All Petugas"]);

        $jenishaks = collect(Jenishak::all())->map(fn ($v) => ['label' => $v->nama_jenishak, 'value' => $v->id]);
        $jenispermohonans = collect(Jenispermohonan::all())->map(fn ($v) => ['label' => $v->nama_jenispermohonan, 'value' => $v->id]);
        $date1 = Carbon::now();
        $date2 = Carbon::now();
        $last_day = $date2->daysInMonth;
        $now = $date2->setDay($last_day);
        $prev = $date1->subMonths(6);
        $prev = $date1->setDay(1);
        $permohonans = Permohonan::query();
        if (request()->has(['inactive'])) {
            $permohonans = $permohonans->where('active', '=', !request()->boolean('inactive', false));
        } else {
            $permohonans = $permohonans->where('active', '=', true);
        }
        if (request()->has(['date1']) && request()->has(['date2'])) {
            $now = Carbon::parse(request('date2'));
            $last_day = $now->daysInMonth;
            $now = $now->setDay($last_day);
            $prev = Carbon::parse(request('date1'));
            $prev = $prev->setDay(1);
        }
        $permohonans = $permohonans->whereBetween('created_at', [$prev->format('Y-m-d'), $now->format('Y-m-d')]);

        if (request()->has(['sortBy', 'sortDir'])) {
            $permohonans = $permohonans->orderBy(request('sortBy'), request('sortDir'));
        }

        $permohonans = $permohonans->with('jenishak')->with('desa')->with('users')->filter(Request::only('search', 'user_id', 'desa_id', 'jenishak_id', 'jenis_tanah', 'jenispermohonan_id', 'search_key'))
            ->paginate(10)
            ->appends(Request::all());

        $desa = null;
        if (request()->has(['desa_id'])) {
            $desa = Desa::with('kecamatan')->find(request::get("desa_id"));
        }

        return Inertia::render('Staf/Permohonan/Index', [
            'filters' => Request::all('search', 'user_id', 'jenishak_id', 'jenis_tanah', 'jenispermohonan_id', 'desa_id'),
            'jenishaks' => $jenishaks,
            'inactive' => request()->boolean("inactive", true),
            'jenispermohonans' => $jenispermohonans,
            'jenistanahs' => array(['label' => 'Pertanian', 'value' => 'pertanian'], ['label' => 'Non Pertanian', 'value' => 'non_pertanian']),
            'permohonans' => PermohonanCollection::collection($permohonans),
            'desa' => $desa ? [['label' => $desa->nama_desa . " - " . $desa->kecamatan->nama_kecamatan, 'value' => $desa->id]] : null,
            'date1' => $prev->format('Y-m-d'),
            'date2' => $now->format('Y-m-d'),
            'userOpts' => $userOpts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::whereHas('roles', function($q){
            $q->whereIn('name', ['admin','staf']);
        })->get();
        $userOpts = collect($users)->map(fn ($o) => ['label' => $o['name'], 'value' => $o['id']])->toArray();
        // array_unshift($userOpts, ['value'=>'','label'=>"All Petugas"]);

        $jenishaks = Jenishak::all();
        $jenispermohonans = Jenispermohonan::orderBy('id')->get();
        $user = auth()->user();
        return Inertia::render('Staf/Permohonan/Create', [
            // 'users' => collect($users)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id])->toArray(),
            'permohonanUsers' => [['label' => $user->name, 'value' => $user->id]],
            'jenishaks' => collect($jenishaks)->map(fn ($o) => ['label' => $o->nama_jenishak, 'value' => $o->id])->toArray(),
            'jenispermohonans' => collect($jenispermohonans)->map(fn ($o, $i) => ['label' => $o->nama_jenispermohonan, 'value' => $o->id, 'active' => $i === 0 ? true : false])->toArray(),
            'userOpts' => $userOpts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated =  request()->validate([
            'jenishak_id' => ['required'],
            'nomor_hak' => ['required'],
            'persil' => ['nullable'],
            'klas' => ['nullable'],
            'bidang' => ['required'],
            'luas_tanah' => ['required'],
            'atas_nama' => ['required'],
            'nama_pelepas' => ['required'],
            'nama_penerima' => ['required'],
            'jenis_tanah' => ['required'],
            'desa_id' => ['required'],
            'bidang' => ['required'],
            'active' => ['boolean'],
            'users' => ['nullable'],
            'jenispermohonans' => ['required'],
            'kode_unik' => ['required', 'string', 'unique:' . Permohonan::class],
        ]);
        $user_ids = collect($validated['users'])->map(fn ($r) => $r['value']);

        $jenispermohonans = [];
        $isActive = 0;
        for ($i = 0; $i < count($validated['jenispermohonans']); $i++) {
            $elm = $validated['jenispermohonans'][$i];
            array_push($jenispermohonans, ['jenispermohonan_id' => $elm['value'], 'active' => $elm['active'],
            'nomor_haktp'=> $validated['nomor_hak'],
            'atas_namatp'=> $validated['atas_nama'],
            'luas_tanahtp'=> $validated['luas_tanah'],
        ]);
            if($elm['active']=='true'){
                $isActive +=1;
            }
        }
        if($isActive == 0){
            throw ValidationException::withMessages(['jenispermohonans' => 'minimal satu jenis permohonan dipilih']);
        }

        $permohonan = Permohonan::create(
            $validated
        );
        $permohonan->users()->attach($user_ids);
        $permohonan->transpermohonans()->createMany($jenispermohonans);

        // if (count($jenispermohonan_ids) > 0) {
        //     $permohonan->jenispermohonans()->sync($jenispermohonan_ids);
        // }

        return to_route('staf.permohonans.index')->with('success', 'Permohonan created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $permohonans = Permohonan::query();
        // $permohonans = $permohonans->whereHas('transpermohonans', function (Builder $query) {
        //     $query->where('active', '=', true);
        // });
        $is_staf = request('is_staf');
        $permohonans = $permohonans->where('id',$id)->whereRelation('transpermohonans', 'active', true);
        $permohonans = $permohonans->orderBy('permohonans.id', 'asc');
        if ($is_staf == 'true') {
            $permohonans = $permohonans->whereRelation('users', 'id', auth()->id());
        }
        $permohonans = $permohonans->with('jenishak')->with('desa')->with('users')->filter(Request::only('search', 'nodaftar_permohonan', 'nama_pelepas', 'nama_penerima', 'nomor_hak'))
            ->get();
        return Response()->json(PermohonanListResource::collection($permohonans));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permohonan $permohonan)
    {
        $jenishaks = Jenishak::all();
        $jenispermohonans = Jenispermohonan::all();
        $users = User::whereHas('roles', function($q){
            $q->whereIn('name', ['admin','staf']);
        })->get();
        $userOpts = collect($users)->map(fn ($o) => ['label' => $o['name'], 'value' => $o['id']])->toArray();
        $transpermohonan = $permohonan->transpermohonan();
        $fieldcatatans = Fieldcatatan::all();

        return Inertia::render('Staf/Permohonan/Edit', [
            'permohonan' => $permohonan,
            'permohonanUsers' => collect($permohonan->users)->map(fn ($v, $k) => ["label" => $v["name"], "value" => $v["id"]])->toArray(),
            'permohonanJenispermohonans' => collect($permohonan->transpermohonans)->map(fn ($v, $k) => [
                "label" => $v['jenispermohonan']["nama_jenispermohonan"], "value" => $v["id"],
                "active" => $v['active'],
                'isFixed' => true
            ])->toArray(),
            'jenishak' => ["label" => $permohonan->jenishak->nama_jenishak, "value" => $permohonan->jenishak->id],
            'jenishaks' => collect($jenishaks)->map(fn ($o) => ['label' => $o->nama_jenishak, 'value' => $o->id])->toArray(),
            'jenispermohonans' => collect($jenispermohonans)->map(fn ($o, $i) => ['label' => $o->nama_jenispermohonan, 'value' => $o->id, 'active' => false, 'isFixed' => false])->toArray(),
            'desa' => ["label" => $permohonan->desa->nama_desa . ' - ' . $permohonan->desa->kecamatan->nama_kecamatan, "value" => $permohonan->desa->id],
            'userOpts' => $userOpts,
            'fieldcatatanOpts' => collect($fieldcatatans)->map(fn ($v, $k) => [
                "label" => $v["nama_fieldcatatan"], "value" => $v["id"],
            ])->toArray(),
            'transpermohonan_id'=>$transpermohonan?$transpermohonan->id:null,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Permohonan $permohonan)
    {
        $validated =  request()->validate([
            'jenishak_id' => ['required'],
            'nomor_hak' => ['required'],
            'persil' => ['nullable'],
            'klas' => ['nullable'],
            'bidang' => ['required'],
            'luas_tanah' => ['required'],
            'atas_nama' => ['required'],
            'nama_pelepas' => ['required'],
            'nama_penerima' => ['required'],
            'jenis_tanah' => ['required'],
            'desa_id' => ['required'],
            'bidang' => ['required'],
            'active' => ['boolean'],
            'users' => ['nullable'],
            'jenispermohonans' => ['required'],
            'kode_unik' => ['nullable'],
        ]);
        $permohonan->update(
            $validated
        );
        $user_ids = collect($validated['users'])->map(fn ($r) => $r['value']);

        $jenispermohonans = [];
        $valjnsperms = $validated['jenispermohonans'];
        for ($i = 0; $i < count($permohonan->transpermohonans); $i++) {
            $elm = $validated['jenispermohonans'][$i];
            // array_push($jenispermohonans, ['jenispermohonan_id' => $elm['value'], 'active' => $elm['active']]);
            $permohonan->transpermohonans[$i]->active = $elm['active'];
            if($elm['active'] == 1){
                $permohonan->transpermohonans[$i]->atas_namatp = $validated['atas_nama'];
                $permohonan->transpermohonans[$i]->nomor_haktp = $validated['nomor_hak'];
                $permohonan->transpermohonans[$i]->luas_tanahtp = $validated['luas_tanah'];
            }
        }
        collect($valjnsperms)->each(function ($elm) use ($permohonan, $validated) {
            if (!$elm['isFixed']) {
                $permohonan->transpermohonans()->create(['jenispermohonan_id' => $elm['value'], 'active' => $elm['active'],
                'nomor_haktp'=> $validated['nomor_hak'],
                'atas_namatp'=> $validated['atas_nama'],
                'luas_tanahtp'=> $validated['luas_tanah'],
            ]);
            }
        });

        $permohonan->push();

        $permohonan->users()->sync($user_ids);

        // if (count($jenispermohonans) > 0) {

        // }

        return Redirect::route('staf.permohonans.index')->with('success', 'Permohonan updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permohonan $permohonan)
    {
        $permohonan->delete();
        return Redirect::back()->with('success', 'Permohonan deleted.');
    }

    public function List(Request $request)
    {
        $permohonans = Permohonan::query();
        // $permohonans = $permohonans->whereHas('transpermohonans', function (Builder $query) {
        //     $query->where('active', '=', true);
        // });
        $is_staf = request('is_staf');
        $permohonans = $permohonans->whereRelation('transpermohonans', 'active', true);
        $permohonans = $permohonans->orderBy('permohonans.id', 'asc');
        if ($is_staf == 'true') {
            $permohonans = $permohonans->whereRelation('users', 'id', auth()->id());
        }
        $permohonans = $permohonans->with('jenishak')->with('desa')->with('users')->filter(Request::only('search', 'nodaftar_permohonan', 'nama_pelepas', 'nama_penerima', 'nomor_hak'))
            ->skip(0)->take(10)->get();
        return Response()->json(PermohonanListResource::collection($permohonans));
    }

    public function modalCreate()
    {
        session()->reflash();

        $jenishaks = Jenishak::all();
        $jenispermohonans = Jenispermohonan::orderBy('id')->get();
        // $users = User::all();
        $user = auth()->user();
        $users = User::whereHas('roles', function($q){
            $q->whereIn('name', ['admin','staf']);
        })->get();
        $userOpts = collect($users)->map(fn ($o) => ['label' => $o['name'], 'value' => $o['id']])->toArray();

        return Inertia::render('Staf/Permohonan/Modal/Create', [
            // 'users' => collect($users)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id])->toArray(),
            'permohonanUsers' => [['label' => $user->name, 'value' => $user->id]],
            'jenishaks' => collect($jenishaks)->map(fn ($o) => ['label' => $o->nama_jenishak, 'value' => $o->id])->toArray(),
            'jenispermohonans' => collect($jenispermohonans)->map(fn ($o, $i) => ['label' => $o->nama_jenispermohonan, 'value' => $o->id, 'active' => $i === 0 ? true : false])->toArray(),
            'permohonan_id'=>session('permohonan_id',null),
            'userOpts' => $userOpts,
        ]);
    }
    public function modalStore(Request $request)
    {

        $validated =  request()->validate([
            'jenishak_id' => ['required'],
            'nomor_hak' => ['required'],
            'persil' => ['nullable'],
            'klas' => ['nullable'],
            'bidang' => ['required'],
            'luas_tanah' => ['required'],
            'atas_nama' => ['required'],
            'nama_pelepas' => ['required'],
            'nama_penerima' => ['required'],
            'jenis_tanah' => ['required'],
            'desa_id' => ['required'],
            'bidang' => ['required'],
            'active' => ['boolean'],
            'users' => ['nullable'],
            'jenispermohonans' => ['required'],
            'kode_unik' => ['required', 'string', 'unique:' . Permohonan::class],
        ]);
        $user_ids = collect($validated['users'])->map(fn ($r) => $r['value']);

        $jenispermohonans = [];
        $isActive = 0;
        for ($i = 0; $i < count($validated['jenispermohonans']); $i++) {
            $elm = $validated['jenispermohonans'][$i];
            array_push($jenispermohonans, ['jenispermohonan_id' => $elm['value'], 'active' => $elm['active'],
            'nomor_haktp'=> $validated['nomor_hak'],
            'atas_namatp'=> $validated['atas_nama'],
            'luas_tanahtp'=> $validated['luas_tanah'],
        ]);
            if($elm['active']=='true'){
                $isActive +=1;
            }
        }
        if($isActive == 0){
            throw ValidationException::withMessages(['jenispermohonans' => 'minimal satu jenis permohonan dipilih']);
        }

        $permohonan = Permohonan::create(
            $validated
        );
        $permohonan->users()->attach($user_ids);
        $permohonan->transpermohonans()->createMany($jenispermohonans);

        //bukan
        // return response()->json(['transpermohonan'=>'transpermohonan data','success'=>true]);
        return to_route('staf.permohonans.modal.create')->with('closedialog', $permohonan->id);
    }
    public function modalEdit(Permohonan $permohonan)
    {
        $jenishaks = Jenishak::all();
        $jenispermohonans = Jenispermohonan::all();
        $user = auth()->user();
        $users = User::whereHas('roles', function($q){
            $q->whereIn('name', ['admin','staf']);
        })->get();
        $userOpts = collect($users)->map(fn ($o) => ['label' => $o['name'], 'value' => $o['id']])->toArray();
        $transpermohonan = $permohonan->transpermohonan();
        $fieldcatatans = Fieldcatatan::all();

        return Inertia::render('Staf/Permohonan/Modal/Edit', [
            'permohonan' => $permohonan,
            'permohonanUsers' => collect($permohonan->users)->map(fn ($v, $k) => ["label" => $v["name"], "value" => $v["id"]])->toArray(),
            'permohonanJenispermohonans' => collect($permohonan->transpermohonans)->map(fn ($v, $k) => [
                "label" => $v['jenispermohonan']["nama_jenispermohonan"], "value" => $v["id"],
                "active" => $v['active'],
                'isFixed' => true
            ])->toArray(),
            'jenishak' => ["label" => $permohonan->jenishak->nama_jenishak, "value" => $permohonan->jenishak->id],
            // 'users' => collect($users)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id])->toArray(),
            'jenishaks' => collect($jenishaks)->map(fn ($o) => ['label' => $o->nama_jenishak, 'value' => $o->id])->toArray(),
            'jenispermohonans' => collect($jenispermohonans)->map(fn ($o, $i) => ['label' => $o->nama_jenispermohonan, 'value' => $o->id, 'active' => false, 'isFixed' => false])->toArray(),
            'desa' => ["label" => $permohonan->desa->nama_desa . ' - ' . $permohonan->desa->kecamatan->nama_kecamatan, "value" => $permohonan->desa->id],
            'userOpts' => $userOpts,
            'fieldcatatanOpts' => collect($fieldcatatans)->map(fn ($v, $k) => [
                "label" => $v["nama_fieldcatatan"], "value" => $v["id"],
            ])->toArray(),
            'transpermohonan_id'=>$transpermohonan?$transpermohonan->id:null,
        ]);
    }
    public function modalUpdate(Permohonan $permohonan)
    {
        $validated =  request()->validate([
            'jenishak_id' => ['required'],
            'nomor_hak' => ['required'],
            'persil' => ['nullable'],
            'klas' => ['nullable'],
            'bidang' => ['required'],
            'luas_tanah' => ['required'],
            'atas_nama' => ['required'],
            'nama_pelepas' => ['required'],
            'nama_penerima' => ['required'],
            'jenis_tanah' => ['required'],
            'desa_id' => ['required'],
            'bidang' => ['required'],
            'active' => ['boolean'],
            'users' => ['nullable'],
            'jenispermohonans' => ['required'],
            'kode_unik' => ['nullable'],
        ]);
        $permohonan->update(
            $validated
        );
        $user_ids = collect($validated['users'])->map(fn ($r) => $r['value']);

        $jenispermohonans = [];
        $valjnsperms = $validated['jenispermohonans'];
        for ($i = 0; $i < count($permohonan->transpermohonans); $i++) {
            $elm = $validated['jenispermohonans'][$i];
            // array_push($jenispermohonans, ['jenispermohonan_id' => $elm['value'], 'active' => $elm['active']]);
            $permohonan->transpermohonans[$i]->active = $elm['active'];
            if($elm['active'] == 1){
                $permohonan->transpermohonans[$i]->atas_namatp = $validated['atas_nama'];
                $permohonan->transpermohonans[$i]->nomor_haktp = $validated['nomor_hak'];
                $permohonan->transpermohonans[$i]->luas_tanahtp = $validated['luas_tanah'];
            }
        }
        collect($valjnsperms)->each(function ($elm) use ($permohonan, $validated) {
            if (!$elm['isFixed']) {
                $permohonan->transpermohonans()->create(['jenispermohonan_id' => $elm['value'], 'active' => $elm['active'],
                'nomor_haktp'=> $validated['nomor_hak'],
                'atas_namatp'=> $validated['atas_nama'],
                'luas_tanahtp'=> $validated['luas_tanah'],
            ]);
            }
        });

        $permohonan->push();

        $permohonan->users()->sync($user_ids);

        // if (count($jenispermohonans) > 0) {

        // }

        return Redirect::route('staf.permohonans.modal.edit',$permohonan->id)->with('success', 'Permohonan updated.');
    }

    public function createQrcode()
    {
        $transpermohonan_id = request('transpermohonan_id');
        $transpermohonan = null;
        if($transpermohonan_id){
            $transpermohonan = Transpermohonan::findOrFail($transpermohonan_id);
        }
        // $permohonan = $transpermohonan->permohonan;
        return Inertia::render($this->base_dir.'/Permohonan/Qrcode/Create', [
            'transpermohonan' => $transpermohonan ?new TranspermohonanCollection($transpermohonan):null,
            'base_route' =>$this->base_route,
        ]);
    }

    public function cetakQrcode(Transpermohonan $transpermohonan)
    {
        $row = request('row',1);
        $col = request('col',1);
        QrCode::format('png')->size(300)->generate($transpermohonan->id, public_path('qrcode_pmh.png'));
        $data = [
            'qrcode' => 'qrcode_pmh.png',
            'row'=>$row,
            'col'=>$col,
            'row_count'=>6,
            'col_count'=>5,
        ];
        $pdf = Pdf::loadView('pdf.cetakQrcode', $data)->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
        return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
    }
    public function cetakLabelberkas(Transpermohonan $transpermohonan)
    {
        // $transpermohonan = $transpermohonan->with(['permohonan.jenishak','permohonan.desa'])->first();

        QrCode::format('png')->size(300)->generate($transpermohonan->id, public_path('qrcodelabel.png'));
        $permission_name = "Access All Permohonan - Biaya Permohonan";

        $biayaperms = [];
        $dkeluarbiayapermusers = [];
        $total_pengeluaran=null;
        if($this->user->hasPermissionTo($permission_name)){
            $biayaperms = $transpermohonan->biayaperms;
            $dkeluarbiayapermusers = $transpermohonan->dkeluarbiayapermusers->take(10);
            $total_pengeluaran = $transpermohonan->dkeluarbiayapermusers->sum('jumlah_biaya');
        }
        $itemprosesperms=[];
        $itemprosesperms = Itemprosesperm::all();
        $data = [
            'qrcode' => 'qrcodelabel.png',
            'transpermohonan'=>$transpermohonan,
            'biayaperms'=>$biayaperms,
            'dkeluarbiayapermusers'=>$dkeluarbiayapermusers,
            'total_pengeluaran'=>$total_pengeluaran,
            'itemprosesperms'=>$itemprosesperms,
        ];
        $pdf = Pdf::loadView('pdf.cetakLabelberkas', $data)->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
        return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
    }
}
