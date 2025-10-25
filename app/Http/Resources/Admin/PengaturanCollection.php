<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PengaturanCollection extends JsonResource
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
            'nama_pengaturan' => $this->nama_pengaturan,
            'grup' => $this->grup,
            'tipe_data' => $this->tipe_data,
            'nilai' => $this->nilai,
        ];
    }
}
