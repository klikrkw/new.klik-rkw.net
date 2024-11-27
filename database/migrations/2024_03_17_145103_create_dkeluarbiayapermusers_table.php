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
        Schema::create('dkeluarbiayapermusers', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->char('keluarbiayapermuser_id', 10);
            $table->foreign('keluarbiayapermuser_id')->references('id')->on('keluarbiayapermusers')->onDelete('cascade');
            $table->char('transpermohonan_id', 10);
            $table->foreign('transpermohonan_id')->references('id')->on('transpermohonans')->onDelete('cascade');
            $table->foreignId('itemkegiatan_id')->constrained()->cascadeOnDelete();
            $table->integer('jumlah_biaya')->default(0);
            $table->string('ket_biaya')->nullable();
            $table->string('image_dkeluarbiayapermuser')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dkeluarbiayapermusers');
    }
};