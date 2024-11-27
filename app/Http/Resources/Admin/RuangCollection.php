<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RuangCollection extends JsonResource
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
            'nama_ruang' => $this->nama_ruang,
            'image_ruang' => $this->alamat_ruang,
            'kode_ruang' => $this->kode_ruang,
            'kantor' => $this->kantor,
        ];
    }
}
