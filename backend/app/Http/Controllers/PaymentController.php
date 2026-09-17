<?php

namespace App\Http\Controllers;
use App\Models\Order;
use Illuminate\Support\Str;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class PaymentController extends Controller
{

    private function generateOrderId() {
        do {
            $orderId = 'MC-' . strtoupper(Str::random(6));
        } while (Order::where('order_id', $orderId)->exists());
        return $orderId;
    }

    /**public function initialize(Request $request){
        $request->validate([
            'email' => 'required|email',
            'amount' => 'required|numeric|min:1'
        ]);
        $response = Http::withToken(config('services.paystack.secret_key'))
        ->post('https://api.paystack.co/transaction/initialize', [
            'email' => $request->email,
            'amount' => $request->amount * 100,
            'currency' => 'NGN',
        ]);
        if(!$response->successful()) {
            return response()->json([
                'message' => 'Unable to initialize payment',
                'error' => $response->json()
            ],400);
        }
        return response()->json($response->json());
    }
****/
    public function verify(Request $request){
        $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'total' => 'required|numeric|min:0',
            'order_items' => 'required|array',
            'address' => 'required|string',
            'payment_reference' => 'required|nullable|string',
        ]);
        $reference = $request->payment_reference;
        $secretkey = env('PAYSTACK_SECRET_KEY');

        $response = Http::withToken($secretkey)->get("https://api.paystack.co/transaction/verify/{$reference}");
        if(!$response->successful()) {
            return response()->json([
                'message' => 'could not verify transaction'
            ],500);
        }
        $data = $response->json('data');
        if($data['status'] !== 'success') {
            return response()->json([
                'message' => 'payment was not successful'
            ], 400);
        }
        if((int)$data['amount'] !== (int)($request->total * 100)) {
            return response()->json([
                'message' => 'Amount mismatch'
            ],400);
        }
        if(Order::where('payment_reference', $reference)->exists()) {
            return response()->json([
                'message' =>'This payment has already been processed'
            ],400);
        }
        $order = Order::create([
            'user_id' => $request->user_id,
            'order_id' => $this->generateOrderId(),
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'total' => $request->total,
            'order_items' => $request->order_items,
            'payment_reference' => $reference,
            'payment_status' => 'paid',
            'status' => 'pending'
        ]);
        return response()->json([
            'order_id' => $order->order_id,
            'message' => 'Order placed successfully'
        ],201);

    }
}