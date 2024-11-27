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
        Schema::create('rincianbiayaperms', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->char('transpermohonan_id', 10);
            $table->foreign('transpermohonan_id')->references('id')->on('transpermohonans')->onDelete('cascade');
            $table->string('ket_rincianbiayaperm')->nullable();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status_rincianbiayaperm', ['wait_approval', 'approved', 'cancelled', 'used'])->default('wait_approval');
            $table->integer('total_pemasukan')->default(0);
            $table->integer('total_pengeluaran')->default(0);
            $table->integer('total_piutang')->default(0);
            $table->integer('sisa_saldo')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rincianbiayaperms');
    }
};
