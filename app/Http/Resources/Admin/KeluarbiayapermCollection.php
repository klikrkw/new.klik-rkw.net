<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KeluarbiayapermCollection extends JsonResource
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
            'tgl_keluarbiayaperm' => Carbon::parse($this->created_at)->format('d M Y'),
            'metodebayar' => $this->metodebayar,
            'jumlah_keluarbiayaperm' => number_format($this->jumlah_keluarbiayaperm),
            'catatan_keluarbiayaperm' => $this->catatan_keluarbiayaperm,
            'image_keluarbiayaperm' => $this->image_keluarbiayaperm,
            'user' => $this->user,
            'itemkegiatan' => $this->itemkegiatan,
            // 'dkeluarbiayapermusers' => $this->dkeluarbiayapermusers
        ];
        return $response;
    }
}
