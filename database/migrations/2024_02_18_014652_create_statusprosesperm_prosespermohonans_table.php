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
        Schema::create('statusprosesperm_prosespermohonans', function (Blueprint $table) {
            $table->char('prosespermohonan_id', 10);
            $table->foreign('prosespermohonan_id')->references('id')->on('prosespermohonans')->onDelete('cascade');
            $table->foreignId('statusprosesperm_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('catatan_statusprosesperm')->nullable();
            $table->timestamps();
            $table->primary(['prosespermohonan_id', 'statusprosesperm_id']);
            $table->boolean('active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statusprosesperm_prosespermohonans');
    }
};
