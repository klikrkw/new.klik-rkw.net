<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TranspermohonanCollection extends JsonResource
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
            'no_daftar' => $this->nodaftar_transpermohonan . "/" . $this->thdaftar_transpermohonan,
            'permohonan' => new PermohonanCollection($this->permohonan),
            'jenispermohonan' => $this->jenispermohonan,
            'tgl_daftar' => Carbon::parse($this->created_at)->format('d F Y'),
            'active' => $this->active > 0 ? true : false,
        ];
    }

    // public function with($request)
    //     {
    //         return [
    //             'meta' => [
    //                 'success' => 'true',
    //                 'code' => 0,
    //             ],
    //         ];
    //     }
}
