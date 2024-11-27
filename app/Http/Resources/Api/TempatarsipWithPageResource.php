<?php

namespace App\Http\Resources\Api;

use App\Http\Resources\Admin\PermohonanCollection;
use App\Http\Resources\Admin\RuangCollection;
use App\Models\Tempatarsip;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TempatarsipWithPageResource extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = $this->collection->transform(function (Tempatarsip $item, $meta) {
            return [
                'id' => $item->id,
                'nama_tempatarsip' => $item->nama_tempatarsip,
                'image_tempatarsip' => $item->image_tempatarsip,
                'kode_tempatarsip' => $item->kode_tempatarsip,
                'ruang' => new RuangCollection($item->ruang),
                'baris' => $item->baris,
                'kolom' => $item->kolom,
                'jenistempatarsip' => $item->jenistempatarsip,
                ];
        });
        return [
        'data'=>$data,
        'current_page' => $this->resource->currentPage(),
        'next_page_url'=> $this->resource->nextPageUrl(),
        'per_page'=> $this->resource->perPage(),
    ];
    }
}
