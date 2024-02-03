<?php

use App\Models\UserEntry;
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
        Schema::table('user_entries', function (Blueprint $table) {
            $table->enum("status", [
                "planning",
                "watching",
                "dnf",
                "paused",
                "completed"
            ])->default("planning");
        });

        UserEntry::whereNotNull('watched_at')->update(['status' => 'completed']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_entries', function (Blueprint $table) {
            $table->dropColumn("status");
        });
    }
};
