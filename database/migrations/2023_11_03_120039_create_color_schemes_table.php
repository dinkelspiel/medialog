<?php

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
        Schema::create("color_schemes", function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->foreignIdFor(User::class, "creator_id");
            $table->char("background", 7)->default("#FFFBFE");
            $table->char("card", 7)->default("#FAF1F0");
            $table->char("card_hover", 7)->default("#F2DBD9");
            $table->char("card_active", 7)->default("#EDCDC9");
            $table->char("secondary", 7)->default("#d1857b");
            $table->char("secondary_hover", 7)->default("#c6685d");
            $table->char("secondary_active", 7)->default("#d6938a");
            $table->char("outline", 7)->default("#E6BEB7");
            $table->char("text", 7)->default("#1C1B1F");
            $table->char("text_gray", 7)->default("#A3A3A3");
            $table->timestamps();
        });

        Schema::table("users", function (Blueprint $table) {
            $table->dropColumn("color_scheme");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("color_schemes");

        Schema::table("users", function (Blueprint $table) {
            $table
                ->enum("color_scheme", ["auto", "dark", "light"])
                ->default("auto");
        });
    }
};
