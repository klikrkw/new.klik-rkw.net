<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CatatanpermCollection extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        $response =  [
            'id' => $this->id,
            'tgl_catatanperm' => Carbon::parse($this->created_at)->format('d M Y'),
            'fieldcatatan' => $this->fieldcatatan,
            'isi_catatanperm' => $this->isi_catatanperm,
            'image_catatanperm' => $this->image_catatanperm,
        ];
        return $response;
    }
}
