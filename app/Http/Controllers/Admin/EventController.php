<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\EventCollection;
use App\Http\Resources\Admin\TranspermohonanCollection;
use App\Models\Event;
use App\Models\Kategorievent;
use App\Traits\PeriodetimeTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Mockery\Undefined;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private $base_route = null;
    private $is_admin = null;
    private $user = null;
    use PeriodetimeTrait;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->base_route = 'staf.';
            $user = request()->user();
            $this->user = $user;
            $role = $user->hasRole('admin');
            $this->is_admin = false;
            if ($role == 'admin') {
                $this->is_admin = true;
                $this->base_route = 'admin.';
            }
            return $next($request);
        });
    }

    public function index()
    {
        $date1 = Carbon::now();
        // $date2 = Carbon::now();
        $period_opts = $this->getPeriodOpts();
        $period = request('period', 'this_month');
        // $last_day = $date2->daysInMonth;
        $now = Carbon::now()->endOfMonth();
        $prev = $date1->now();
        // $prev = $date1->setDay(1);
        $kategorievents = Kategorievent::all();

        if (request()->has(['date1']) && request()->has(['date2'])) {
            $now = Carbon::parse(request('date2'));
            $prev = Carbon::parse(request('date1'));
        }

        $events = Event::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $events = $events->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $events = $events->orderBy('id', 'asc');
        }

        $events = $events->filter(Request::only('search','period','kategorievent_id'))
            ->paginate(10)
            ->appends(Request::all());
        $kategorieventOpts = collect($kategorievents)->map(fn ($o) => ['label' => $o['nama_kategorievent'], 'value' => $o['id']])->toArray();
        $kategorieventOpt = collect($kategorievents)->first(fn (Kategorievent $o) => $o->id == request('kategorievent_id'));
        array_unshift($kategorieventOpts, ['value'=>'','label'=>"All Kategori"]);
        return Inertia::render('Admin/Event/Index', [
            'filters' => Request::all('search'),
            'events' => EventCollection::collection($events),
            'base_route'=>$this->base_route,
            'periodOpts' => $period_opts,
            'period' => $period,
            'date1' => $prev->format('Y-m-d'),
            'date2' => $now->format('Y-m-d'),
            'kategorieventOpts' => $kategorieventOpts,
            'kategorieventOpt' => $kategorieventOpt?['label'=>$kategorieventOpt['nama_kategorievent'], 'value'=>$kategorieventOpt['id']] :null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // collect($events)->map(
        //     function ($r) {
        //         return ['label' => $r, 'value' => $r];
        //     }
        // )

        $kategorievents = Kategorievent::all();

        return Inertia::render(
            'Admin/Event/Create',[
                'base_route'=>$this->base_route,
                'kategorieventOpts' => collect($kategorievents)->map(fn ($o) => ['label' => $o['nama_kategorievent'], 'value' => $o['id']]),
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'start' => ['required'],
            'end' => ['required'],
            'title' => ['required'],
            'kategorievent_id' => ['required'],
            'data' => ['nullable'],
            'transpermohonan_id' => ['nullable'],
        ]);

        $event = Event::create(
            $validated
        );
        $transpermohonan_id = request('transpermohonan_id', null);
        if($transpermohonan_id){
            $event->is_transpermohonan = true;
            $event->save();
            $event->transpermohonans()->attach([$transpermohonan_id]);
        }
        return to_route($this->base_route.'transaksi.events.index')->with('success', 'Event created.');
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
    public function edit(Event $event)
    {
        $kategorievents = Kategorievent::all();
        $transpermohonan = $event->transpermohonans->first();
        // return response()->json( [
        //     'event' => $event,
        //     'base_route'=>$this->base_route,
        //     'kategorieventOpts' => collect($kategorievents)->map(fn ($o) => ['label' => $o['nama_kategorievent'], 'value' => $o['id']]),
        //     'kategorieventOpt' => ["label" => $event->kategorievent->nama_kategorievent, "value" => $event->kategorievent->id],
        //     'transpermohonanOpt' => $transpermohonan?["label" => $transpermohonan->permohonan->nama_penerima, "value" => $transpermohonan->id]:[],
        //     'transpermohonan' =>new TranspermohonanCollection($transpermohonan),
        // ]);

        return Inertia::render('Admin/Event/Edit', [
            'event' => $event,
            'base_route'=>$this->base_route,
            'kategorieventOpts' => collect($kategorievents)->map(fn ($o) => ['label' => $o['nama_kategorievent'], 'value' => $o['id']]),
            'kategorieventOpt' => ["label" => $event->kategorievent->nama_kategorievent, "value" => $event->kategorievent->id],
            'transpermohonanOpt' => $transpermohonan?["label" => $transpermohonan->permohonan->nama_penerima, "value" => $transpermohonan->id]:[],
            'transpermohonan' =>$transpermohonan?new TranspermohonanCollection($transpermohonan):null,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        // $validated =  request()->validate([
        //     'nama_event' => ['required', Rule::unique(Event::class)->ignore($event->id)],
        // ]);

        $validated =  request()->validate([
            'start' => ['required'],
            'end' => ['required'],
            'title' => ['required'],
            'kategorievent_id' => ['required'],
            'data' => ['nullable'],
            'transpermohonan_id' => ['nullable'],
        ]);

        $event->update($validated);
        $transpermohonan_id = request('transpermohonan_id', null);
        if($transpermohonan_id){
            $event->is_transpermohonan = true;
            $event->save();
            $event->transpermohonans()->sync([$transpermohonan_id]);
        }

        return to_route($this->base_route.'transaksi.events.index')->with('success', 'Event Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $event->delete();
        return Redirect::back()->with('success', 'Event deleted.');
    }
}
