<?php

use App\Models\Studio;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table("entries", function (Blueprint $table) {
            $table->dropColumn("studio_id");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("entries", function (Blueprint $table) {
            $table->foreignIdFor(Studio::class);
        });
    }
};
