<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\KantorCollection;
use App\Models\Kantor;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class KantorController extends Controller
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
        $kantors = Kantor::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $kantors = $kantors->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $kantors = $kantors->orderBy('id', 'asc');
        }

        $kantors = $kantors->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render($this->base_dir.'/Kantor/Index', [
            'filters' => Request::all('search'),
            'kantors' => KantorCollection::collection($kantors),
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
        // collect($kantors)->map(
        //     function ($r) {
        //         return ['label' => $r, 'value' => $r];
        //     }
        // )


        return Inertia::render(
            $this->base_dir.'/Kantor/Create',
            [
                'isAdmin' =>$this->is_admin,
                'baseDir' =>$this->base_dir,
                'baseRoute' =>$this->base_route,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'nama_kantor' => ['required', 'unique:kantors,nama_kantor'],
            'alamat_kantor' => ['required'],
            'image_kantor' => ['nullable'],
        ]);

        $role = Kantor::create(
            $validated
        );

        return to_route($this->base_route .'kantors.index')->with('success', 'Jenis Permohonan created.');
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
    public function edit(Kantor $kantor)
    {
        return Inertia::render($this->base_dir.'/Kantor/Edit', [
            'kantor' => $kantor,
            'baseDir' =>$this->base_dir,
            'baseRoute' =>$this->base_route,
    ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kantor $kantor)
    {
        $validated =  request()->validate([
            'nama_kantor' => ['required', Rule::unique(Kantor::class)->ignore($kantor->id)],
            'alamat_kantor' => ['required'],
            'image_kantor' => ['nullable'],
        ]);

        $kantor->update($validated);

        return to_route($this->base_route .'kantors.index')->with('success', 'Jenis Permohonan Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kantor $kantor)
    {
        $kantor->delete();
        return Redirect::back()->with('success', 'Jenis Permohonan deleted.');
    }
}
