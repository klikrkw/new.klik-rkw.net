<?php

namespace Database\Seeders;

use App\Models\Itemprosesperm;
use Illuminate\Database\Seeder;

class ItemprosespermSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Itemprosesperm::create(['nama_itemprosesperm' => 'Cek Plot El']);
        Itemprosesperm::create(['nama_itemprosesperm' => 'Buku Tanah El']);
    }
}
