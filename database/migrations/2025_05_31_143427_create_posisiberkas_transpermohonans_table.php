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
        Schema::create('posisiberkas_transpermohonans', function (Blueprint $table) {
            $table->char('transpermohonan_id', 10);
            $table->foreign('transpermohonan_id')->references('id')->on('transpermohonans')->onDelete('cascade');
            $table->char('posisiberkas_id', 10);
            $table->foreign('posisiberkas_id')->references('id')->on('posisiberkas')->onDelete('cascade');
            $table->primary(['transpermohonan_id', 'posisiberkas_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posisiberkas_transpermohonans');
    }
};
