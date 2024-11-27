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
        Schema::create('itemkegiatan_grupitemkegiatans', function (Blueprint $table) {
            $table->foreignId('itemkegiatan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grupitemkegiatan_id')->constrained()->cascadeOnDelete();
            $table->primary(['itemkegiatan_id', 'grupitemkegiatan_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itemkegiatan_grupitemkegiatans');
    }
};
