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
        Schema::create('drincianbiayaperms', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->char('rincianbiayaperm_id', 10);
            $table->foreign('rincianbiayaperm_id')->references('id')->on('rincianbiayaperms')->onDelete('cascade');
            $table->foreignId('itemrincianbiayaperm_id')->constrained()->cascadeOnDelete();
            $table->integer('jumlah_biaya')->default(0);
            $table->string('ket_biaya')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drincianbiayaperms');
    }
};
