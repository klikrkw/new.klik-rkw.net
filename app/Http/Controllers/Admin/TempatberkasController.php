<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PosisiberkasCollection;
use App\Http\Resources\Admin\TempatberkasCollection;
use App\Models\Jenistempatarsip;
use App\Models\Posisiberkas;
use App\Models\Ruang;
use App\Models\Tempatberkas;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TempatberkasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private $base_route = null;
    private $is_admin = null;
    private $user = null;
    private $base_dir = null;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->base_route = 'staf.';
            $this->base_dir = 'Staf';
            $user = request()->user();
            $this->user = $user;
            $role = $user->hasRole('admin');
            $this->is_admin = false;
            if ($role == 'admin') {
                $this->is_admin = true;
                $this->base_route = 'admin.';
                $this->base_dir = 'Admin';
            }
            return $next($request);
        });
    }

    public function index()
    {
        $tempatberkas = Tempatberkas::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $tempatberkas = $tempatberkas->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $tempatberkas = $tempatberkas->orderBy('id', 'asc');
        }

        $tempatberkas = $tempatberkas->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render($this->base_dir.'/Tempatberkas/Index', [
            'filters' => Request::all('search'),
            'tempatberkas' => TempatberkasCollection::collection($tempatberkas),
            'isAdmin' =>$this->is_admin,
            'baseRoute' =>$this->base_route,
            'baseDir' =>$this->base_dir,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $ruangs = Ruang::all();
        $jenistempatarsip = Jenistempatarsip::all();

        return Inertia::render(
            $this->base_dir.'/Tempatberkas/Create',
            [
                'isAdmin' =>$this->is_admin,
                'baseDir' =>$this->base_dir,
                'baseRoute' =>$this->base_route,
                'ruangOpts' => collect($ruangs)->map(fn ($o) => ['label' => $o['kantor']['nama_kantor'].' - '.$o['nama_ruang'], 'value' => $o['id']]),
                'jenistempatarsipOpts' => collect($jenistempatarsip)->map(fn ($o) => ['label' => $o['nama_jenistempatarsip'], 'value' => $o['id']]),
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'nama_tempatberkas' => ['required', 'unique:tempatberkas,nama_tempatberkas'],
            'ruang_id' => ['required'],
            'row_count' => ['required','integer','min:1'],
            'col_count' => ['required','integer','min:1'],
            'jenistempatarsip_id' => ['required'],
            'image_tempatberkas' => ['nullable'],
        ],[
          'unique' => ':attribute sudah ada'
        ]);

        $tempatberkas = Tempatberkas::create(
            $validated
        );
        $recs =[];
        for ($i=0; $i < ($tempatberkas->row_count * $tempatberkas->col_count) ; $i++) {
            $row = floor($i / $tempatberkas->col_count) + 1;
            $col = ($i % $tempatberkas->col_count)+1;
            $recs[] = new Posisiberkas([
                'id' => sprintf('%s.%s.%s', str_pad($tempatberkas->id, 3, '0', STR_PAD_LEFT),$row,$col),
                'tempatberkas_id' => $tempatberkas->id,
                'row'=> $row,
                'col' => $col
            ]);
        }
            $tempatberkas->posisiberkases()->saveMany($recs);
            return to_route($this->base_route .'tempatberkas.index')->with('success', 'Tempatberkas created.');
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
    public function edit(Tempatberkas $tempatberka)
    {
        $ruangs = Ruang::all();
        $jenistempatarsip = Jenistempatarsip::all();
        return Inertia::render($this->base_dir.'/Tempatberkas/Edit', [
            'tempatberkas' => $tempatberka,
            'selRuangOpt' => ['value' => $tempatberka->ruang_id, 'label' => $tempatberka->ruang->nama_ruang],
            'selJenistempatarsipOpt' => ['value' => $tempatberka->jenistempatarsip_id, 'label' => $tempatberka->jenistempatarsip->nama_jenistempatarsip],
            'baseDir' =>$this->base_dir,
            'baseRoute' =>$this->base_route,
            'ruangOpts' => collect($ruangs)->map(fn ($o) => ['label' => $o['kantor']['nama_kantor'].$o['nama_ruang'], 'value' => $o['id']]),
            'jenistempatarsipOpts' => collect($jenistempatarsip)->map(fn ($o) => ['label' => $o['nama_jenistempatarsip'], 'value' => $o['id']]),
            'base_route'=>$this->base_route,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tempatberkas $tempatberka)
    {
        $validated =  request()->validate([
            'nama_tempatberkas' => ['required', Rule::unique(Tempatberkas::class)->ignore($tempatberka->id)],
            'ruang_id' => ['required'],
            'row_count' => ['required','integer','min:1'],
            'col_count' => ['required','integer','min:1'],
            'jenistempatarsip_id' => ['required'],
            'image_tempatberkas' => ['nullable'],
        ]);

        $tempatberka->update($validated);
                $recs =[];
        for ($i=0; $i < ($tempatberka->row_count * $tempatberka->col_count) ; $i++) {
            $row = floor($i / $tempatberka->col_count) + 1;
            $col = ($i % $tempatberka->col_count)+1;
            $recs[] = new Posisiberkas([
                'id' => sprintf('%s.%s.%s', str_pad($tempatberka->id, 3, '0', STR_PAD_LEFT),$row,$col),
                'tempatberkas_id' => $tempatberka->id,
                'row'=> $row,
                'col' => $col
            ]);
        }
            $tempatberka->posisiberkases()->where('tempatberkas_id', $tempatberka->id)->delete();
            $tempatberka->posisiberkases()->saveMany($recs);

        return to_route($this->base_route .'tempatberkas.index')->with('success', 'Tempatberkas Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tempatberkas $tempatberka)
    {
        $tempatberka->delete();
        return Redirect::back()->with('success', 'Tempatberkas deleted.');
    }
    public function list(Request $request)
    {
        $tempatberkas = Tempatberkas::query();
        $tempatberkas = $tempatberkas;
        //     $tempatberkas = $tempatberkas->whereRelation('permohonan.users', 'id', auth()->id());
        // }
        // // ->with('permohonan', function ($query) {
        //     $query->with('jenishak')->with('desa')->with('users');
        // });

        $tempatberkas = $tempatberkas->filter(Request::only('search', 'nama_tempatarsip','nama_ruang','nama_jenistempatarsip'))
            ->skip(0)->take(10)->get();
        return Response()->json(TempatberkasCollection::collection($tempatberkas));
    }

    public function listByTempatberkas(Tempatberkas $tempatberkas)
    {
        $posisiberkas = Posisiberkas::query();
        // $posisiberkas = $posisiberkas->with('tempatberkas');
        $posisiberkas = $posisiberkas->where('tempatberkas_id', $tempatberkas->id)->get();
        return Response()->json(PosisiberkasCollection::collection($posisiberkas));
    }

    public function cetakQrcode(Tempatberkas $tempatarsip)
    {
        $row = request('row',1);
        $col = request('col',1);
        QrCode::format('png')->size(300)->generate($tempatarsip->kode_tempatarsip, public_path('qrcode_tmparsip.png'));
        $data = [
            'qrcode' => config('app.qrcodeurl',''). 'qrcode_tmparsip.png',
            'row'=>$row,
            'col'=>$col,
            'row_count'=>6,
            'col_count'=>5,
        ];
        $pdf = Pdf::loadView('pdf.cetakQrcode', $data)->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
        return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
    }
}
