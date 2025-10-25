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
        Schema::create('tempatberkas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ruang_id')->constrained()->cascadeOnDelete();
            $table->foreignId('jenistempatarsip_id')->constrained()->cascadeOnDelete();
            $table->string('nama_tempatberkas')->unique();
            $table->integer('row_count')->default(0);
            $table->integer('col_count')->default(0);
            $table->string('image_tempatberkas')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tempatberkas');
    }
};
