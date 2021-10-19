<?php

// Should be set to 0 in production
error_reporting(0);

use App\Command\TransfertCommand;

// Should be set to '0' in production
ini_set('display_errors', '0');

// Timezone
date_default_timezone_set('Europe/Paris');

// Settings
$settings = [];

require __DIR__ . '/config.php';

$settings['public'] = $_SERVER['DOCUMENT_ROOT'] . '/public';

// Path settings
$settings['root'] = dirname(__DIR__);

// Error Handling Middleware settings
$settings['error'] = [

    // Should be set to false in production
    'display_error_details' => false,

    // Parameter is passed to the default ErrorHandler
    // View in rendered output by enabling the "displayErrorDetails" setting.
    // For the console and unit tests we also disable it
    'log_errors' => true,

    // Display error details in error log
    'log_error_details' => true,
];

$settings['twig'] = [
    // Template paths
    'paths' => [
        __DIR__ . '/../templates',
    ],
    // Twig environment options
    'options' => [
        // Should be set to true in production
        'cache_enabled' => false,
        'cache_path' => __DIR__ . '/../tmp/twig',
    ],
];

$settings['session'] = [
    'name' => 'portailfokus',
    'cache_expire' => 0,
];

$settings['commands'] = [
    TransfertCommand::class,
];

return $settings;