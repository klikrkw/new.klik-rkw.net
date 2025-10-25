<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('prosespermohonans', function (Blueprint $table) {
            $table->boolean('is_alert')->default(false);
            $table->timestamp('start')->default(DB::raw('CURRENT_TIMESTAMP'))->nullable();
            $table->timestamp('end')->default(DB::raw('CURRENT_TIMESTAMP'))->nullable();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prosespermohonans', function (Blueprint $table) {
            $table->dropColumn('is_alert');
            $table->dropColumn('start');
            $table->dropColumn('end');
        });
    }
};
