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
        Schema::create('postingjurnals', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->string('uraian')->nullable();
            $table->bigInteger('akun_debet')->nullable();
            $table->bigInteger('akun_kredit')->nullable();
            $table->integer('jumlah')->default(0);
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('postingjurnals');
    }
};
