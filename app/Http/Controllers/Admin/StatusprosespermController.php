<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\StatusprosespermCollection;
use App\Models\Statusprosesperm;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StatusprosespermController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private static function quickRandom($length = 16)
    {
        $pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        return substr(str_shuffle(str_repeat($pool, 5)), 0, $length);
    }
    public function index()
    {
        $statusprosesperms = Statusprosesperm::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $statusprosesperms = $statusprosesperms->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $statusprosesperms = $statusprosesperms->orderBy('id', 'asc');
        }

        $statusprosesperms = $statusprosesperms->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Admin/Statusprosesperm/Index', [
            'filters' => Request::all('search'),
            'statusprosesperms' => StatusprosespermCollection::collection($statusprosesperms),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // collect($statusprosesperms)->map(
        //     function ($r) {
        //         return ['label' => $r, 'value' => $r];
        //     }
        // )


        return Inertia::render(
            'Admin/Statusprosesperm/Create'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'nama_statusprosesperm' => ['required', 'unique:statusprosesperms,nama_statusprosesperm'],
            'image_statusprosesperm' => ['required', 'image', 'mimes:png,jpg,jpeg,gif', 'max:2048']
        ]);
        if (request()->hasFile('image_statusprosesperm')) {
            $file = request()->file('image_statusprosesperm');
            $name = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $random = $this->quickRandom(8);
            $new_filename = sprintf('%s_%s.%s', substr($name, 0, strpos($name, '.' . $extension)), $random, $extension);
            $file_path = $file->storeAs('images/statusprosesperms', $new_filename, 'public');
            $validated['image_statusprosesperm'] = $file_path;
        }
        Statusprosesperm::create(
            $validated
        );

        return to_route('admin.statusprosesperms.index')->with('success', 'Jenis Permohonan created.');
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
    public function edit(Statusprosesperm $statusprosesperm)
    {
        return Inertia::render('Admin/Statusprosesperm/Edit', [
            'statusprosesperm' => $statusprosesperm,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Statusprosesperm $statusprosesperm)
    {
        $validated =  request()->validate([
            'nama_statusprosesperm' => ['required', Rule::unique(Statusprosesperm::class)->ignore($statusprosesperm->id)],
            'image_statusprosesperm' => ['nullable']
        ]);

        if (request()->hasFile('image_statusprosesperm')) {
            $file = request()->file('image_statusprosesperm');
            $name = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $random = $this->quickRandom(8);
            $new_filename = sprintf('%s_%s.%s', substr($name, 0, strpos($name, '.' . $extension)), $random, $extension);
            Storage::disk('public')->delete(substr($statusprosesperm->image_statusprosesperm, strpos($statusprosesperm->image_statusprosesperm, "/images")));
            // $file_path = Storage::putFileAs('images/statusprosesperms/', $file, $new_filename);
            $file_path = $file->storeAs('images/statusprosesperms', $new_filename, 'public');
            $validated['image_statusprosesperm'] = $file_path;
        }

        $statusprosesperm->update($validated);

        return to_route('admin.statusprosesperms.index')->with('success', 'Jenis Permohonan Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Statusprosesperm $statusprosesperm)
    {
        Storage::disk('public')->delete(substr($statusprosesperm->image_statusprosesperm, strpos($statusprosesperm->image_statusprosesperm, "/images/statusprosesperms")));
        $statusprosesperm->delete();
        return Redirect::back()->with('success', 'Jenis Permohonan deleted.');
    }
}
