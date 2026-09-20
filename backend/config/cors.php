<?php

 return [
    'paths' => ['api/*', 'sanctum/crsf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://meedahbakes.netlify.app'],
    'allowed_origin_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'support_credentials' => true,
    
    ];
