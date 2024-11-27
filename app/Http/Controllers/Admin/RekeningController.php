<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\RekeningCollection;
use App\Models\Akun;
use App\Models\Rekening;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class RekeningController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rekenings = Rekening::query();
        $rekenings = $rekenings->with(['akun']);
        if (request()->has(['sortBy', 'sortDir'])) {
            $rekenings = $rekenings->orderBy(request('sortBy'), request('sortDir'));
        }
        $rekenings = $rekenings->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());
        return Inertia::render('Admin/Rekening/Index', [
            'filters' => Request::all('search'),
            'rekenings' => RekeningCollection::collection($rekenings),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $akuns = Akun::all();
        return Inertia::render('Admin/Rekening/Create', [
            'akunOpts' => collect($akuns)->map(fn ($o) => ['label' => $o->nama_akun, 'value' => $o->id])->toArray(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated =  request()->validate([
            'nama_rekening' => ['required'],
            'ket_rekening' => ['required'],
            'akun_id' => ['required'],
        ]);
        $rekening = Rekening::create(
            $validated
        );
        return to_route('admin.rekenings.index')->with('success', 'Rekening created.');
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
    public function edit(Rekening $rekening)
    {
        $akuns = Akun::all();
        $akun = $rekening->akun;
        return Inertia::render('Admin/Rekening/Edit', [
            'rekening' => $rekening,
            'selAkunOpt' => ['value' => $akun->id, 'label' => $akun->nama_akun],
            'akunOpts' => collect($akuns)->map(fn ($o) => ['label' => $o->nama_akun, 'value' => $o->id])->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Rekening $rekening)
    {
        $validated =  request()->validate([
            'nama_rekening' => ['required'],
            'ket_rekening' => ['required'],
            'akun_id' => ['required'],
        ]);

        $rekening->update(
            $validated
        );

        return Redirect::route('admin.rekenings.index')->with('success', 'Rekening updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rekening $rekening)
    {
        $rekening->delete();
        return Redirect::back()->with('success', 'Rekening deleted.');
    }
}
