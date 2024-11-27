<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PostingjurnalCollection;
use App\Models\Akun;
use App\Models\Jurnalumum;
use App\Models\Postingjurnal;
use App\Traits\PeriodetimeTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class PostingjurnalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use PeriodetimeTrait;
    public function index()
    {
        $date1 = Carbon::now();
        // $date2 = Carbon::now();
        $period_opts = $this->getPeriodOpts();
        $period = request('period', 'this_month');
        // $last_day = $date2->daysInMonth;
        $now = Carbon::now();
        $prev = $date1->subDays(7);
        // $prev = $date1->setDay(1);

        if (request()->has(['date1']) && request()->has(['date2'])) {
            $now = Carbon::parse(request('date2'));
            $prev = Carbon::parse(request('date1'));
        }

        $postingjurnals = Postingjurnal::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $postingjurnals = $postingjurnals->orderBy(request('sortBy'), request('sortDir'));
        }
        $postingjurnals = $postingjurnals->filter(Request::only('search','period'))
            ->paginate(10)
            ->appends(Request::all());
        return Inertia::render('Admin/Postingjurnal/Index', [
            'filters' => Request::all('search', 'user_id'),
            'postingjurnals' => PostingjurnalCollection::collection($postingjurnals),
            'periodOpts' => $period_opts,
            'period' => $period,
            'date1' => $prev->format('Y-m-d'),
            'date2' => $now->format('Y-m-d'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $akuns = Akun::all();
        return Inertia::render('Admin/Postingjurnal/Create', [
            'akunOpts' => collect($akuns)->map(fn ($o) => ['label' => $o->nama_akun, 'value' => $o->id])->toArray(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated =  request()->validate([
            'jumlah' => ['required'],
            'akun_debet' => ['required'],
            'akun_kredit' => ['required'],
            'uraian' => ['required'],
            'image' => ['nullable']
        ]);
        $postingjurnal = Postingjurnal::create(
            $validated
        );
        $ju1 = Jurnalumum::create([
            'uraian' => $postingjurnal->uraian,
            'akun_id' => $postingjurnal->akun_debet,
            'debet' => $postingjurnal->jumlah,
            'kredit' => 0,
            'parent_id' => $postingjurnal->id
        ]);
        $ju2 = Jurnalumum::create([
            'uraian' => $postingjurnal->uraian,
            'akun_id' => $postingjurnal->akun_kredit,
            'debet' => 0,
            'kredit' => $postingjurnal->jumlah,
            'parent_id' => $postingjurnal->id
        ]);
        $ids = [$ju1->id, $ju2->id];
        $postingjurnal->jurnalumums()->attach($ids);

        return to_route('admin.transaksi.postingjurnals.index')->with('success', 'Postingjurnal created.');
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
    public function edit(Postingjurnal $postingjurnal)
    {
        $akuns = Akun::all();
        $akundebet = Akun::find($postingjurnal->akun_debet);
        $akunkredit = Akun::find($postingjurnal->akun_kredit);
        return Inertia::render('Admin/Postingjurnal/Edit', [
            'postingjurnal' => $postingjurnal,
            'selAkunDebetOpt' => ['value' => $akundebet->id, 'label' => $akundebet->nama_akun],
            'selAkunKreditOpt' => ['value' => $akunkredit->id, 'label' => $akunkredit->nama_akun],
            'akunOpts' => collect($akuns)->map(fn ($o) => ['label' => $o->nama_akun, 'value' => $o->id])->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Postingjurnal $postingjurnal)
    {
        $validated =  request()->validate([
            'jumlah' => ['required'],
            'akun_debet' => ['required'],
            'akun_kredit' => ['required'],
            'uraian' => ['required'],
            'image' => ['nullable']
        ]);

        $postingjurnal->update(
            $validated
        );

        $ju = $postingjurnal->jurnalumums;
        if (count($ju) > 1) {
            $rec = $ju[0];
            $rec->update([
                'akun_id' => $postingjurnal->akun_debet,
                'uraian' => $postingjurnal->uraian,
                'debet' => $postingjurnal->jumlah,
                'kredit' => 0,
            ]);
            $rec = $ju[1];
            $rec->update([
                'akun_id' => $postingjurnal->akun_kredit,
                'uraian' => $postingjurnal->uraian,
                'debet' => 0,
                'kredit' => $postingjurnal->jumlah,
            ]);
        };

        return Redirect::route('admin.transaksi.postingjurnals.index')->with('success', 'Postingjurnal updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Postingjurnal $postingjurnal)
    {
        $jurnalumums = $postingjurnal->jurnalumums;
        for ($i = 0; $i < count($jurnalumums); $i++) {
            $rec = $jurnalumums[$i];
            $rec->delete();
        }
        $postingjurnal->delete();
        return Redirect::back()->with('success', 'Postingjurnal deleted.');
    }
}
