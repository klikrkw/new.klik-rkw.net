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
        Schema::create('dkeluarbiayapermuser_jurnalumums', function (Blueprint $table) {
            $table->char('dkeluarbiayapermuser_id', 10);
            $table->foreign('dkeluarbiayapermuser_id')->references('id')->on('dkeluarbiayapermusers')->onDelete('cascade');
            $table->char('jurnalumum_id', 10);
            $table->foreign('jurnalumum_id')->references('id')->on('jurnalumums')->onDelete('cascade');
            $table->primary(['dkeluarbiayapermuser_id', 'jurnalumum_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dkeluarbiayapermuser_jurnalumums');
    }
};
