<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PemohonCollection extends JsonResource
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
            'nama_pemohon' => $this->nama_pemohon,
            'alamat_pemohon' => $this->alamat_pemohon,
            'email_pemohon' => $this->email_pemohon,
            'telp_pemohon' => $this->alamat_pemohon,
            'nik_pemohon' => $this->nik_pemohon,
            'no_daftar' => $this->nodaftar_pemohon . "/" . $this->thdaftar_pemohon,
            'active' => $this->active,
        ];
    }
}
