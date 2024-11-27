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
        Schema::create('jurnalumums', function (Blueprint $table) {
            $table->char('id', 10)->primary();
            $table->foreignId('akun_id')->constrained()->cascadeOnDelete();
            $table->string('uraian');
            $table->integer('debet')->default(0);
            $table->integer('kredit')->default(0);
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->char('parent_id', 10)->nullable();
            $table->integer('no_urut')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jurnalumums');
    }
};
