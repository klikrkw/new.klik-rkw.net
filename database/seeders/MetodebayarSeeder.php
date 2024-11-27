<?php

namespace Database\Seeders;

use App\Models\Metodebayar;
use Illuminate\Database\Seeder;

class MetodebayarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Metodebayar::create(['nama_metodebayar' => 'Tunai', 'akun_id' => '1']);
        Metodebayar::create(['nama_metodebayar' => 'Transfer', 'akun_id' => '2']);
    }
}
