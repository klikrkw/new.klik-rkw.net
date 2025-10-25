<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProsespermohonan;
use App\Http\Resources\Admin\ProsespermohonanCollection;
use App\Http\Resources\Admin\TranspermohonanCollection;
use App\Models\Itemprosesperm;
use App\Models\Prosespermohonan;
use App\Models\Statusprosesperm;
use App\Models\Transpermohonan;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use App\Traits\FirebaseTrait;
use Carbon\Carbon;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProsespermohonanStafController extends Controller
{
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
            $permission_name = 'Access All Permohonan - Proses Permohonan';
            $this->all_permohonan = $this->user->hasPermissionTo($permission_name);
            return $next($request);
        });
    }

    public function index()
    {
        $statusprosesperm_id = request('statusprosesperm_id','all');
        if($statusprosesperm_id == 'all'){
            $statusprosesperm_id=null;
        }

        $itemprosespermsOpts = Itemprosesperm::all();
        $statusprosesperms = Statusprosesperm::all()->toArray();
        $itmp_id = count($itemprosespermsOpts)>0?$itemprosespermsOpts[0]->id:'';
        $itemprosesperm_id = request('itemprosesperm_id') ? request('itemprosesperm_id') : $itmp_id;
        // $statusprosesperm_id = request('statusprosesperm_id') ? request('statusprosesperm_id') : null;
        $transpermohonan_id = request('transpermohonan_id') ? request('transpermohonan_id') : null;
        $transpermohonan = Transpermohonan::find(request()->get('transpermohonan_id'));
        $permohonan = null;
        if ($transpermohonan) {
            $permohonan = $transpermohonan->permohonan;
        }
        $prosespermohonans = Prosespermohonan::query();
        $prosespermohonans = $prosespermohonans
            // ->join('transpermohonans', 'prosespermohonans.transpermohonan_id', 'transpermohonans.id')
            // ->join('permohonans', 'transpermohonans.permohonan_id', 'permohonans.id')
            // ->join('jenishaks', 'permohonans.jenishak_id', 'jenishaks.id')
            // ->join('desas', 'permohonans.desa_id', 'desas.id')
            // ->join('kecamatans', 'desas.kecamatan_id', 'kecamatans.id')
            // ->select('transpermohonans.id', 'prosespermohonans.user_id', 'nama_pelepas', 'nama_penerima', 'atas_nama', 'jenishaks.singkatan', 'nomor_hak', 'persil', 'klas', 'luas_tanah', 'nama_desa', 'nama_kecamatan');
            ->with('statusprosesperms', function ($q) {
                $q->where('active', true);
            })
            ->with('itemprosesperm')
            ->with('transpermohonan.jenispermohonan')
            ->with('transpermohonan.permohonan', function ($query) {
                $query->select('id', 'nama_pelepas', 'nama_penerima', 'atas_nama', 'jenishak_id', 'desa_id', 'nomor_hak', 'persil', 'klas', 'luas_tanah')
                    ->with('users:id,name')
                    ->with('jenishak')
                    ->with('desa', function ($query) {
                        $query->select('id', 'nama_desa', 'kecamatan_id')->with('kecamatan:id,nama_kecamatan');
                    });

            });

            $prosespermohonans = $prosespermohonans->whereHas('transpermohonan.permohonan.users',function($q){
                if (request()->has('user_id')) {
                    $q->where('id','=',request('user_id'));
                }else{
                    if(!request()->has('statusprosesperm_id')){
                        $q->where('id','=', $this->user->id);
                    }
                }
            });
            if($itemprosesperm_id){
                $prosespermohonans = $prosespermohonans->where('itemprosesperm_id', $itemprosesperm_id);
            }
        if($statusprosesperm_id){
            $prosespermohonans = $prosespermohonans->whereHas('statusprosesperms', function ($query) use ($statusprosesperm_id) {
                $query->where('statusprosesperm_id', '=', $statusprosesperm_id)
                    ->where('active', '=', true);
            });
        }
        $prosespermohonans = $prosespermohonans->filter(Request::only('transpermohonan_id'));
        $prosespermohonans = $prosespermohonans->orderBy('id', 'desc')->paginate(10)->appends(request()->all());
        $itemprosespermsOpts = collect($itemprosespermsOpts)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_itemprosesperm']]);
        $xstatusprosesperms=['id'=>'all','image_statusprosesperm'=>' /storage/images/statusprosesperms/all_status.png','nama_statusprosesperm'=>'All Status'];
        array_unshift($statusprosesperms, $xstatusprosesperms);
        $user = User::find(request('user_id'));
        $users = User::whereHas('roles', function($q){
            $q->whereIn('name', ['admin','staf']);
        })->get();
        if(!$user){
            $user = $this->user;
        }

        $userOpts = collect($users)->map(fn ($o) => ['label' => $o['name'], 'value' => $o['id']])->toArray();
        array_unshift($userOpts, ['value'=>'','label'=>"All Petugas"]);
        $statusperms=Statusprosesperm::all();
        $statuspermOpts=collect($statusperms)->map(fn ($o) => ['label' => $o['nama_statusprosesperm'], 'value' => $o['id']])->toArray();;

        return Inertia::render('Staf/Prosespermohonan/Index', [
            'itemprosespermsOpts' => $itemprosespermsOpts,
            'prosespermohonans' => $prosespermohonans,
            'itemprosesperm_id' => $itemprosesperm_id,
            'statusprosesperms' => $statusprosesperms,
            'statusprosesperm_id' => request('statusprosesperm_id','all'),
            'permohonan' => $permohonan,
            'transpermohonan_id' => $transpermohonan_id,
            'user' => $user?['value' => $user->id, 'label' => $user->name]:['value' => $this->user->id, 'label' => $this->user->name],
            'user_id' => $user?$this->user->id:null,
            'userOpts' => $userOpts,
            'statuspermOpts' => $statuspermOpts,
            'base_route'=>$this->base_route,
            // 'transpermohonan' => Inertia::lazy(fn () => $transpermohonan),
        ]);
    }

    public function byPermohonan()
    {
        $statusprosesperm_id = request('statusprosesperm_id','all');
        if($statusprosesperm_id == 'all'){
            $statusprosesperm_id=null;
        }

        $itemprosespermsOpts = Itemprosesperm::all();
        $statusprosesperms = Statusprosesperm::all()->toArray();
        $itemprosesperm_id = request('itemprosesperm_id') ? request('itemprosesperm_id') : null;
        // $statusprosesperm_id = request('statusprosesperm_id') ? request('statusprosesperm_id') : null;
        $transpermohonan_id = request('transpermohonan_id') ? request('transpermohonan_id') : null;
        // $transpermohonan = Transpermohonan::find(request()->get('transpermohonan_id'));
        $transpermohonan = Transpermohonan::where('id',request()->get('transpermohonan_id'))
                    ->with('permohonan', function ($query) {
                    $query->select('id', 'nama_pelepas', 'nama_penerima', 'atas_nama', 'jenishak_id', 'desa_id', 'nomor_hak', 'persil', 'klas', 'luas_tanah')
                    ->with('users:id,name', 'jenishak')
                    ->with('desa', function ($query) {
                        $query->select('id', 'nama_desa', 'kecamatan_id')->with('kecamatan:id,nama_kecamatan');
                    });
            })->get()->first();

        $permohonan = null;
        // if ($transpermohonan) {
        //     $permohonan = $transpermohonan->permohonan;
        // }
        $prosespermohonans = Prosespermohonan::query();
        $prosespermohonans = $prosespermohonans
            ->with('itemprosesperm')
            ->with('statusprosesperms', function ($q) {
                $q->where('active', true);
            });
        if($itemprosesperm_id){
            $prosespermohonans = $prosespermohonans->where('itemprosesperm_id', $itemprosesperm_id);
        }
        if($statusprosesperm_id){
            $prosespermohonans = $prosespermohonans->whereHas('statusprosesperms', function ($query) use ($statusprosesperm_id) {
                $query->where('statusprosesperm_id', '=', $statusprosesperm_id)
                    ->where('active', '=', true);
            });
        }
        $prosespermohonans = $prosespermohonans->where('transpermohonan_id', $transpermohonan_id);
        $prosespermohonans = $prosespermohonans->paginate(10)->appends(request()->all());
        $itmproses[] = ['value'=>'','label'=>'All Proses'];
        for ($i=0; $i < count($itemprosespermsOpts); $i++) {
            $item = $itemprosespermsOpts[$i];
            $itmproses[] = ['value'=>$item['id'],'label'=>$item['nama_itemprosesperm']];
        }

        $xstatusprosesperms=['id'=>'all','image_statusprosesperm'=>'/storage/images/statusprosesperms/all_status.png','nama_statusprosesperm'=>'All Status'];
        array_unshift($statusprosesperms, $xstatusprosesperms);

        return Inertia::render('Staf/Prosespermohonan/ByPermohonan', [
            'itemprosespermsOpts' => $itmproses,
            // collect($itemprosespermsOpts)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['nama_itemprosesperm']])->push(['value'=>'','label'=>'Semua Proses']),
            'prosespermohonans' => $prosespermohonans,
            'itemprosesperm_id' => $itemprosesperm_id,
            'statusprosesperms' => $statusprosesperms,
            'statusprosesperm_id' => request('statusprosesperm_id','all'),
            'permohonan' => $permohonan,
            'transpermohonan_id' => $transpermohonan_id,
            'allPermohonan' => $this->all_permohonan,
            'transpermohonan' => $transpermohonan?new TranspermohonanCollection($transpermohonan):null,
        ]);
    }

    public function create()
    {
        $user_id = Auth::id();
        $transpermohonan = null;
        $prosespermohonans = null;
        $itemprosesperms = Itemprosesperm::all();
        $statusprosesperms = Statusprosesperm::all();
        $users = User::whereHas('roles', function($q){
            $q->whereIn('name', ['admin','staf']);
        })->get();

        $userOpts = collect($users)->map(fn ($o) => ['label' => $o['name'], 'value' => $o['id']])->toArray();
        // array_unshift($userOpts, ['value'=>'','label'=>"All Petugas"]);

        if (request()->has('transpermohonan_id')) {
            $rec = Transpermohonan::with('permohonan')->find(request()->get('transpermohonan_id'));

            if ($rec) {
                $transpermohonan = new TranspermohonanCollection($rec);
            }
            if($rec){
                // !$this->all_permohonan &&
                $recp =$transpermohonan->permohonan->whereHas('users', fn($q) => $q->where('id','=',$this->user->id))->first();
                if(!$recp && !$this->all_permohonan){
                    throw new NotFoundHttpException();
                }
            }

            $recs = Prosespermohonan::query();
            $recs = $recs->with('transpermohonan')->with('itemprosesperm')->with('statusprosesperms')->with('user')
                ->where('transpermohonan_id', request('transpermohonan_id'));
            if (request()->has('itemprosesperm_id')) {
                $id = request('itemprosesperm_id');
                $recs = $recs->where(function (Builder $query) use ($id) {
                    $query->where('itemprosesperm_id', $id);
                });
            }
            $recs = $recs->simplePaginate(10)->appends(Request::all());
            //skip(0)->take(100)->get();
            // $rec->appends(Request::all())
            if ($recs) {
                $prosespermohonans = ProsespermohonanCollection::collection($recs);
            }
        }

        $prosesperms = collect($prosespermohonans)->map(function ($prosesperm) use ($user_id) {
            $prosesperm->statusprosesperms->each(
                function ($s) use ($user_id) {
                    $s->canRemove = $s->pivot->user_id == $user_id;
                    $s->user = User::find($s->pivot->user_id);
                    $s->pivot->active = $s->pivot->active==1?true:false;
                    return $s;
                }
            );
            return $prosesperm;
        });
        // dd($prosesperms);
        return Inertia::render('Staf/Prosespermohonan/Create', [
            'transpermohonan' => $transpermohonan,
            'itemprosesperms' => collect($itemprosesperms)->map(fn ($o) => ['label' => $o->nama_itemprosesperm, 'value' => $o->id])->prepend(['value' => null, 'label' => 'Semua Kegiatan'])->toArray(),
            'statusprosesperms' => collect($statusprosesperms)->map(fn ($o) => ['label' => $o->nama_statusprosesperm, 'value' => $o->id])->toArray(),
            'prosespermohonans' => $prosesperms,
            'base_route' => 'staf.',
            'userOpts' => $userOpts,
            // 'transpermohonan' => Inertia::lazy(fn () => $transpermohonan),
        ]);
    }
    public function store(StoreProsespermohonan $request)
    {
        // Rule::unique('prosespermohonans', 'itemprosesperm_id')->where('transpermohonan_id', request('transpermohonan_id'))
        // $validated =  request()->validate([
        //     'transpermohonan_id' => ['required'],
        //     'itemprosesperm_id' => ['required', Rule::unique('prosespermohonans', 'itemprosesperm_id')->where('transpermohonan_id', request('transpermohonan_id'))],
        //     'catatan_prosesperm' => ['nullable'],
        // ]);
        $valid = $request->validated();
        $prosespermohonan = Prosespermohonan::create(
            $valid
        );
        $user = auth()->user();
        $validated = [
            'prosespermohonan_id' => $prosespermohonan->id,
            'statusprosesperm_id' => $valid['statusprosesperm_id'],
            'catatan_statusprosesperm' => $valid['catatan_prosesperm'],
            'user_id' => $user->id,
        ];

        $ids = $prosespermohonan->statusprosesperms()->pluck('statusprosesperm_id');
        if (count($ids) > 0) {
            $prosespermohonan->statusprosesperms()->syncWithPivotValues($ids, ['active' => false]);
        }
        $prosespermohonan->statusprosesperms()->attach($prosespermohonan->id, $validated);

        return redirect()->back()->with('success', 'Proses Permohonan created.');
    }
    public function statuspermStore(Request $request, Prosespermohonan $prosespermohonan)
    {
        $start = Carbon::now();
        $end = Carbon::now();

        $validated =  request()->validate([
            'prosespermohonan_id' => ['required'],
            'statusprosesperm_id' => ['required'],
            'catatan_statusprosesperm' => ['nullable'],
            'user_id' => ['nullable'],
            'is_alert' => 'required|exclude',
            'start' => 'required|exclude',
            'end' => 'required|exclude',
        ]);
        $user = auth()->user();
        $validated['user_id'] = $user->id;
        $prosespermohonan->is_alert = request('is_alert',false);
        $prosespermohonan->start = request('start',$start->format('Y-m-d H:i:s'));
        $prosespermohonan->end = request('end',$end->format('Y-m-d H:i:s'));
        $prosespermohonan->update();

        $prosespermohonan->statusprosesperms()->detach($validated['statusprosesperm_id']);

        $ids = $prosespermohonan->statusprosesperms()->pluck('statusprosesperm_id');
        if (count($ids) > 0) {
            $prosespermohonan->statusprosesperms()->syncWithPivotValues($ids, ['active' => false]);
        }
        $prosespermohonan->statusprosesperms()->attach($validated['prosespermohonan_id'], $validated);

        // $user->roles()->syncWithPivotValues([1, 2, 3], ['active' => true]);
        // $perosespermohonan = Statusprosesperm::create(
        //     $validated
        // );

        return redirect()->back()->with('success', 'Status Proses Permohonan created.');
    }

    public function statuspermDestroy(Prosespermohonan $prosespermohonan, String $id)
    {
        $prosespermohonan->statusprosesperms()->detach($id);
        return Redirect::back()->with('success', 'Status Permohonan deleted.');
    }
}
