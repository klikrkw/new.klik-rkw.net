<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemkegiatanCollection extends JsonResource
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
            'nama_itemkegiatan' => $this->nama_itemkegiatan,
            'instansi' => $this->instansi,
            'akun' => $this->akun,
            'grupitemkegiatans' => $this->grupitemkegiatans,
            'isunique' => $this->isunique == 1 ? true : false,
            'checkbiaya' => $this->checkbiaya == 1 ? true : false,
            'is_alert' => $this->is_alert == 1 ? true : false,
            'start_alert' => $this->start_alert,
        ];
    }
}
