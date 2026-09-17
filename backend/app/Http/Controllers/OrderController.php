<?php

namespace App\Http\Controllers;
use App\Models\Order;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    //ADMIN
    
    public function adminShow($order_id) {
        $order = Order::where('order_id', $order_id)->first();

        if (!$order) {
        return response()->json(['errors' => 'Order not found.'], 404);
        }

        return response()->json(['order' => $order]);
    }
    
    public function myOrders(Request $request){
        $user = $request->user();
        if(!$user) {
            return response()->json([
                    'message' => 'Unauthenticated'
            ],401);
        }
        $orders = Order::where('user_id', $user->id)->latest()->get();

        
        return response()->json([
            'message' => 'Orders fetched successfully',
            'orders' => $orders
        ],200);
    }

    public function show($order_id) {
    $order = Order::where('order_id', $order_id)
                  ->where('user_id', auth()->id())
                  ->firstOrFail();

    return response()->json([
        'order' => $order
    ]);
}
    public function showAll(Request $request) {
        $orders = Order::all();
        return response()->json([
            'message' => 'All orders fetched successfully',
            'orders' => $orders 
        ]);
    }
    public function ChangeOrderStatus(Request $request, $order_id)
    {
    $validated = $request->validate([
        'status' => ['required', 'string', Rule::in([
            'pending',
            'paid',
            'baking',
            'ready',
            'delivered',
        ])],
    ]);

    $order = Order::find($order_id);

    if (!$order) {
        return response()->json([
            'message' => 'Order not found',
        ], 404);
    }

    $order->status = $validated['status'];
    $order->save();

    return response()->json([
        'message' => 'Order status updated',
        'order' => $order,
    ]);
    }
}
