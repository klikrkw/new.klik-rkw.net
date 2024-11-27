<?php

namespace Database\Seeders;

use App\Models\Jenisakun;
use Illuminate\Database\Seeder;

class JenisakunSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Jenisakun::create(['nama_jenisakun' => 'Aktiva', 'kode_jenisakun' =>'1']);
        Jenisakun::create(['nama_jenisakun' => 'Pasiva', 'kode_jenisakun' =>'2']);
        Jenisakun::create(['nama_jenisakun' => 'Modal', 'kode_jenisakun' =>'3']);
        Jenisakun::create(['nama_jenisakun' => 'Pendapatan', 'kode_jenisakun' =>'4']);
        Jenisakun::create(['nama_jenisakun' => 'Biaya', 'kode_jenisakun' =>'5']);
    }
}
