<?php

 return [
    'paths' => ['api/*', 'sanctum/crsf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'http://172.20.10.4:3000', 'http://172.20.10.4:3001'],
    'allowed_origin_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'support_credentials' => true,
    
    ];