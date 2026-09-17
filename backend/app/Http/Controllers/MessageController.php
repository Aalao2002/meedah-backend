<?php

namespace App\Http\Controllers;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function contact (Request $request) {
        $incomingFields = $request->validate([
            'name' => 'required|string|max:25',
            'email' => 'required|email',
            'message' => 'required|min:10'
        ]);

        Message::create($incomingFields);
        return response()->json([
            'message' => 'message sent!'
        ],200);
    }
}
