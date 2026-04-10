<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'tx_id','tmdb_id','customer_name',
        'amount','status','snap_token','payment_url','paid_at'
    ];

    protected $casts = [
        'paid_at' => 'datetime',
    ];
}
