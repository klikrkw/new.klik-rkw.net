<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DkeluarbiayaCollection extends JsonResource
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
            'nama_itemkegiatan' => $this->nama_itemkegiatan,
            'jumlah_biaya' => number_format($this->jumlah_biaya),
            'ket_biaya' => $this->ket_biaya,
            'image_dkeluarbiaya' => $this->image_dkeluarbiaya,
        ];
    }
}
