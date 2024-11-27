<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemrincianbiayapermCollection extends JsonResource
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
            'nama_itemrincianbiayaperm' => $this->nama_itemrincianbiayaperm,
            'min_value' => number_format($this->min_value),
            'command_itemrincianbiayaperm' => $this->command_itemrincianbiayaperm,
            'jenis_itemrincianbiayaperm' => $this->jenis_itemrincianbiayaperm,
        ];
    }
}
