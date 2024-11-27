<?php

namespace Database\Seeders;

use App\Models\Fieldcatatan;
use Illuminate\Database\Seeder;

class FieldcatatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Fieldcatatan::create(['nama_fieldcatatan' => 'catatan']);
        Fieldcatatan::create(['nama_fieldcatatan' => 'telp']);
        Fieldcatatan::create(['nama_fieldcatatan' => 'email']);
        Fieldcatatan::create(['nama_fieldcatatan' => 'no_berkasbpn']);
        Fieldcatatan::create(['nama_fieldcatatan' => 'lainnya']);
    }
}
