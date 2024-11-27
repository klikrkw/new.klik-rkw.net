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
        Schema::create('keluarbiayaperms', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->char('transpermohonan_id', 10);
            $table->foreign('transpermohonan_id')->references('id')->on('transpermohonans')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('itemkegiatan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('metodebayar_id')->constrained()->cascadeOnDelete();
            $table->integer('jumlah_keluarbiayaperm')->default(0);
            $table->string('catatan_keluarbiayaperm')->nullable();
            $table->string('image_keluarbiayaperm')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keluarbiayaperms');
    }
};
