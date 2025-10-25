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
        Schema::create('itemkegiatan_itemprosesperms', function (Blueprint $table) {
            $table->foreignId('itemprosesperm_id')->constrained()->index('itemprosespermId');
            $table->foreignId('itemkegiatan_id')->constrained()->index('itemkegiatanId');
            $table->primary(['itemprosesperm_id', 'itemkegiatan_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itemkegiatan_itemprosesperms');
    }
};
