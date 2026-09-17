<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CloudinarySignatureController extends Controller
{
    /**
     * Generate a signature for a direct-to-Cloudinary upload from the browser.
     * The frontend never sees CLOUDINARY_API_SECRET — only this signed,
     * time-boxed payload, which Cloudinary validates on its end.
     */
    public function sign(Request $request)
    {
        $timestamp = now()->timestamp;

        // Accept any extra params the frontend plans to upload with
        // (e.g. upload_preset, public_id, tags) so they're always
        // included in the signature — never signed separately from
        // what's actually sent to Cloudinary.
        $extraParams = $request->except(['file']);

        $paramsToSign = array_merge($extraParams, [
            'folder' => $request->input('folder', 'products'),
            'timestamp' => $timestamp,
        ]);

        ksort($paramsToSign);

        $paramString = collect($paramsToSign)
            ->map(fn ($value, $key) => "{$key}={$value}")
            ->implode('&');

        $secret = config('services.cloudinary.api_secret');

        if (!$secret) {
            return response()->json([
                'message' => 'Cloudinary API secret is not configured on the server.',
            ], 500);
        }

        $signature = sha1($paramString . $secret);

        return response()->json([
            'signature' => $signature,
            'timestamp' => $timestamp,
            'api_key' => config('services.cloudinary.api_key'),
            'cloud_name' => config('services.cloudinary.cloud_name'),
            ...$paramsToSign,
        ]);
    }
}