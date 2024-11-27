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
        Schema::create('prosespermohonans', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->char('transpermohonan_id', 10);
            $table->foreign('transpermohonan_id')->references('id')->on('transpermohonans')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();;
            $table->foreignId('itemprosesperm_id')->constrained()->cascadeOnDelete();;
            $table->string('catatan_prosesperm')->nullable();
            $table->boolean('active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prosespermohonans');
    }
};
