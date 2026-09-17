<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = [
            'order_id',
            'user_id',
            'firstName',
            'lastName',
            'email',
            'phone',
            'total',
            'order_items',
            'payment_status',
            'status',
            'address',
            'payment_reference',
        ];
        
    protected $casts = [
        'order_items' => 'array',
        'total' => 'decimal:2'
    ];

        /**
         * Get the user that owns the Order
         *
         * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
         */
        public function user(): BelongsTo
        {
            return $this->belongsTo(User::class, 'user_id',);
        }
    
}
