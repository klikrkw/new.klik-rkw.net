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
        Schema::create('jenistempatarsips', function (Blueprint $table) {
            $table->id();
            $table->string('nama_jenistempatarsip')->unique();
            $table->string('image_jenistempatarsip')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenistempatarsips');
    }
};
