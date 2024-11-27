<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\JenispermohonanCollection;
use App\Models\Jenispermohonan;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class JenispermohonanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jenispermohonans = Jenispermohonan::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $jenispermohonans = $jenispermohonans->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $jenispermohonans = $jenispermohonans->orderBy('id', 'asc');
        }

        $jenispermohonans = $jenispermohonans->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Admin/Jenispermohonan/Index', [
            'filters' => Request::all('search'),
            'jenispermohonans' => JenispermohonanCollection::collection($jenispermohonans),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // collect($jenispermohonans)->map(
        //     function ($r) {
        //         return ['label' => $r, 'value' => $r];
        //     }
        // )


        return Inertia::render(
            'Admin/Jenispermohonan/Create'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'nama_jenispermohonan' => ['required', 'unique:jenispermohonans,nama_jenispermohonan'],
        ]);

        $role = Jenispermohonan::create(
            $validated
        );

        return to_route('admin.jenispermohonans.index')->with('success', 'Jenis Permohonan created.');
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
    public function edit(Jenispermohonan $jenispermohonan)
    {
        return Inertia::render('Admin/Jenispermohonan/Edit', [
            'jenispermohonan' => $jenispermohonan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Jenispermohonan $jenispermohonan)
    {
        $validated =  request()->validate([
            'nama_jenispermohonan' => ['required', Rule::unique(Jenispermohonan::class)->ignore($jenispermohonan->id)],
        ]);

        $jenispermohonan->update($validated);

        return to_route('admin.jenispermohonans.index')->with('success', 'Jenis Permohonan Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jenispermohonan $jenispermohonan)
    {
        $jenispermohonan->delete();
        return Redirect::back()->with('success', 'Jenis Permohonan deleted.');
    }
}
