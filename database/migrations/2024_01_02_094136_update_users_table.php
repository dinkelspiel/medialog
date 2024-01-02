<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table("users", function (Blueprint $table) {
            $table->timestamp("daily_streak_started")->useCurrent();
            $table->timestamp("daily_streak_updated")->useCurrent();
            $table->smallInteger("daily_streak_length")->default(0);
            $table->smallInteger("daily_streak_longest")->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("users", function (Blueprint $table) {
            $table->dropColumn("daily_streak_started");
            $table->dropColumn("daily_streak_updated");
            $table->dropColumn("daily_streak_length");
            $table->dropColumn("daily_streak_longest");
        });
    }
};
