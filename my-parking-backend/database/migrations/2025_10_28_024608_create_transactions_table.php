<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('tx_id')->unique();            // tx id (dipakai di QR)         
            $table->string('customer_name')->nullable();  // data user yg disimpan setelah bayar
            $table->integer('amount')->default(2000);
            $table->enum('status', ['pending','paid','expired','failed'])->default('pending');
            $table->string('snap_token')->nullable();     // midtrans token
            $table->string('payment_url')->nullable();    // vtweb url (redirect)
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
