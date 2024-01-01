<?php

use App\Models\UserEntry;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table("user_entries", function (Blueprint $table) {
            $table->smallInteger("progress")->default(0);
        });

        DB::table("user_entries")
            ->join("entries", "user_entries.entry_id", "=", "entries.id")
            ->where("user_entries.status", "completed")
            ->update(["user_entries.progress" => DB::raw("entries.length")]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("user_entries", function (Blueprint $table) {
            $table->dropColumn("progress");
        });
    }
};
