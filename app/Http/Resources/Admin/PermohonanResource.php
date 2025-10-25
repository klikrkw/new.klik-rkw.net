<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Api\TranspermohonanApiResource;
use App\Http\Resources\Api\TranspermohonanNoPageResource;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermohonanResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        // strtoupper($this->jenishak->nama_jenishak) === "HAK MILIK ADAT" ? $this->jenishak->singkatan
        // . "." . $this->nomor_hak . ", Ps." . $this->persil . ", Klas " . $this->klas : $this->jenishak->singkatan . "." . $this->nomor_hak
        return [
            'id' => $this->id,
            'no_daftar' => $this->nodaftar_permohonan . "/" . $this->thdaftar_permohonan,
            'jenishak_id' => $this->jenishak_id,
            'nomor_hak' => $this->alas_hak,
            'tgl_daftar' => Carbon::parse($this->date_create)->format('d F Y'),
            'luas_tanah' => $this->luas_tanah,
            'nama_pelepas' => $this->nama_pelepas,
            'nama_penerima' => $this->nama_penerima,
            'letak_obyek' => $this->desa->nama_desa . ', ' . $this->desa->kecamatan->nama_kecamatan,
            'transpermohonan' => $this->transpermohonan(),
            'active' => $this->active > 0 ? true : false,
            'cek_biaya' => $this->cek_biaya > 0 ? true : false,
            'users' => $this->users,
        ];
    }
}
