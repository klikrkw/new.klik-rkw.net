<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'admin', 'guard_name' => 'web']);
        Permission::create(['name' => 'transaksi', 'guard_name' => 'web']);
        Permission::create(['name' => 'kasir', 'guard_name' => 'web']);
        Permission::create(['name' => 'staf', 'guard_name' => 'web']);
        Permission::create(['name' => 'Access All Permohonan - Proses Permohonan', 'guard_name' => 'web']);
        Permission::create(['name' => 'Access All Permohonan - Biaya Permohonan', 'guard_name' => 'web']);
        Permission::create(['name' => 'Access All Permohonan - Rincian Biaya Permohonan', 'guard_name' => 'web']);
        Permission::create(['name' => 'Access All Permohonan - Kasbon', 'guard_name' => 'web']);    }
}
