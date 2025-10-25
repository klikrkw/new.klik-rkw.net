<?php

namespace App\Http\Resources\Api;

use App\Http\Resources\Admin\PermohonanCollection;
use App\Models\Transpermohonan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TranspermohonanMiniResource extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = $this->collection->transform(function (Transpermohonan $item, $meta) {
            return [
                'id' => $item->id,
                'no_daftar' => $item->nodaftar_transpermohonan . "/" . $item->thdaftar_transpermohonan,
                'tgl_daftar' => Carbon::parse($item->created_at)->format('d F Y'),
                'nama_pelepas' => $item->permohonan->nama_pelepas,
                'nama_penerima' => $item->permohonan->nama_penerima,
                'jenis_permohonan' => $item->jenispermohonan->nama_jenispermohonan,
                'alas_hak' => $item->permohonan->alas_hak,
                'letak_obyek' => $item->permohonan->desa->nama_desa . ', ' . $item->permohonan->desa->kecamatan->nama_kecamatan,
                ];
        });
        return [
        'data'=>$data,
    ];
    }
}
