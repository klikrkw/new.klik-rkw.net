<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TranspermohonanMinCollection extends JsonResource
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
            'jenispermohonan' => $this->jenispermohonan,
            'tgl_daftar' => Carbon::parse($this->created_at)->format('d F Y'),
            'active' => $this->active > 0 ? true : false,
            'nodaftar_transpermohonan' => $this->nodaftar_transpermohonan,
            'thdaftar_transpermohonan' => $this->thdaftar_transpermohonan,
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
