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
        Schema::create('itemrincianbiayaperms', function (Blueprint $table) {
            $table->id();
            $table->string('nama_itemrincianbiayaperm')->unique();
            $table->integer('min_value')->default(0);
            $table->string('command_itemrincianbiayaperm')->nullable();
            $table->enum('jenis_itemrincianbiayaperm', ['pemasukan', 'pengeluaran','piutang'])->default('pemasukan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itemrincianbiayaperms');
    }
};
