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
        Schema::create('doxes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users'); // Foreign key to users
            $table->string('title'); // Title of the document
            $table->mediumText('content'); // Rich text content (HTML)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doxes');
    }
};
