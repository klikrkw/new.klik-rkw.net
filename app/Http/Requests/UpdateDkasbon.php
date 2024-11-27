<?php

namespace App\Http\Requests;

use App\Models\Itemkegiatan;
use App\Rules\checkRincianbiayapermRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDkasbon extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $val_itemkgt = ['required', new checkRincianbiayapermRule()];
        $itemkegiatan = Itemkegiatan::find(request('itemkegiatan_id'));
        $isunique = $itemkegiatan ? $itemkegiatan->isunique : false;
        if ($isunique) {
            $val_itemkgt =  ['required', Rule::unique('dkeluarbiayapermusers', 'itemkegiatan_id')->where('transpermohonan_id', request('transpermohonan_id')), new checkRincianbiayapermRule()];
        }
        // $checkbiaya = false;
        // $rincianbiayaperm_ids = [];
        // if($itemkegiatan){
        //     if($itemkegiatan->checkbiaya){
        //         $checkbiaya = true;
        //         $rincianbiayaperm_ids = $itemkegiatan->itemrincianbiayaperms->pluck('id');
        //     }
        // }

        return [
            // 'keluarbiayapermuser_id' => ['required'],
            'jenis_kasbon' => ['required'],
            'jumlah_biaya' => ['required', 'numeric', 'min:1'],
            'ket_biaya' => ['nullable'],
            'transpermohonan_id' => ['required_if:jenis_kasbon,permohonan'],
            'itemkegiatan_id' => $val_itemkgt,
        ];
    }
    public function messages()
    {
        return [
            'transpermohonan_id.required' => 'Permohonan harus diisi',
            'itemkegiatan_id.required' => 'Kegiatan harus diisi',
            'itemkegiatan_id.unique' => 'Item Kegiatan sudah digunakan',
        ];
    }
}
