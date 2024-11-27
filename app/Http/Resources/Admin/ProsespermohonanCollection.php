<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProsespermohonanCollection extends JsonResource
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
            'tgl_proses' => Carbon::parse($this->created_at)->format('d M Y'),
            'itemprosesperm' => $this->itemprosesperm,
            'catatan_prosesperm' => $this->catatan_prosesperm,
            'user' => $this->user,
            'statusprosesperms' => $this->statusprosesperms,
            'active' => $this->active > 0 ? true : false,
        ];
    }
}
