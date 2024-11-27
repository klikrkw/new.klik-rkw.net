<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ItemkegiatanCollection;
use App\Models\Akun;
use App\Models\Grupitemkegiatan;
use App\Models\Instansi;
use App\Models\Itemkegiatan;
use App\Models\Itemrincianbiayaperm;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class ItemkegiatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $itemkegiatans = Itemkegiatan::query();
        $itemkegiatans = $itemkegiatans->with(['instansi', 'akun', 'grupitemkegiatans']);
        if (request()->has(['sortBy', 'sortDir'])) {
            $itemkegiatans = $itemkegiatans->orderBy(request('sortBy'), request('sortDir'));
        }
        $itemkegiatans = $itemkegiatans->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());
        return Inertia::render('Admin/Itemkegiatan/Index', [
            'filters' => Request::all('search', 'user_id'),
            'itemkegiatans' => ItemkegiatanCollection::collection($itemkegiatans),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $instansis = Instansi::all();
        $grupitemkegiatans = Grupitemkegiatan::all();
        $itemrincianbiayaperms = Itemrincianbiayaperm::all();
        $akuns = Akun::all();
        return Inertia::render('Admin/Itemkegiatan/Create', [
            'instansiopts' => collect($instansis)->map(fn ($o) => ['label' => $o->nama_instansi, 'value' => $o->id])->toArray(),
            'akunopts' => collect($akuns)->map(fn ($o) => ['label' => $o->nama_akun, 'value' => $o->id])->toArray(),
            'grupitemkegiatanopts' => collect($grupitemkegiatans)->map(fn ($o) => ['label' => $o->nama_grupitemkegiatan, 'value' => $o->id])->toArray(),
            'itemrincianbiayapermOpts' => collect($itemrincianbiayaperms)->map(fn ($o) => ['label' => $o->nama_itemrincianbiayaperm, 'value' => $o->id])->toArray(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'nama_itemkegiatan' => ['required'],
            'instansi_id' => ['required'],
            'akun_id' => ['required'],
            'grupitemkegiatans' => ['nullable'],
            'itemrincianbiayaperms' => ['nullable'],
            'isunique' => ['required'],
            'checkbiaya' => ['required']
        ]);
        $ids = collect($validated['grupitemkegiatans'])->map(fn ($r) => $r['value']);

        $itemkegiatan = Itemkegiatan::create(
            $validated
        );
        $itemkegiatan->grupitemkegiatans()->attach($ids);
        if($validated['checkbiaya']){
            $rincianbya_ids = collect($validated['itemrincianbiayaperms'])->map(fn ($r) => $r['value']);
            $itemkegiatan->itemrincianbiayaperms()->attach($rincianbya_ids);
        }
        return to_route('admin.itemkegiatans.index')->with('success', 'Itemkegiatan created.');
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
    public function edit(Itemkegiatan $itemkegiatan)
    {
        $instansis = Instansi::all();
        $akuns = Akun::all();
        $grupitemkegiatans = Grupitemkegiatan::all();
        $instansi = $itemkegiatan->instansi;
        $akun = $itemkegiatan->akun;
        $itemrincianbiayaperms = Itemrincianbiayaperm::all();
        return Inertia::render('Admin/Itemkegiatan/Edit', [
            'itemkegiatan' => $itemkegiatan,
            'selInstansiOpt' => ['value' => $instansi->id, 'label' => $instansi->nama_instansi],
            'selAkunOpt' => ['value' => $akun->id, 'label' => $akun->nama_akun],
            'selGrupitemkegiatanOpts' => collect($itemkegiatan->grupitemkegiatans)->map(fn ($v, $k) => ["label" => $v["nama_grupitemkegiatan"], "value" => $v["id"]])->toArray(),
            'grupitemkegiatanOpts' => collect($grupitemkegiatans)->map(fn ($v, $k) => ["label" => $v["nama_grupitemkegiatan"], "value" => $v["id"]])->toArray(),
            'instansiOpts' => collect($instansis)->map(fn ($o) => ['label' => $o->nama_instansi, 'value' => $o->id])->toArray(),
            'akunOpts' => collect($akuns)->map(fn ($o) => ['label' => $o->nama_akun, 'value' => $o->id])->toArray(),
            'itemrincianbiayapermOpts' => collect($itemrincianbiayaperms)->map(fn ($o) => ['label' => $o->nama_itemrincianbiayaperm, 'value' => $o->id])->toArray(),
            'selItemrincianbiayapermOpts' => collect($itemkegiatan->itemrincianbiayaperms)->map(fn ($v, $k) => ["label" => $v["nama_itemrincianbiayaperm"], "value" => $v["id"]])->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Itemkegiatan $itemkegiatan)
    {
        $validated =  request()->validate([
            'nama_itemkegiatan' => ['required'],
            'instansi_id' => ['required'],
            'akun_id' => ['required'],
            'grupitemkegiatans' => ['nullable'],
            'itemrincianbiayaperms' => ['nullable'],
            'isunique' => ['required'],
            'checkbiaya' => ['required']
        ]);

        $itemkegiatan->update(
            $validated
        );
        $ids = collect($validated['grupitemkegiatans'])->map(fn ($r) => $r['value']);

        $itemkegiatan->grupitemkegiatans()->sync($ids);

        if($validated['checkbiaya']){
            $rincianbya_ids = collect($validated['itemrincianbiayaperms'])->map(fn ($r) => $r['value']);
            $itemkegiatan->itemrincianbiayaperms()->sync($rincianbya_ids);
        }

        return Redirect::route('admin.itemkegiatans.index')->with('success', 'Itemkegiatan updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Itemkegiatan $itemkegiatan)
    {
        $itemkegiatan->delete();
        return Redirect::back()->with('success', 'Itemkegiatan deleted.');
    }
}
