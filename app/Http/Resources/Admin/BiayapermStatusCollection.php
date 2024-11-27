<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BiayapermStatusCollection extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public static $wrap = null;

    public function toArray(Request $request): array
    {
    $nohak = $this->singkatan == 'C' ? $this->nomor_hak . ', Ps.' . $this->persil . ', ' . $this->klas : $this->nomor_hak;
    $permohonan = sprintf(
                    '%s,%s.%s, L.%sM2, Ds.%s - %s',
                    $this->nama_penerima,
                    $this->singkatan,
                    $nohak,
                    $this->luas_tanah,
                    $this->nama_desa,
                    $this->nama_kecamatan,
    );
        return [
            'id' => $this->id,
            'tgl_biayaperm' => Carbon::parse($this->updated_at)->format('d M Y'),
            'jumlah_biayaperm' => number_format($this->jumlah_biayaperm),
            'jumlah_bayar' => number_format($this->jumlah_bayar),
            'kurang_bayar' => number_format($this->kurang_bayar),
            'catatan_biayaperm' => $this->catatan_biayaperm,
            'image_biayaperm' => $this->image_biayaperm,
            'nama_jenispermohonan' => $this->nama_jenispermohonan,
            'permohonan' => $permohonan,
            'no_daftar' =>$this->nodaftar_transpermohonan.'/'.$this->thdaftar_transpermohonan,
            'users' => $this->transpermohonan->permohonan->users,
        ];
    }

}
