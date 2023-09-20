<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename('entry_actors', 'entry_cast');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('entry_cast', 'entry_actors');
    }
};
