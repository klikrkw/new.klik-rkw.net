<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Admin\BiayapermCollection;
use App\Http\Resources\Admin\PosisiberkasCollection;
use App\Http\Resources\Admin\TranspermohonanCollection;
use App\Models\Akun;
use App\Models\Bayarbiayaperm;
use App\Models\Biayaperm;
use App\Models\Jurnalumum;
use App\Models\Metodebayar;
use App\Models\Posisiberkas;
use App\Models\Rincianbiayaperm;
use App\Models\Tempatberkas;
use App\Models\Transpermohonan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TempatberkasApiController extends BaseController
{
    public function listByTempatberkas(Tempatberkas $tempatberkas)
    {
        $posisiberkas = Posisiberkas::query();
        // $posisiberkas = $posisiberkas->with('tempatberkas');
        $posisiberkas = $posisiberkas->where('tempatberkas_id', $tempatberkas->id)->get();
        $data = PosisiberkasCollection::collection($posisiberkas);
        return $this->sendResponse($data,"Sukses");
    }


    public function options(Request $request)
    {
        $tempatberkases = Tempatberkas::all();
        $data =collect($tempatberkases)->map(fn ($o) => ['label' => $o['ruang']['nama_ruang'].' - '.$o['nama_tempatberkas'], 'value' => $o['id']]);
        return $this->sendResponse($data,"Sukses");
    }
    public function posisiberkas(Request $request)
    {
        $transpermohonan_id = request('transpermohonan_id');
        $tempatberkas_id = request('tempatberkas_id');
        // $tempatberkas_id = request('tempatberkas_id');
        $transpermohonan = null;
        $posisiberkas = null;
        $tempatberkas = null;
        $ketemu = false;
        if($transpermohonan_id){
            $transpermohonan = Transpermohonan::find($transpermohonan_id);
            if($transpermohonan){
                $ketemu = true;
                $posisiberkases = $transpermohonan->posisiberkases;
                if(count($posisiberkases)>0){
                    $posisiberkas = $posisiberkases->first();
                    if($posisiberkas){
                         $tempatberkas = $posisiberkas->tempatberkas;
                    }
                }
            }
        }
        if($tempatberkas_id){
            $tempatberkas = Tempatberkas::find($tempatberkas_id);
        }

        $data =[
        'posisiberkas'=>$posisiberkas? new PosisiberkasCollection($posisiberkas):null,
        'tempatberkas'=>$tempatberkas? $tempatberkas:null,
        null
    ];
        return $this->sendResponse($data,"Sukses");
    }
    public function updatePosisiberkas(Transpermohonan $transpermohonan)
    {
        $validated =  request()->validate([
            'posisiberkas_id' => ['required'],
        ]);
        $posisiberkas_ids = [$validated['posisiberkas_id']];
        $pemohon = $transpermohonan->posisiberkases()->sync($posisiberkas_ids);
        return $this->sendResponse($pemohon,"Sukses");
    }

}
