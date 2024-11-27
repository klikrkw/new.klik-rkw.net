<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KeluarbiayapermuserCollection extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'created_at' => Carbon::parse($this->created_at)->format('d F Y'),
            'user' => $this->user,
            'instansi' => $this->instansi,
            'rekening' => $this->rekening,
            'metodebayar' => $this->metodebayar,
            'kasbons' => $this->kasbons,
            'status_keluarbiayapermuser' => $this->status_keluarbiayapermuser,
            'saldo_awal' =>     number_format($this->saldo_awal),
            'jumlah_biaya' =>   number_format($this->jumlah_biaya),
            'saldo_akhir' =>    number_format($this->saldo_akhir),
        ];
    }
}
