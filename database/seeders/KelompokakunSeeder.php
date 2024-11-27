<?php

namespace Database\Seeders;

use App\Models\Kelompokakun;
use Illuminate\Database\Seeder;

class KelompokakunSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Kelompokakun::create(['id' =>'1','jenisakun_id'=>'1','nama_kelompokakun'=>'Aktiva Lancar','kode_kelompokakun'=>'101']);
        Kelompokakun::create(['id' =>'2','jenisakun_id'=>'1','nama_kelompokakun'=>'Aktiva Tetap','kode_kelompokakun'=>'102']);
        Kelompokakun::create(['id' =>'3','jenisakun_id'=>'2','nama_kelompokakun'=>'Kewajiban Lancar','kode_kelompokakun'=>'201']);
        Kelompokakun::create(['id' =>'4','jenisakun_id'=>'2','nama_kelompokakun'=>'Kewajiban Jangka Panjang','kode_kelompokakun'=>'202']);
        Kelompokakun::create(['id' =>'5','jenisakun_id'=>'4','nama_kelompokakun'=>'Pendapatan Operasional','kode_kelompokakun'=>'401']);
        Kelompokakun::create(['id' =>'6','jenisakun_id'=>'4','nama_kelompokakun'=>'Pendapatan Non Operasional','kode_kelompokakun'=>'402']);
        Kelompokakun::create(['id' =>'7','jenisakun_id'=>'4','nama_kelompokakun'=>'Pendapatan Lainnya','kode_kelompokakun'=>'403']);
        Kelompokakun::create(['id' =>'8','jenisakun_id'=>'5','nama_kelompokakun'=>'Biaya Operasional','kode_kelompokakun'=>'501']);
        Kelompokakun::create(['id' =>'9','jenisakun_id'=>'5','nama_kelompokakun'=>'Biaya Non Operasional','kode_kelompokakun'=>'502']);
        Kelompokakun::create(['id' =>'10','jenisakun_id'=>'3','nama_kelompokakun'=>'Modal','kode_kelompokakun'=>'301']);
    }
}
