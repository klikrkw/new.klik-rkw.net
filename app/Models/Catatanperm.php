<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Catatanperm extends Model
{
    use HasFactory;
    protected $fillable = ['isi_catatanperm', 'fieldcatatan_id','image_catatanperm','transpermohonan_id'];
    public function fieldcatatan()
    {
        return $this->belongsTo(Fieldcatatan::class);
    }

}
