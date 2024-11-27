<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DkeluarbiayapermuserStafCollection extends JsonResource
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
            'metodebayar' => $this->keluarbiayapermuser->metodebayar,
            'instansi' => $this->keluarbiayapermuser->instansi,
            'user' => $this->keluarbiayapermuser->user,
            'itemkegiatan' => $this->itemkegiatan,
            'jumlah_biaya' => number_format($this->jumlah_biaya),
            'ket_biaya' => $this->ket_biaya,
            'image_dkeluarbiayapermuser' => $this->image_dkeluarbiayapermuser,
        ];
    }
}
