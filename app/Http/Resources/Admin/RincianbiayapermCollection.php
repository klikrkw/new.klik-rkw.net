<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RincianbiayapermCollection extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */

    public function toArray(Request $request): array
    {
        $nohak = $this->singkatan == 'C' ? $this->nomor_hak . ', Ps.' . $this->persil . ', ' . $this->klas : $this->nomor_hak;
        return [
            'id' => $this->id,
            'tgl_rincianbiayaperm' => Carbon::parse($this->created_at)->format('d M Y'),
            'user' => $this->user,
            'nama_jenispermohonan'=>$this->nama_jenispermohonan,
            'ket_rincianbiayaperm'=>$this->ket_rincianbiayaperm,
            'permohonan' => sprintf(
                '%s - %s, %s.%s, L.%sM2',
                $this->no_daftar,
                $this->nama_penerima,
                $this->singkatan,
                $nohak,
                $this->luas_tanah
            ),
            'letak_obyek'=> sprintf(
                '%s - %s',
                $this->nama_desa,
                $this->nama_kecamatan,            )
                ,
                'total_pemasukan' => number_format($this->total_pemasukan),
                'total_pengeluaran' => number_format($this->total_pengeluaran),
                'sisa_saldo' => number_format($this->sisa_saldo),
                'status_rincianbiayaperm' => $this->status_rincianbiayaperm,
                'no_daftar' => $this->no_daftar,
        ];
    }

}
