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
        Schema::create('itemkegiatan_itemrincianbiayaperms', function (Blueprint $table) {
            $table->foreignId('itemkegiatan_id')->constrained()->index('itemkgtId');
            $table->foreignId('itemrincianbiayaperm_id')->constrained()->index('itemrcbId');
            $table->primary(['itemkegiatan_id', 'itemrincianbiayaperm_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itemkegiatan_itemrincianbiayaperms');
    }
};
