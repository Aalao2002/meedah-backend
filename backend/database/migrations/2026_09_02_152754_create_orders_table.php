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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()
            ->constrained()
            ->nullOnDelete();
            $table->string('order_id')->unique();
            $table->string('firstName');
            $table->string('lastName');
            $table->string('phone');
            $table->text('address');
            $table->decimal('total',10,2);
            $table->string('payment_reference')->unique()->nullable();
            $table->json('order_items');
            $table->enum('payment_status', ['pending','paid','failed'])->default('pending');
            $table->enum('status',['pending', 'paid', 'ready','baking','delivered'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
