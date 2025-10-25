<?php

namespace App\Http\Resources\Admin;

use App\Models\Permohonan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use function Laravel\Prompts\text;

class EventCollection extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    function renderpermohonan(){
        $text="";
        if($this->is_transpermohonan) {
            $pmh =  $this->transpermohonan()->permohonan;
            $text = sprintf("%s - %s.%s, %s, %s",$pmh->nama_penerima, $pmh->jenishak->singkatan, $pmh->nomor_hak,
            $pmh->desa->nama_desa, $this->transpermohonan()->jenispermohonan->nama_jenispermohonan);
        }else{
            $text = $this->data;
        }
        return $text;
    }

     public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'start' => $this->start,
            'end' => $this->end,
            // 'start' => Carbon::parse($this->start)->format('d F Y'),
            // 'end' => Carbon::parse($this->end)->format('d F Y'),
            'title' => $this->title,
            'data' => $this->renderpermohonan(),
            'user' => $this->user,
            'kategorievent' => $this->kategorievent,
            'is_transpermohonan' => $this->is_transpermohonan,
        ];
    }
}
