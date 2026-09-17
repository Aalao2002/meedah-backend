<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //
    public function index(){
        $user = User::select('id', 'name', 'email', 'created_at')->get();
        return response()->json([
            'success' => true,
            'data' => $user,
        ],200);
    }
}
