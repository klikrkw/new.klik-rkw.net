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
        Schema::table('itemkegiatans', function (Blueprint $table) {
            $table->boolean('checkbiaya')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('itemkegiatans', function (Blueprint $table) {
            $table->dropColumn('checkbiaya');
        });
    }
};
