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
        Schema::create('keluarbiaya_kasbons', function (Blueprint $table) {
            $table->char('keluarbiaya_id', 10);
            $table->foreign('keluarbiaya_id')->references('id')->on('keluarbiayas')->onDelete('cascade');
            $table->char('kasbon_id', 10);
            $table->foreign('kasbon_id')->references('id')->on('kasbons')->onDelete('cascade');
            $table->primary(['keluarbiaya_id', 'kasbon_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keluarbiaya_kasbons');
    }
};
