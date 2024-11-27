<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BiayapermCollection extends JsonResource
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
            'tgl_biayaperm' => Carbon::parse($this->created_at)->format('d M Y'),
            'jumlah_biayaperm' => number_format($this->jumlah_biayaperm),
            'jumlah_bayar' => number_format($this->jumlah_bayar),
            'kurang_bayar' => number_format($this->kurang_bayar),
            'catatan_biayaperm' => $this->catatan_biayaperm,
            'image_biayaperm' => $this->image_biayaperm,
            'user' => $this->user,
            'transpermohonan' => $this->transpermohonan,
        ];
    }
}
