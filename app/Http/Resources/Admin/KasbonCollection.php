<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KasbonCollection extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tgl_kasbon' => Carbon::parse($this->created_at)->format('d F Y'),
            'user' => $this->user,
            'instansi' => $this->instansi,
            'jumlah_kasbon' => number_format($this->jumlah_kasbon),
            'jumlah_penggunaan' => number_format($this->jumlah_penggunaan),
            'sisa_penggunaan' => number_format($this->sisa_penggunaan),
            'keperluan' => $this->keperluan,
            'status_kasbon' => $this->status_kasbon,
            'jenis_kasbon' => $this->jenis_kasbon,
        ];
    }

}
