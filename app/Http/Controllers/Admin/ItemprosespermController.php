<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ItemprosespermCollection;
use App\Models\Itemprosesperm;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ItemprosespermController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $itemprosesperms = Itemprosesperm::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $itemprosesperms = $itemprosesperms->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $itemprosesperms = $itemprosesperms->orderBy('id', 'asc');
        }

        $itemprosesperms = $itemprosesperms->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Admin/Itemprosesperm/Index', [
            'filters' => Request::all('search'),
            'itemprosesperms' => ItemprosespermCollection::collection($itemprosesperms),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // collect($itemprosesperms)->map(
        //     function ($r) {
        //         return ['label' => $r, 'value' => $r];
        //     }
        // )


        return Inertia::render(
            'Admin/Itemprosesperm/Create'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'nama_itemprosesperm' => ['required', 'unique:itemprosesperms,nama_itemprosesperm'],
            'permissions' => ['nullable']
        ]);

        $role = Itemprosesperm::create(
            $validated
        );

        return to_route('admin.itemprosesperms.index')->with('success', 'Jenis Permohonan created.');
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
    public function edit(Itemprosesperm $itemprosesperm)
    {
        return Inertia::render('Admin/Itemprosesperm/Edit', [
            'itemprosesperm' => $itemprosesperm,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Itemprosesperm $itemprosesperm)
    {
        $validated =  request()->validate([
            'nama_itemprosesperm' => ['required', Rule::unique(Itemprosesperm::class)->ignore($itemprosesperm->id)],
            'permissions' => ['nullable']
        ]);

        $itemprosesperm->update($validated);

        return to_route('admin.itemprosesperms.index')->with('success', 'Jenis Permohonan Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Itemprosesperm $itemprosesperm)
    {
        $itemprosesperm->delete();
        return Redirect::back()->with('success', 'Jenis Permohonan deleted.');
    }
}
