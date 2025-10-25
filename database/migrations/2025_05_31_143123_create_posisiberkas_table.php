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
        Schema::create('posisiberkas', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->foreignId('tempatberkas_id')->constrained()->index('tempatberkasId');
            $table->integer('row')->default(0);
            $table->integer('col')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posisiberkas');
    }
};
