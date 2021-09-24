<?php

use App\Controller\CoreController;
use Slim\App;

return function (App $app) {
    $app->get('/', [CoreController::class, 'homepage']);
    $app->get('/contact', [CoreController::class, 'contact']);
};
