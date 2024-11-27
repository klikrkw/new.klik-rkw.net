<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(50)->create();
        $this->call([
            PermissionSeeder::class,
            UserSeeder::class,
            JenisakunSeeder::class,
            KelompokakunSeeder::class,
            AkunSeeder::class,
            KategorieventSeeder::class,
            JenistempatarsipSeeder::class,
            JenishakSeeder::class,
            JenispermohonanSeeder::class,
            KantorSeeder::class,
            GrupitemkegiatanSeeder::class,
            StatusprosespermSeeder::class,
            ItemprosespermSeeder::class,
            FieldcatatanSeeder::class,
            MetodebayarSeeder::class,
            InstansiSeeder::class,
        ]);

        // $role = Role::create(['name' => 'admin']);
        // $user = User::factory()->create([
        //     'name' => 'Admin',
        //     'email' => 'admin@example.com',
        // ]);
        // $user->assignRole($role);
    }
}
