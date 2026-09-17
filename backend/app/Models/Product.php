<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'original_price',
        'image_url',
        'image_public_id',
        'sizes',
        'colors',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'sizes' => 'array',
        'colors' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
    ];

    protected static function booted(): void
{
    static::creating(function (Product $product) {
        if (empty($product->slug)) {
            $product->slug = static::generateUniqueSlug($product->name);
        }
    });

    static::updating(function (Product $product) {
        if ($product->isDirty('name')) {
            $product->slug = static::generateUniqueSlug($product->name, $product->id);
        }
    });
}

private static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
{
    $base = Str::slug($name);
    $slug = $base;
    $i = 1;

    $query = fn ($s) => static::where('slug', $s)
        ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId));

    while ($query($slug)->exists()) {
        $slug = "{$base}-{$i}";
        $i++;
    }

    return $slug;
}
    /**
     * Get the user that owns the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}