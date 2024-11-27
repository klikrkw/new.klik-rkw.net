<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\RincianbiayapermCollection;
use App\Http\Resources\Admin\RincianbiayapermDetailCollection;
use App\Models\Biayaperm;
use App\Models\Rincianbiayaperm;
use Illuminate\Http\Request;

class RincianbiayapermApiController extends BaseController
{
    public function options()
    {
        $transpermohonan_id = request('transpermohonan_id') ? request('transpermohonan_id') : null;
        $rincianbiayaperms = Rincianbiayaperm::query();
        $rincianbiayaperms = $rincianbiayaperms->where('transpermohonan_id','=',$transpermohonan_id)->where('status_rincianbiayaperm','=','wait_approval');
        $rincianbiayaperms = $rincianbiayaperms->orderBy('id', 'desc')->take(1)->skip(0)->get();
        $rincianbiayapermOpts = collect($rincianbiayaperms)->map(fn ($item) => ['value' => $item['id'], 'label' => $item['ket_rincianbiayaperm'],'rincianbiayaperm'=>$item])->toArray();
        return $this->sendResponse(['rincianbiayapermOpts'=>$rincianbiayapermOpts],'Sukses');
    }

    public function list()
    {
        $biayaperm_id = request('biayaperm_id');
        $rincianbiayaperms = [];
        $biayaperm = Biayaperm::find($biayaperm_id);
        if($biayaperm){
            $rincianbiayaperms = $biayaperm->rincianbiayaperms;
        }
        // return RincianbiayapermDetailCollection::collection($rincianbiayaperms);
        return $this->sendResponse(['rincianbiayaperms'=>RincianbiayapermDetailCollection::collection($rincianbiayaperms)],'Sukses');
    }

}
