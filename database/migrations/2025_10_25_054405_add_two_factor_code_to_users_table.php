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
        Schema::table('users', function (Blueprint $table) {
            $table->integer('two_factor_code')->nullable();
            $table->boolean('two_factor_enabled')->default(false);
            $table->timestamp('expires_at')->default(DB::raw('CURRENT_TIMESTAMP'))->nullable();
            //
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->dropColumn('two_factor_code');
            $table->dropColumn('two_factor_enabled');
            $table->dropColumn('expires_at');
        });
    }
};
