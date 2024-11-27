<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TempatarsipCollection extends JsonResource
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
            'nama_tempatarsip' => $this->nama_tempatarsip,
            'image_tempatarsip' => $this->image_tempatarsip,
            'kode_tempatarsip' => $this->kode_tempatarsip,
            'ruang' => new RuangCollection($this->ruang),
            'baris' => $this->baris,
            'kolom' => $this->kolom,
            'jenistempatarsip' => $this->jenistempatarsip,
        ];
    }
}
