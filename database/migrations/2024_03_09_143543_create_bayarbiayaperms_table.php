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
        Schema::create('bayarbiayaperms', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->char('biayaperm_id', 10);
            $table->foreign('biayaperm_id')->references('id')->on('biayaperms')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();;
            $table->foreignId('metodebayar_id')->constrained()->cascadeOnDelete();;
            $table->string('info_rekening')->nullable();
            $table->integer('saldo_awal')->default(0);
            $table->integer('jumlah_bayar')->default(0);
            $table->integer('saldo_akhir')->default(0);
            $table->string('catatan_bayarbiayaperm')->nullable();
            $table->string('image_bayarbiayaperm')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bayarbiayaperms');
    }
};
