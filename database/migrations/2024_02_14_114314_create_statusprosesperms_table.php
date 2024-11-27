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
        Schema::create('statusprosesperms', function (Blueprint $table) {
            $table->id();
            $table->string('nama_statusprosesperm')->unique();
            $table->string('image_statusprosesperm');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statusprosesperms');
    }
};
