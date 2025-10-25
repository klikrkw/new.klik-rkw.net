<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermohonanCollection extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'no_daftar' => $this->nodaftar_permohonan . "/" . $this->thdaftar_permohonan,
            'jenishak_id' => $this->jenishak_id,
            'nomor_hak' => strtoupper($this->jenishak->nama_jenishak) === "HAK MILIK ADAT" ? $this->jenishak->singkatan
                . "." . $this->nomor_hak . ", Ps." . $this->persil . ", Klas " . $this->klas : $this->jenishak->singkatan . "." . $this->nomor_hak,
            'tgl_daftar' => Carbon::parse($this->created_at)->format('d M Y'),
            'persil' => $this->persil,
            'klas' => $this->klas,
            'luas_tanah' => $this->luas_tanah,
            'atas_nama' => $this->atas_nama,
            'nama_pelepas' => $this->nama_pelepas,
            'nama_penerima' => $this->nama_penerima,
            'jenispermohonan_id' => $this->jenispermohonan_id,
            'jenispermohonans' => $this->jenispermohonans,
            'active_jenispermohonans' => $this->active_jenispermohonans,
            'jenis_tanah' => $this->jenis_tanah,
            'desa_id' => $this->desa_id,
            'letak_obyek' => $this->desa->nama_desa . ', ' . $this->desa->kecamatan->nama_kecamatan,
            'nodaftar_permohonan' => $this->nodaftar_permohonan . "-" . $this->thdaftar_permohonan,
            'thdaftar_permohonan' => $this->thdaftar_permohonan,
            'users' => $this->users,
            'transpermohonans' => TranspermohonanMinCollection::collection($this->transpermohonans),
            'transpermohonan' => new TranspermohonanMinCollection($this->transpermohonan()),
            'active' => $this->active > 0 ? true : false,
            'cek_biaya' => $this->cek_biaya > 0 ? true : false,
        ];
    }
}
