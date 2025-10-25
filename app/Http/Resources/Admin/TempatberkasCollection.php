<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TempatberkasCollection extends JsonResource
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
            'nama_tempatberkas' => $this->nama_tempatberkas,
            'image_tempatberkas' => $this->image_tempatberkas,
            'kode_tempatberkas' => $this->kode_tempatberkas,
            'ruang' => new RuangCollection($this->ruang),
            'row_count' => $this->row_count,
            'col_count' => $this->col_count,
            'jenistempatarsip' => $this->jenistempatarsip,
        ];
    }
}
