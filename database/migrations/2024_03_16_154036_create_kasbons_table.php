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
        Schema::create('kasbons', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->integer('jumlah_kasbon')->default(0);
            $table->integer('jumlah_penggunaan')->default(0);
            $table->integer('sisa_penggunaan')->default(0);
            $table->string('keperluan');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status_kasbon', ['wait_approval', 'approved', 'cancelled', 'used', 'finish'])->default('wait_approval');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kasbons');
    }
};
