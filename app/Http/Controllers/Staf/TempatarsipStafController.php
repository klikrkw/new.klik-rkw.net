<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\TempatarsipCollection;
use App\Models\Jenistempatarsip;
use App\Models\Kantor;
use App\Models\Ruang;
use App\Models\Tempatarsip;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TempatarsipStafController extends Controller
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
        $tempatarsips = Tempatarsip::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $tempatarsips = $tempatarsips->orderBy(request('sortBy'), request('sortDir'));
        } else {
            $tempatarsips = $tempatarsips->orderBy('id', 'asc');
        }

        $tempatarsips = $tempatarsips->filter(Request::only('search'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render($this->base_dir.'/Tempatarsip/Index', [
            'filters' => Request::all('search'),
            'tempatarsips' => TempatarsipCollection::collection($tempatarsips),
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
        $jenistempatarsips = Jenistempatarsip::all();

        return Inertia::render(
            $this->base_dir.'/Tempatarsip/Create',
            [
                'isAdmin' =>$this->is_admin,
                'baseDir' =>$this->base_dir,
                'baseRoute' =>$this->base_route,
                'ruangOpts' => collect($ruangs)->map(fn ($o) => ['label' => $o['kantor']['nama_kantor'].' - '.$o['nama_ruang'], 'value' => $o['id']]),
                'jenistempatarsipOpts' => collect($jenistempatarsips)->map(fn ($o) => ['label' => $o['nama_jenistempatarsip'], 'value' => $o['id']]),
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'nama_tempatarsip' => ['required', 'unique:tempatarsips,nama_tempatarsip'],
            'ruang_id' => ['required'],
            'baris' => ['required','integer','min:1'],
            'kolom' => ['required','integer','min:1'],
            'jenistempatarsip_id' => ['required'],
            'image_tempatarsip' => ['nullable'],
        ]);

        $role = Tempatarsip::create(
            $validated
        );

        return to_route($this->base_route .'tempatarsips.index')->with('success', 'Tempatarsip created.');
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
    public function edit(Tempatarsip $tempatarsip)
    {
        $ruangs = Ruang::all();
        $jenistempatarsips = Jenistempatarsip::all();
        return Inertia::render($this->base_dir.'/Tempatarsip/Edit', [
            'tempatarsip' => $tempatarsip,
            'selRuangOpt' => ['value' => $tempatarsip->ruang_id, 'label' => $tempatarsip->ruang->nama_ruang],
            'selJenistempatarsipOpt' => ['value' => $tempatarsip->jenistempatarsip_id, 'label' => $tempatarsip->jenistempatarsip->nama_jenistempatarsip],
            'baseDir' =>$this->base_dir,
            'baseRoute' =>$this->base_route,
            'ruangOpts' => collect($ruangs)->map(fn ($o) => ['label' => $o['kantor']['nama_kantor'].$o['nama_ruang'], 'value' => $o['id']]),
            'jenistempatarsipOpts' => collect($jenistempatarsips)->map(fn ($o) => ['label' => $o['nama_jenistempatarsip'], 'value' => $o['id']]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tempatarsip $tempatarsip)
    {
        $validated =  request()->validate([
            'nama_tempatarsip' => ['required', Rule::unique(Tempatarsip::class)->ignore($tempatarsip->id)],
            'ruang_id' => ['required'],
            'baris' => ['required','integer','min:1'],
            'kolom' => ['required','integer','min:1'],
            'jenistempatarsip_id' => ['required'],
            'image_tempatarsip' => ['nullable'],
        ]);

        $tempatarsip->update($validated);

        return to_route($this->base_route .'tempatarsips.index')->with('success', 'Tempatarsip Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tempatarsip $tempatarsip)
    {
        $tempatarsip->delete();
        return Redirect::back()->with('success', 'Tempatarsip deleted.');
    }
    public function list(Request $request)
    {
        $tempatarsips = Tempatarsip::query();
        $tempatarsips = $tempatarsips;
        //     $tempatarsips = $tempatarsips->whereRelation('permohonan.users', 'id', auth()->id());
        // }
        // // ->with('permohonan', function ($query) {
        //     $query->with('jenishak')->with('desa')->with('users');
        // });

        $tempatarsips = $tempatarsips->filter(Request::only('search', 'nama_tempatarsip','nama_ruang','nama_jenistempatarsip'))
            ->skip(0)->take(10)->get();
        return Response()->json(TempatarsipCollection::collection($tempatarsips));
    }
    public function cetakQrcode(Tempatarsip $tempatarsip)
    {
        $row = request('row',1);
        $col = request('col',1);
        QrCode::format('png')->size(300)->generate($tempatarsip->kode_tempatarsip, public_path('qrcode_tmparsip.png'));
        $data = [
            'qrcode' => 'qrcode_tmparsip.png',
            'row'=>$row,
            'col'=>$col,
            'row_count'=>6,
            'col_count'=>5,
        ];
        $pdf = Pdf::loadView('pdf.cetakQrcode', $data)->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
        return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
    }
}
