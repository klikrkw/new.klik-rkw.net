<?php

namespace App\Http\Resources\Admin;

use App\Models\Tempatberkas;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PosisiberkasCollection extends JsonResource
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
            'tempatberkas' => new TempatberkasCollection($this->tempatberkas),
            'row' => (int) $this->row,
            'col' => (int) $this->col,
            'jenistempatarsip' => $this->tempatberkas->jenistempatarsip,
        ];
    }
}
