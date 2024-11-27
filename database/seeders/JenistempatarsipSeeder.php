<?php

namespace Database\Seeders;

use App\Models\Jenistempatarsip;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JenistempatarsipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Jenistempatarsip::create(['nama_jenistempatarsip' => 'Almari']);
        Jenistempatarsip::create(['nama_jenistempatarsip' => 'Almari Kabinet']);
        Jenistempatarsip::create(['nama_jenistempatarsip' => 'Loker']);
        Jenistempatarsip::create(['nama_jenistempatarsip' => 'Rak Berkas']);
        Jenistempatarsip::create(['nama_jenistempatarsip' => 'Meja']);
        Jenistempatarsip::create(['nama_jenistempatarsip' => 'Lainnya']);
    }
}
