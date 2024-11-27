<?php

namespace App\Http\Resources\Admin;

use App\Models\Keluarbiayapermuser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DkeluarbiayapermuserInfoCollection extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        $nohak = $this->transpermohonan->permohonan->jenishak->singkatan == 'C' ? $this->transpermohonan->permohonan->nomor_hak . ', Ps.' . $this->transpermohonan->permohonan->persil . ', ' . $this->transpermohonan->permohonan->klas : $this->transpermohonan->permohonan->nomor_hak;
        return [
            'id' => $this->id,
            'permohonan' => sprintf(
                '%s, %s - %s.%s, L.%sM2, Ds.%s - %s',
                $this->transpermohonan->permohonan->nama_penerima,
                $this->transpermohonan->jenispermohonan->nama_jenispermohonan,
                $this->transpermohonan->permohonan->jenishak->singkatan,
                $nohak,
                $this->transpermohonan->permohonan->luas_tanah,
                $this->transpermohonan->permohonan->desa->nama_desa,
                $this->transpermohonan->permohonan->desa->kecamatan->nama_kecamatan,
            ),
            'created_at' => Carbon::parse($this->created_at)->format('d F Y'),
            'nama_itemkegiatan' => $this->nama_itemkegiatan,
            'jumlah_biaya' => number_format($this->jumlah_biaya),
            'ket_biaya' => $this->ket_biaya,
            'image_dkeluarbiaya' => $this->image_dkeluarbiaya,
            'keluarbiayapermuser'=>new KeluarbiayapermuserCollection($this->keluarbiayapermuser),
            'itemkegiatan' => $this->itemkegiatan,
        ];
    }
}
