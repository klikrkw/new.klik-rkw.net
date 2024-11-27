<?php

namespace Database\Seeders;

use App\Models\Grupitemkegiatan;
use Illuminate\Database\Seeder;

class GrupitemkegiatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Grupitemkegiatan::create(['nama_grupitemkegiatan' => 'pemasukan', 'slug'=>'pemasukan']);
        Grupitemkegiatan::create(['nama_grupitemkegiatan' => 'pengeluaran', 'slug'=>'pengeluaran']);
        Grupitemkegiatan::create(['nama_grupitemkegiatan' => 'kantor', 'slug'=>'kantor']);
        Grupitemkegiatan::create(['nama_grupitemkegiatan' => 'umum', 'slug'=>'umum']);
        Grupitemkegiatan::create(['nama_grupitemkegiatan' => 'bpkad', 'slug'=>'bpkad']);
        Grupitemkegiatan::create(['nama_grupitemkegiatan' => 'kpp pratama', 'slug'=>'kpp_pratama']);
    }
}
