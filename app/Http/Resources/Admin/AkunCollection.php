<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AkunCollection extends JsonResource
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
            'nama_akun' => $this->nama_akun,
            'kelompokakun' => $this->kelompokakun,
            'kode_akun' => $this->kode_akun,
            'slug' => $this->slug,
        ];
    }
}
