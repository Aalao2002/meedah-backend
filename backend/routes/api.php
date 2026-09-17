<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CloudinarySignatureController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/signup', [AuthController::class, 'signup'])
->middleware('throttle:4,1');

Route::post('/payment/verify', [PaymentController::class, 'verify']);

Route::get('/products', [ProductController::class, 'index']);

Route::get('/products/{id}', [ProductController::class, 'showProduct']);

Route::post('/login', [AuthController::class, 'login'])
->middleware('throttle:5,1');


Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::post('/contact', [MessageController::class, 'contact']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::post('/logout', [AuthController::class, 'logoutUser']);
    Route::put('/update', [ProfileController::class, 'updateUser']);
    Route::get('/orders/{order_id}', [OrderController::class, 'show']);
    Route::get('/user', [ProfileController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/all-orders', [OrderController::class, 'showAll']);
    Route::put('/all-orders/{order_id}', [OrderController::class, 'changeOrderStatus']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/ord/{order_id}', [OrderController::class, 'adminShow']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::post('/cloudinary/signature', [CloudinarySignatureController::class, 'sign']);
});