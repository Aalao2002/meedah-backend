<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function updateUser(Request $request) {
        $user = $request->user();
        if(!$user) {
            return response->json(['message' => 'user not logged']);
        }

        $updated_fields = $request->validate([
            'firstName' => 'sometimes|string|max:255',
            'lastName' => 'sometimes|string|max:255',
            'phone' =>    'nullable|string|max:20',

        ]);
        $user->update($updated_fields);
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ],200);
    }

    public function index(Request $request) {
        $user = $request->user();
        return response()->json([
            'user' => [
                'id' => $user->id,
                'firstName' => $user->firstName,
                'lastName' => $user->lastName,
                'email' => $user->email,
                'phone' => $user->phone
            ]
        ]);
    }
}
