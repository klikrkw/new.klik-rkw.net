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
        Schema::create('rincianbiayaperm_biayaperms', function (Blueprint $table) {
            $table->char('rincianbiayaperm_id', 10);
            $table->foreign('rincianbiayaperm_id')->references('id')->on('rincianbiayaperms')->onDelete('cascade');
            $table->char('biayaperm_id', 10);
            $table->foreign('biayaperm_id')->references('id')->on('biayaperms')->onDelete('cascade');
            $table->primary(['rincianbiayaperm_id','biayaperm_id']);
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rincianbiayaperm_biayaperms');
    }
};
