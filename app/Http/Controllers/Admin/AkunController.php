<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AkunCollection;
use App\Models\Akun;
use App\Models\Kelompokakun;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AkunController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $akuns = Akun::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $akuns = $akuns->orderBy(request('sortBy'), request('sortDir'));
        }
        $akuns = $akuns->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Admin/Akun/Index', [
            'filters' => Request::all('search'),
            'akuns' => AkunCollection::collection($akuns),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kelompokakuns = Kelompokakun::all();
        return Inertia::render('Admin/Akun/Create', [
            'kelompokakuns' => collect($kelompokakuns)->map(fn ($o) => ['label' => $o->nama_kelompokakun, 'value' => $o->id])->toArray(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated =  request()->validate([
            'nama_akun' => ['required', 'unique:akuns,nama_akun'],
            // 'slug' => ['required', 'unique:akuns,slug'],
            'kelompokakun_id' => ['required'],
        ]);
        $akun = Akun::create(
            $validated
        );
        return Redirect::route('admin.akuns.index')->with('success', 'Akun created.');
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
    public function edit(Akun $akun)
    {
        $kelompokakuns = Kelompokakun::all();
        return Inertia::render('Admin/Akun/Edit', [
            'akun' => $akun,
            'kelompokakuns' => collect($kelompokakuns)->map(fn ($o) => ['label' => $o->nama_kelompokakun, 'value' => $o->id])->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Akun $akun)
    {
        $validated =  request()->validate([
            'nama_akun' => ['required', Rule::unique(Akun::class)->ignore($akun->id)],
            // 'slug' => ['required', Rule::unique(Akun::class)->ignore($akun->id)],
            'kelompokakun_id' => ['required'],
        ]);

        $akun->update(
            $validated
        );

        return Redirect::route('admin.akuns.index')->with('success', 'Akun updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Akun $akun)
    {
        $akun->delete();
        return Redirect::back()->with('success', 'Akun deleted.');
    }
}
