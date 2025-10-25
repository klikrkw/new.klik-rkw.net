<?php

namespace App\Rules;

use App\Models\Biayaperm;
use App\Models\Drincianbiayaperm;
use App\Models\Itemkegiatan;
use App\Models\Permohonan;
use App\Models\Transpermohonan;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class checkBiayaRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $transpermohonan_id = request('transpermohonan_id');
        $tf = Transpermohonan::find($transpermohonan_id);
        if($tf){
            $pm = $tf->permohonan;
            if(!$pm->active){
                    $fail("Permohonan belum aktif, silahkan hubungi admin! ");
            }
            $cek_biaya = $pm?$pm->cek_biaya:false;
            if($cek_biaya){
                $by = Biayaperm::where('transpermohonan_id','=',$transpermohonan_id)->get()->first();
                if(!$by){
                    $fail("Biaya Permohonan belum disetorkan!");
                }
            }
        }
    }
}
