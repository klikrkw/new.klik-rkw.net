<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pemohons', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->string('nama_pemohon');
            $table->string('alamat_pemohon');
            $table->string('email_pemohon')->nullable();
            $table->string('telp_pemohon')->nullable();
            $table->string('nik_pemohon')->unique()->nullable();
            $table->boolean('active')->default(false);
            $table->integer('nodaftar_pemohon');
            $table->integer('thdaftar_pemohon');
            $table->unique(["nodaftar_pemohon", "thdaftar_pemohon"], 'nodaftar_unique');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pemohons', function (Blueprint $table) {
            $table->dropUnique('nodaftar_unique');
        });
        Schema::dropIfExists('pemohons');
    }
};
