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
        Schema::table("color_schemes", function (Blueprint $table) {
            $table->char("background", 7)->default("#FFFFFF")->change();
            $table->char("card", 7)->default("#F5F5F5")->change();
            $table->char("card_hover", 7)->default("#F2DBD9")->change();
            $table->char("card_active", 7)->default("#EDCDC9")->change();
            $table->char("secondary", 7)->default("#E16449")->change();
            $table->char("secondary_hover", 7)->default("#E4755D")->change();
            $table->char("secondary_active", 7)->default("#E98F7C")->change();
            $table->char("outline", 7)->default("#D1D1D1")->change();
            $table->char("text", 7)->default("#1C1B1F")->change();
            $table->char("text_gray", 7)->default("#808080")->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
