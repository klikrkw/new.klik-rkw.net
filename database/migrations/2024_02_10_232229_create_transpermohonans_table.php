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
        Schema::create('transpermohonans', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->char('permohonan_id', 10);
            $table->foreign('permohonan_id')->references('id')->on('permohonans')->onDelete('cascade');
            $table->foreignId('jenispermohonan_id')->constrained()->cascadeOnDelete();
            $table->boolean('active')->default(false);
            $table->integer('nodaftar_transpermohonan');
            $table->integer('thdaftar_transpermohonan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transpermohonans');
    }
};
