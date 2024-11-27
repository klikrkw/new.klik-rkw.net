<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ItemrincianbiayapermCollection;
use App\Models\Itemrincianbiayaperm;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Request;


class ItemrincianbiayapermController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $itemrincianbiayaperms = Itemrincianbiayaperm::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $itemrincianbiayaperms = $itemrincianbiayaperms->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $itemrincianbiayaperms = $itemrincianbiayaperms->orderBy('id', 'asc');
        }

        $itemrincianbiayaperms = $itemrincianbiayaperms->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Admin/Itemrincianbiayaperm/Index', [
            'filters' => Request::all('search'),
            'itemrincianbiayaperms' => ItemrincianbiayapermCollection::collection($itemrincianbiayaperms),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // collect($itemrincianbiayaperms)->map(
        //     function ($r) {
        //         return ['label' => $r, 'value' => $r];
        //     }
        // )

        $jenisitemrincianbiayaOpts = [['value'=>'pemasukan', 'label'=>'Pemasukan'], ['value'=>'pengeluaran', 'label'=>'Pengeluaran'], ['value'=>'piutang', 'label'=>'Piutang']];

        return Inertia::render(
            'Admin/Itemrincianbiayaperm/Create',['jenisitemrincianbiayapermOpts' => $jenisitemrincianbiayaOpts]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'nama_itemrincianbiayaperm' => ['required', 'unique:itemrincianbiayaperms,nama_itemrincianbiayaperm'],
            'min_value' => ['required'],
            'jenis_itemrincianbiayaperm' => ['required'],
            'command_itemrincianbiayaperm' => ['nullable'],
        ]);

        $role = Itemrincianbiayaperm::create(
            $validated
        );

        return to_route('admin.itemrincianbiayaperms.index')->with('success', 'Item rincian biaya created.');
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
    public function edit(Itemrincianbiayaperm $itemrincianbiayaperm)
    {
        $jenisitemrincianbiayaOpts = [['value'=>'pemasukan', 'label'=>'Pemasukan'], ['value'=>'pengeluaran', 'label'=>'Pengeluaran'],['value'=>'piutang', 'label'=>'Piutang']];
        return Inertia::render('Admin/Itemrincianbiayaperm/Edit', [
            'itemrincianbiayaperm' => $itemrincianbiayaperm,
            'jenisitemrincianbiayapermOpts' => $jenisitemrincianbiayaOpts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Itemrincianbiayaperm $itemrincianbiayaperm)
    {
        $validated =  request()->validate([
            'nama_itemrincianbiayaperm' => ['required', Rule::unique(Itemrincianbiayaperm::class)->ignore($itemrincianbiayaperm->id)],
            'min_value' => ['required'],
            'command_itemrincianbiayaperm' => ['nullable'],
            'jenis_itemrincianbiayaperm' => ['required'],
        ]);

        $itemrincianbiayaperm->update($validated);

        return to_route('admin.itemrincianbiayaperms.index')->with('success', 'Item rincian biaya Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Itemrincianbiayaperm $itemrincianbiayaperm)
    {
        $itemrincianbiayaperm->delete();
        return Redirect::back()->with('success', 'Item rincian biaya deleted.');
    }
}
