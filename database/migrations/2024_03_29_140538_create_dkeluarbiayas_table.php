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
        Schema::create('dkeluarbiayas', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->char('keluarbiaya_id', 10);
            $table->foreign('keluarbiaya_id')->references('id')->on('keluarbiayas')->onDelete('cascade');
            $table->foreignId('itemkegiatan_id')->constrained()->cascadeOnDelete();
            $table->integer('jumlah_biaya')->default(0);
            $table->string('ket_biaya')->nullable();
            $table->string('image_dkeluarbiaya')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dkeluarbiayas');
    }
};
