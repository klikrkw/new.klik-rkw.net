<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BayarbiayapermCollection extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        $response =  [
            'id' => $this->id,
            'tgl_bayarbiayaperm' => Carbon::parse($this->created_at)->format('d M Y'),
            'metodebayar' => $this->metodebayar,
            'info_rekening' => $this->info_rekening,
            'saldo_awal' => number_format($this->saldo_awal),
            'jumlah_bayar' => number_format($this->jumlah_bayar),
            'saldo_akhir' => number_format($this->saldo_akhir),
            'user' => $this->user,
            'catatan_bayarbiayaperm' => $this->catatan_bayarbiayaperm,
            'image_bayarbiayaperm' => $this->image_bayarbiayaperm,
        ];
        return $response;
    }


}
