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
        Schema::table('transpermohonans', function (Blueprint $table) {
        $table->char('nomor_haktp', 10)->nullable();
        $table->string('atas_namatp')->nullable();
        $table->integer('luas_tanahtp')->default(0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transpermohonans', function (Blueprint $table) {
            $table->dropColumn('nomor_haktp');
            $table->dropColumn('atas_namatp');
            $table->dropColumn('luas_tanahtp');
        });

    }
};
