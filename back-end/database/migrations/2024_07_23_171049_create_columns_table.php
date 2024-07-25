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
        Schema::create('columns', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sheet_id');
            $table->string('name');
            $table->string('data_type'); // You can adjust the data type as needed
            $table->integer('order');
            $table->timestamps();

            $table->foreign('sheet_id')->references('id')->on('sheets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('columns');
    }
};
