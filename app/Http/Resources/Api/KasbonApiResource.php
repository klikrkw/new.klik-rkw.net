<?php

namespace App\Http\Resources\Api;

use App\Models\Kasbon;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

class KasbonApiResource extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    // public function toArray(Request $request): array
    // {
    //     return [
    //         'data' => $this->collection->transform(function (Kasbon $user, $meta) {
    //     return [
    //         'id' => $user->id,
    //         // 'tgl_kasbon' => Carbon::parse($this->created_at)->format('d F Y'),
    //         // 'user' => $this->user,
    //         // 'jumlah_kasbon' => number_format($this->jumlah_kasbon),
    //         // 'jumlah_penggunaan' => number_format($this->jumlah_penggunaan),
    //         // 'sisa_penggunaan' => number_format($this->sisa_penggunaan),
    //         // 'keperluan' => $this->keperluan,
    //         // 'status_kasbon' => $this->status_kasbon,
    //     ];
    // }),
    //         'meta' => [
    //             'total_users' => $this->collection->id,
    //         ],
    //     ];
    //     // return [
    //     //     'id' => $this->id,
    //     //     'tgl_kasbon' => Carbon::parse($this->created_at)->format('d F Y'),
    //     //     'user' => $this->user,
    //     //     'jumlah_kasbon' => number_format($this->jumlah_kasbon),
    //     //     'jumlah_penggunaan' => number_format($this->jumlah_penggunaan),
    //     //     'sisa_penggunaan' => number_format($this->sisa_penggunaan),
    //     //     'keperluan' => $this->keperluan,
    //     //     'status_kasbon' => $this->status_kasbon,
    //     // ];
    // }

    public function toArray($request)
{
    $response = [
        'data' => $this->collection->transform(function (Kasbon $data) {
                return [
                    'id' => $data->id,
                    'tgl_kasbon' => Carbon::parse($data->created_at)->format('d F Y'),
                    'user' => $data->user,
                    'jumlah_kasbon' => number_format($data->jumlah_kasbon),
                    'jumlah_penggunaan' => number_format($data->jumlah_penggunaan),
                    'sisa_penggunaan' => number_format($data->sisa_penggunaan),
                    'keperluan' => $data->keperluan,
                    'status_kasbon' => $data->status_kasbon,
                    'jenis_kasbon' => $data->jenis_kasbon,
                    'current_page' => $this->resource->currentPage(),
                    'next_page_url' => $this->resource->nextPageUrl(),
                    'first_page_url'=> $this->resource->from,
                    // 'from'=> $this->resource->from,
                    // 'path' => $this->resource->path,
                    // 'per_page'=> $this->resource->perPage(),
                    // 'prev_page_url'=> $this->resource->prevPageUrl(),
                    // 'to' => $this->resource->to,
                ];
    })];
    return $response;
        }
}
