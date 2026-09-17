<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->when(! $request->user() || $request->user()->role !== 'admin', function ($query) {
                $query->where('is_active', true);
            })
            ->latest()
            ->paginate(20);

        return response()->json($products);
    }

    public function show(Request $request) {
        $products = Product::all();
        return response()->json([
            'message' => 'products fetched successfully',
            'products' => $products

        ]);
    }
    public function showProduct($productId) {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $this->validateProduct($request);
        $validated['created_by'] = $request->user()->id;

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $this->validateProduct($request, $product->id);
        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }

    private function validateProduct(Request $request, ?int $ignoreId = null): array 
    {
    return $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'original_price' => 'nullable|numeric|min:0|gte:price',
        'image_url' => 'required|url',
        'image_public_id' => 'required|string',
        'is_active' => 'boolean',

        'sizes' => 'nullable|array',
        'sizes.*.value' => 'required_with:sizes|string',
        'sizes.*.label' => 'required_with:sizes|string',
        'sizes.*.available' => 'boolean',
        'sizes.*.price' => 'nullable|numeric|min:0',
        'sizes.*.original_price' => 'nullable|numeric|min:0',

        'colors' => 'nullable|array',
        'colors.*.value' => 'required_with:colors|string',
        'colors.*.name' => 'required_with:colors|string',
        'colors.*.hex' => 'required_with:colors|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);
    }
}