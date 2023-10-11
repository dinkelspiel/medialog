<?php

use App\Models\Entry;
use App\Models\Studio;
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
        Schema::create('entry_studios', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Entry::class);
            $table->foreignIdFor(Studio::class);
            $table->timestamps();
        });

        foreach(Entry::all() as $entry)
        {

        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entry_studios');
    }
};
