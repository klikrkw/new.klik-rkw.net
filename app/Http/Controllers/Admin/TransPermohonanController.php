<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PermohonanCollection;
use App\Http\Resources\Admin\TempatarsipCollection;
use App\Http\Resources\Admin\TranspermohonanCollection;
use App\Models\Tempatarsip;
use App\Models\Transpermohonan;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class TransPermohonanController extends Controller
{
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

    public function List(Request $request)
    {
        $is_staf = request('is_staf');
        $transpermohonans = Transpermohonan::query();
        $transpermohonans = $transpermohonans->with('permohonan')->where('active', true);
        if($is_staf == "true"){
            $transpermohonans = $transpermohonans->whereRelation('permohonan.users', 'id', auth()->id());
        }
        // ->with('permohonan', function ($query) {
        //     $query->with('jenishak')->with('desa')->with('users');
        // });

        $transpermohonans = $transpermohonans->filter(Request::only('search', 'nodaftar_permohonan', 'nama_pelepas', 'nama_penerima', 'nomor_hak'))
            ->skip(0)->take(10)->get();
        return Response()->json(TranspermohonanCollection::collection($transpermohonans));
    }

    public function show(Transpermohonan $transpermohonan)
    {
        return Response()->json($transpermohonan);
    }

    public function createTempatarsip(Request $request)
    {
        $transpermohonan_id = request('transpermohonan_id');
        // $tempatarsip_id = request('tempatarsip_id');
        $transpermohonan = null;
        $tempatarsip = null;
        if($transpermohonan_id){
            $transpermohonan = Transpermohonan::find($transpermohonan_id);
            if($transpermohonan){
                $tempatarsips = $transpermohonan->tempatarsips;
                if(count($tempatarsips)>0){
                    $tempatarsip = $tempatarsips[0];
                }
            }
        }
        // if($tempatarsip_id){
        //     $tempatarsip = Tempatarsip::find($tempatarsip_id);
        // }

        return Inertia::render($this->base_dir.'/Tempatarsip/Transaksi/Create',
        ['baseRoute'=>$this->base_route,
        'ctranspermohonan'=>$transpermohonan?new TranspermohonanCollection($transpermohonan):null,
        'ctempatarsip'=>$tempatarsip? new TempatarsipCollection($tempatarsip):null]);
    }
    public function storeTempatarsip(Transpermohonan $transpermohonan)
    {
        $validated =  request()->validate([
            'transpermohonan_id' => ['required'],
            'tempatarsip_id' => ['required'],
        ]);
        $tmparsip_ids = [$validated['tempatarsip_id']];
        $pemohon = $transpermohonan->tempatarsips()->sync($tmparsip_ids);
        return back()->with('success', 'Tempat Arsip Permohonan created.');
    }
}
