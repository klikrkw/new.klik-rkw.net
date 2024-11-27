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
        Schema::create('keluarbiayaperm_jurnalumums', function (Blueprint $table) {
            $table->char('keluarbiayaperm_id', 10);
            $table->foreign('keluarbiayaperm_id')->references('id')->on('keluarbiayaperms')->onDelete('cascade');
            $table->char('jurnalumum_id', 10);
            $table->foreign('jurnalumum_id')->references('id')->on('jurnalumums')->onDelete('cascade');
            $table->primary(['keluarbiayaperm_id', 'jurnalumum_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keluarbiayaperm_jurnalumums');
    }
};
