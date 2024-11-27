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
        Schema::create('kelompokakuns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jenisakun_id')->constrained()->cascadeOnDelete();
            $table->string('nama_kelompokakun', 100);
            $table->string('kode_kelompokakun')->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelompokakuns');
    }
};
