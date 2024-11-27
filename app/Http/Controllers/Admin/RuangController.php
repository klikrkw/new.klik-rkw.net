<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\RuangCollection;
use App\Models\Kantor;
use App\Models\Ruang;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RuangController extends Controller
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
        $ruangs = Ruang::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $ruangs = $ruangs->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $ruangs = $ruangs->orderBy('id', 'asc');
        }

        $ruangs = $ruangs->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render($this->base_dir.'/Ruang/Index', [
            'filters' => Request::all('search'),
            'ruangs' => RuangCollection::collection($ruangs),
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
        $kantors = Kantor::all();
        return Inertia::render(
            $this->base_dir.'/Ruang/Create',
            [
                'isAdmin' =>$this->is_admin,
                'baseDir' =>$this->base_dir,
                'baseRoute' =>$this->base_route,
                'kantorOpts' => collect($kantors)->map(fn ($o) => ['label' => $o['nama_kantor'], 'value' => $o['id']]),
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'nama_ruang' => ['required', 'unique:ruangs,nama_ruang'],
            'kantor_id' => ['required'],
            // 'kode_ruang' => ['required'],
            'image_ruang' => ['nullable'],
        ]);

        $role = Ruang::create(
            $validated
        );

        return to_route($this->base_route .'ruangs.index')->with('success', 'Ruang created.');
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
    public function edit(Ruang $ruang)
    {
        $kantors = Kantor::all();
        return Inertia::render($this->base_dir.'/Ruang/Edit', [
            'ruang' => $ruang,
            'selKantorOpt' => ['value' => $ruang->kantor_id, 'label' => $ruang->kantor->nama_kantor],
            'baseDir' =>$this->base_dir,
            'baseRoute' =>$this->base_route,
            'kantorOpts' => collect($kantors)->map(fn ($o) => ['label' => $o['nama_kantor'], 'value' => $o['id']]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ruang $ruang)
    {
        $validated =  request()->validate([
            'nama_ruang' => ['required', Rule::unique(Ruang::class)->ignore($ruang->id)],
            'kantor_id' => ['required'],
            // 'kode_ruang' => ['required'],
            'image_ruang' => ['nullable'],
        ]);

        $ruang->update($validated);

        return to_route($this->base_route .'ruangs.index')->with('success', 'Ruang Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ruang $ruang)
    {
        $ruang->delete();
        return Redirect::back()->with('success', 'Ruang deleted.');
    }
}
