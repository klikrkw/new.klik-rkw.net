<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProsespermohonanApiRequest extends FormRequest
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
        return [
            'transpermohonan_id' => ['required'],
            'itemprosesperm_id' => ['required', Rule::unique('prosespermohonans', 'itemprosesperm_id')->where('transpermohonan_id', request('transpermohonan_id'))],
            'catatan_prosesperm' => ['nullable'],
            'statusprosesperm_id' => ['required'],
            'is_alert'=>['required'],
            'start'=>['required'],
            'end'=>['required'],
        ];
    }

    public function messages()
    {
        return [
            'itemprosesperm_id.unique' => 'Itemproses sudah ada/duplikasi',
        ];
    }
}
