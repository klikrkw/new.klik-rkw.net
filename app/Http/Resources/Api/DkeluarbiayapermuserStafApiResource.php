<?php

namespace App\Http\Resources\Api;

use App\Http\Resources\Admin\TranspermohonanCollection;
use App\Models\Dkeluarbiayapermuser;
use App\Models\Kasbon;
use App\Models\Keluarbiayapermuser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

class DkeluarbiayapermuserStafApiResource extends ResourceCollection
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
        'current_page' => $this->resource->currentPage(),
        'next_page_url' => $this->resource->nextPageUrl(),
        'per_page'=> $this->resource->perPage(),
        'data' => $this->collection->transform(function (Dkeluarbiayapermuser $data) {
                return [
                    'id' => $data->id,
                    'created_at' => Carbon::parse($data->created_at)->format('d F Y'),
                    'metodebayar' => $data->keluarbiayapermuser->metodebayar,
                    'instansi' => $data->keluarbiayapermuser->instansi,
                    'user' => $data->keluarbiayapermuser->user,
                    'itemkegiatan' => $data->itemkegiatan,
                    'jumlah_biaya' => number_format($data->jumlah_biaya),
                    'ket_biaya' => $data->ket_biaya,
                    'transpermohonan' => new TranspermohonanCollection($data->transpermohonan),
                    // 'first_page_url'=> $this->resource->from,
                    // 'from'=> $this->resource->from,
                    // 'path' => $this->resource->path,
                    // 'prev_page_url'=> $this->resource->prevPageUrl(),
                    // 'to' => $this->resource->to,
                ];
    })];
    return $response;
        }
}
