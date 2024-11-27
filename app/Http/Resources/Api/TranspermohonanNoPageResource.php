<?php

namespace App\Http\Resources\Api;

use App\Http\Resources\Admin\PermohonanCollection;
use App\Models\Transpermohonan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TranspermohonanNoPageResource extends ResourceCollection
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
                'permohonan' => new PermohonanCollection($item->permohonan),
                'jenispermohonan' => $item->jenispermohonan,
                'tgl_daftar' => Carbon::parse($item->created_at)->format('d F Y'),
                'active' => $item->active > 0 ? true : false,
                ];
        });
        return [
        'data'=>$data,
    ];
    }
}
