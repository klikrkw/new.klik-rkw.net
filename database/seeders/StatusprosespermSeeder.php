<?php

namespace Database\Seeders;

use App\Models\Statusprosesperm;
use Illuminate\Database\Seeder;

class StatusprosespermSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Statusprosesperm::create(['nama_statusprosesperm' => 'Pengajuan', 'image_statusprosesperm' => 'images/statusprosesperms/pengajuan_6SsOKEps.png']);
        Statusprosesperm::create(['nama_statusprosesperm' => 'Proses', 'image_statusprosesperm' => 'statusprosesperms/process__plRRckfu.png']);
        Statusprosesperm::create(['nama_statusprosesperm' => 'Revisi', 'image_statusprosesperm' => 'images/statusprosesperms/question__cAQn8vEq.png']);
        Statusprosesperm::create(['nama_statusprosesperm' => 'Selesai', 'image_statusprosesperm' => 'images/statusprosesperms/check_ReoIlBXs.png']);
    }
}
