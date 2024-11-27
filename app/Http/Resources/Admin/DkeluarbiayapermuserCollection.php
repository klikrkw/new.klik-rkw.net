<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DkeluarbiayapermuserCollection extends JsonResource
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
            'permohonan' => sprintf(
                '%s,%s.%s, L.%sM2, Ds.%s - %s',
                $this->nama_penerima,
                $this->singkatan,
                $nohak,
                $this->luas_tanah,
                $this->nama_desa,
                $this->nama_kecamatan,
            ),
            'nama_itemkegiatan' => $this->nama_itemkegiatan,
            'jumlah_biaya' => number_format($this->jumlah_biaya),
            'ket_biaya' => $this->ket_biaya,
            'image_dkeluarbiayapermuser' => $this->image_dkeluarbiayapermuser,
        ];
    }
}
