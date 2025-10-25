<?php

namespace App\Http\Resources\Api;

use App\Models\Postingjurnal;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

class PostingjurnalWithPageApiResource extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    // public function toArray(Request $request): array
    // {
    //     return [
    //         'data' => $this->collection->transform(function (Postingjurnal $user, $meta) {
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
        $data = $this->collection->transform(function (Postingjurnal $data) {
                return [
                    'id' => $data->id,
                    'created_at' => Carbon::parse($data->created_at)->format('d F Y H:i:s'),
                    'user' => $data->user,
                    'akun_debet' => $data->akun_debet,
                    'akun_kredit' => $data->akun_kredit,
                    'uraian' => $data->uraian,
                    'image' => $data->image,
                    'jumlah' => number_format($data->jumlah),
                ];
    });
    return [
        'data'=>$data,
        'current_page' => $this->resource->currentPage(),
        'next_page_url'=> $this->resource->nextPageUrl(),
        'per_page'=> $this->resource->perPage(),
    ];
}
}
