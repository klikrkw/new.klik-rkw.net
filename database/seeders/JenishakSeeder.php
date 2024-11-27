<?php

namespace Database\Seeders;

use App\Models\Jenishak;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JenishakSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Jenishak::create(['nama_jenishak' => 'Hak Milik Adat', 'singkatan' => 'C']);
        Jenishak::create(['nama_jenishak' => 'Hak Milik', 'singkatan' => 'HM']);
        Jenishak::create(['nama_jenishak' => 'Hak Guna Bangunan', 'singkatan' => 'HGB']);
        Jenishak::create(['nama_jenishak' => 'Hak Guna Usaha', 'singkatan' => 'HGU']);
    }
}
