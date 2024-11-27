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
        Schema::create('tempatarsips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ruang_id')->constrained()->cascadeOnDelete();
            $table->foreignId('jenistempatarsip_id')->constrained()->cascadeOnDelete();
            $table->string('nama_tempatarsip')->unique();
            $table->string('kode_tempatarsip')->unique();
            $table->integer('baris')->default(0);
            $table->integer('kolom')->default(0);
            $table->string('image_tempatarsip')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tempatarsips');
    }
};
