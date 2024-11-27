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
        Schema::create('permohonans', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->string('nama_pelepas');
            $table->string('nama_penerima');
            $table->foreignId('jenishak_id')->constrained()->cascadeOnDelete();;
            $table->char('nomor_hak', 10);
            $table->char('persil', 10)->nullable()->default('');
            $table->char('klas', 10)->nullable()->default('');
            $table->string('atas_nama');
            $table->integer('luas_tanah')->default(0);
            $table->integer('bidang')->default(1);
            $table->enum('jenis_tanah', ['non_pertanian', 'pertanian'])->default('non_pertanian');
            $table->char('desa_id', 10);
            $table->foreign('desa_id')->references('id')->on('desas')->onDelete('cascade');
            $table->integer('nodaftar_permohonan');
            $table->integer('thdaftar_permohonan');
            $table->boolean('active')->default(false);
            $table->string('kode_unik', 25)->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permohonans');
    }
};
