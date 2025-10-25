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
        Schema::table('rekenings', function (Blueprint $table) {
            $table->foreignId('metodebayar_id')->constrained()->cascadeOnDelete();
            });
        }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rekenings', function (Blueprint $table) {
            $table->dropColumn('metodebayar_id');
        });
    }
};
