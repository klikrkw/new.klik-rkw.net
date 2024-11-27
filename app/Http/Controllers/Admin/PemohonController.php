<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PemohonCollection;
use App\Models\Pemohon;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PemohonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pemohons = Pemohon::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $pemohons = $pemohons->orderBy(request('sortBy'), request('sortDir'));
        }
        $pemohons = $pemohons->filter(Request::only('search', 'user_id'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Admin/Pemohon/Index', [
            'filters' => Request::all('search', 'user_id'),
            'pemohons' => PemohonCollection::collection($pemohons),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all();
        $user = auth()->user();
        return Inertia::render('Admin/Pemohon/Create', [
            'users' => collect($users)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id])->toArray(),
            'pemohonUsers' => [['label' => sprintf('%s - %s', $user->name, $user->email), 'value' => $user->id]],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated =  request()->validate([
            'nama_pemohon' => ['required', 'max:50'],
            'email_pemohon' => ['nullable'],
            'alamat_pemohon' => ['required', 'max:200'],
            'telp_pemohon' => ['nullable'],
            'nik_pemohon' => ['required', 'min:16', 'min:16', 'max:16', 'unique:' . Pemohon::class],
            'users' => ['nullable'],
            'active' => ['boolean'],
        ]);
        $user_ids = collect($validated['users'])->map(fn ($r) => $r['value']);
        $pemohon = Pemohon::create(
            $validated
        );
        $pemohon->users()->attach($user_ids);
        return to_route('admin.pemohons.index')->with('success', 'Pemohon created.');
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
    public function edit(Pemohon $pemohon)
    {
        $users = User::all();
        return Inertia::render('Admin/Pemohon/Edit', [
            'pemohon' => $pemohon,
            'pemohonUsers' => collect($pemohon->users)->map(fn ($v, $k) => ["label" => $v["name"] . ' - ' . $v["email"], "value" => $v["id"]])->toArray(),
            'users' => collect($users)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id])->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Pemohon $pemohon)
    {
        $validated =  request()->validate([
            'nama_pemohon' => ['required', 'max:50'],
            'email_pemohon' => ['nullable'],
            'alamat_pemohon' => ['required', 'max:200'],
            'telp_pemohon' => ['nullable'],
            'nik_pemohon' => ['required', 'string', 'min:16', 'max:16', Rule::unique('pemohons', 'nik_pemohon')->ignore($pemohon->id)],
            'users' => ['nullable'],
            'active' => ['boolean'],
        ]);

        $pemohon->update(
            $validated
        );
        $user_ids = collect($validated['users'])->map(fn ($r) => $r['value']);

        $pemohon->users()->sync($user_ids);

        return Redirect::route('admin.pemohons.index')->with('success', 'Pemohon updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pemohon $pemohon)
    {
        $pemohon->delete();
        return Redirect::back()->with('success', 'Pemohon deleted.');
    }
}
