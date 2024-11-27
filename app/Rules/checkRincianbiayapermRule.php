<?php

namespace App\Rules;

use App\Models\Drincianbiayaperm;
use App\Models\Itemkegiatan;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class checkRincianbiayapermRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // foreach ($value as $index => $item){
        //     if( !is_int($item) ){
                // $numberFormatter = new NumberFormatter('en_US', NumberFormatter::ORDINAL);
                // $fail("$attribute ". $numberFormatter->format($index) ." value is not integer!");
            // }
        // }
        $itemkegiatan = Itemkegiatan::find($value);
        $itemrincianbiayaperm_ids = [];
        if($itemkegiatan){
            if($itemkegiatan->checkbiaya){
                $itemrincianbiayaperm_ids = $itemkegiatan->itemrincianbiayaperms->pluck('id');
            }
        }
        $rec=false;
        if(count($itemrincianbiayaperm_ids) > 0){
              $itemrcb_id = $itemrincianbiayaperm_ids[0];
              $rec = Drincianbiayaperm::join('rincianbiayaperms','rincianbiayaperms.id','drincianbiayaperms.rincianbiayaperm_id')
              ->where('rincianbiayaperms.transpermohonan_id', request('transpermohonan_id'))
              ->where('rincianbiayaperms.status_rincianbiayaperm', 'approved')
              ->where('itemrincianbiayaperm_id',$itemrcb_id)->first();
        }
        if(!$rec && $itemkegiatan->checkbiaya){
            $fail($itemkegiatan?->nama_itemkegiatan ." belum masuk dalam rincian biaya !");
        }
    }
}
