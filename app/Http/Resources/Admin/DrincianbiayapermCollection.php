<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DrincianbiayapermCollection extends JsonResource
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
            'itemrincianbiayaperm' => $this->itemrincianbiayaperm,
            'jumlah_biaya' => number_format($this->jumlah_biaya),
            'ket_biaya' => $this->ket_biaya,
        ];
    }
}
