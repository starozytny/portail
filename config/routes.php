<?php

use App\Controller\CoreController;
use App\Controller\SecurityController;
use App\Middleware\UserAuthMiddleware;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {
    $app->get('/', [SecurityController::class, 'index'])->setName('login');
    $app->post('/login', [SecurityController::class, 'login']);
    $app->get('/logout', [SecurityController::class, 'logout'])->setName('logout');

    // for auth
    $app->group('/espace-client', function (RouteCollectorProxy $group) {
        $group->get('', [CoreController::class, 'homepage'])->setName('homepage');
    })->add(UserAuthMiddleware::class);

};
