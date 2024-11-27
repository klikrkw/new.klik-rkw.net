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
        Schema::create('bayarbiayaperm_jurnalumums', function (Blueprint $table) {
            $table->char('bayarbiayaperm_id', 10);
            $table->foreign('bayarbiayaperm_id')->references('id')->on('bayarbiayaperms')->onDelete('cascade');
            $table->char('jurnalumum_id', 10);
            $table->foreign('jurnalumum_id')->references('id')->on('jurnalumums')->onDelete('cascade');
            $table->primary(['bayarbiayaperm_id', 'jurnalumum_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bayarbiayaperm_jurnalumums');
    }
};
