<?php

namespace App\Http\Requests;

use App\Models\Itemkegiatan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKeluarbiayapermRequest extends FormRequest
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
        $val_itemkgt = ['required'];
        $itemkegiatan = Itemkegiatan::find(request('itemkegiatan_id'));
        $isunique = $itemkegiatan ? $itemkegiatan->isunique : false;
        if ($isunique) {
            $val_itemkgt =  ['required', Rule::unique('keluarbiayaperms', 'itemkegiatan_id')->where('transpermohonan_id', request('transpermohonan_id'))];
        }
        return [
            'transpermohonan_id' => ['required'],
            'jumlah_keluarbiayaperm' => ['required', 'numeric', 'min:1'],
            'metodebayar_id' => ['required'],
            'itemkegiatan_id' => $val_itemkgt,
            'catatan_keluarbiayaperm' => ['nullable'],
            'image_keluarbiayaperm' => ['nullable']
        ];
    }
    public function messages()
    {
        return [
            'itemkegiatan_id.unique' => 'Item Kegiatan sudah digunakan',
        ];
    }
}
