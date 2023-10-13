<?php

use App\Models\Franchise;
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
        Schema::create("entries", function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Franchise::class);
            $table->text("name");
            $table->foreignIdFor(Studio::class);
            $table->text("cover_url");
            $table->timestamp("created_at")->useCurrent();
            $table->timestamp("updated_at")->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("entries");
    }
};
