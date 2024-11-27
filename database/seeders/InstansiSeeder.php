<?php

namespace Database\Seeders;

use App\Models\Instansi;
use Illuminate\Database\Seeder;

class InstansiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Instansi::create(['nama_instansi' => 'Kantor', 'info_instansi' => 'kantor notaris']);
        Instansi::create(['nama_instansi' => 'BPN', 'info_instansi' => 'Kantor BPN Pati']);
        Instansi::create(['nama_instansi' => 'BPKAD', 'info_instansi' => 'BPKAD Pratama']);
        Instansi::create(['nama_instansi' => 'KPP Pratama', 'info_instansi' => 'KPP Pratama']);
        Instansi::create(['nama_instansi' => 'Lainnya', 'info_instansi' => 'Kantor Lainnya']);
    }
}
