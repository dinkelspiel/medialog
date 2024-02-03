<?php

use App\Models\Entry;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("user_entries", function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Entry::class);
            $table->integer("rating")->unsigned();
            $table->text("notes");
            $table->foreignIdFor(User::class);
            $table->timestamp("created_at")->useCurrent();
            $table->timestamp("updated_at")->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("user_entries");
    }
};
