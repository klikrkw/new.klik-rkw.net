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
        Schema::create('dkeluarbiaya_jurnalumums', function (Blueprint $table) {
            $table->char('dkeluarbiaya_id', 10);
            $table->foreign('dkeluarbiaya_id')->references('id')->on('dkeluarbiayas')->onDelete('cascade');
            $table->char('jurnalumum_id', 10);
            $table->foreign('jurnalumum_id')->references('id')->on('jurnalumums')->onDelete('cascade');
            $table->primary(['dkeluarbiaya_id', 'jurnalumum_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dkeluarbiaya_jurnalumums');
    }
};
