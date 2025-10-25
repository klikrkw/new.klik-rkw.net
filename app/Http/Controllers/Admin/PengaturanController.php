<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PengaturanCollection;
use App\Models\Pengaturan;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PengaturanController extends Controller
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
        $pengaturans = Pengaturan::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $pengaturans = $pengaturans->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $pengaturans = $pengaturans->orderBy('id', 'asc');
        }
        $pengaturans = $pengaturans
            ->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());
            return Inertia::render($this->base_dir.'/Pengaturan/Index', [
            'filters' => Request::all('search'),
            'pengaturans' => PengaturanCollection::collection($pengaturans),
            'isAdmin' =>$this->is_admin,
            'baseRoute' =>$this->base_route,
            'baseDir' =>$this->base_dir,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tipedata_opts = [
            ['value' => 'text', 'label' => 'Text'],
            ['value' => 'number', 'label' => 'Number'],
        ];

        return Inertia::render(
            $this->base_dir.'/Pengaturan/Create',
            [
                'isAdmin' =>$this->is_admin,
                'baseDir' =>$this->base_dir,
                'baseRoute' =>$this->base_route,
                'tipeDataOpts' =>$tipedata_opts,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'nama_pengaturan' => ['required', 'unique:pengaturans,nama_pengaturan'],
            'grup' => ['required'],
            'tipe_data' => ['required'],
            'nilai' => ['required'],
        ]);

        $role = Pengaturan::create(
            $validated
        );

        return to_route($this->base_route .'pengaturans.index')->with('success', 'Pengaturan created.');
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
    public function edit(Pengaturan $pengaturan)
    {
        $tipedata_opts = [
            ['value' => 'text', 'label' => 'Text'],
            ['value' => 'number', 'label' => 'Number'],
        ];

        return Inertia::render(
            $this->base_dir.'/Pengaturan/Edit',
            [
                'isAdmin' =>$this->is_admin,
                'baseDir' =>$this->base_dir,
                'baseRoute' =>$this->base_route,
                'pengaturan' =>$pengaturan,
                'tipedata' =>  collect($tipedata_opts)->filter(function ($v) use ($pengaturan) {
            return $v['value'] == $pengaturan->tipe_data;
            })->first(),
                'tipeDataOpts' =>$tipedata_opts,
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pengaturan $pengaturan)
    {
        $validated =  request()->validate([
            'nama_pengaturan' => ['required', Rule::unique(Pengaturan::class)->ignore($pengaturan->id)],
            'grup' => ['required'],
            'tipe_data' => ['required'],
            'nilai' => ['required'],
        ]);

        $pengaturan->update($validated);

        return to_route($this->base_route .'pengaturans.index')->with('success', 'Pengaturan Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengaturan $pengaturan)
    {
        $pengaturan->delete();
        return Redirect::back()->with('success', 'Pengaturan deleted.');
    }
}
