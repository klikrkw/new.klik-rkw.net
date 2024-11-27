<?php

namespace Database\Seeders;

use App\Models\Kantor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KantorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Kantor::create(['nama_kantor' => 'Rekowarno', 'alamat_kantor'=>'Jl dr Susanto Pati']);
        Kantor::create(['nama_kantor' => 'Ngagul', 'alamat_kantor'=>'Muktiharjo, Margorejo']);
    }
}
