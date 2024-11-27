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
        Schema::create('keluarbiayapermusers', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('instansi_id')->constrained()->cascadeOnDelete();
            $table->foreignId('metodebayar_id')->constrained()->cascadeOnDelete();
            $table->integer('saldo_awal')->default(0);
            $table->integer('jumlah_biaya')->default(0);
            $table->integer('saldo_akhir')->default(0);
            $table->enum('status_keluarbiayapermuser', ['wait_approval', 'approved', 'cancelled', 'rejected' => 'rejected'])->default('wait_approval');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keluarbiayapermusers');
    }
};
