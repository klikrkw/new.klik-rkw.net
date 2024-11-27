<?php

namespace Database\Seeders;

use App\Models\Jenispermohonan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JenispermohonanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Jenispermohonan::create(['nama_jenispermohonan' => 'Jual Beli']);
        Jenispermohonan::create(['nama_jenispermohonan' => 'Hibah']);
        Jenispermohonan::create(['nama_jenispermohonan' => 'PHB']);
        Jenispermohonan::create(['nama_jenispermohonan' => 'Waris']);
        Jenispermohonan::create(['nama_jenispermohonan' => 'Penggantian']);
        Jenispermohonan::create(['nama_jenispermohonan' => 'Pemecahan']);
        Jenispermohonan::create(['nama_jenispermohonan' => 'Pengakuan Hak Adat']);
        Jenispermohonan::create(['nama_jenispermohonan' => 'Permohonan Hak']);
        Jenispermohonan::create(['nama_jenispermohonan' => 'Roya']);
    }
}
