<?php

namespace Database\Seeders;

use App\Models\Jenishak;
use App\Models\Kategorievent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KategorieventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Kategorievent::create(['nama_kategorievent' => 'Umum']);
        Kategorievent::create(['nama_kategorievent' => 'Klarifikasi']);
        Kategorievent::create(['nama_kategorievent' => 'Undangan']);
        Kategorievent::create(['nama_kategorievent' => 'Transaksi']);
    }
}
