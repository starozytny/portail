<?php

use App\Controller\AppController;
use App\Controller\EdlController;
use App\Controller\SecurityController;
use App\Controller\UserController;
use App\Middleware\UserAuthMiddleware;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {
    $app->get('/', [SecurityController::class, 'index'])->setName('login');
    $app->post('/login', [SecurityController::class, 'loginForm'])->setName('loginForm');
    $app->get('/logout', [SecurityController::class, 'logout'])->setName('logout');
    $app->post('/lost-password', [SecurityController::class, 'lostForm'])->setName('lostForm');
    $app->get('/reinitialiser-mot-de-passe', [SecurityController::class, 'reinitPassword'])->setName('reinitPassword');

    $app->group('/legales', function (RouteCollectorProxy $group) {
        $group->get('/mentions-legales', [AppController::class, 'mentions'])->setName('mentions');
        $group->get('/politique-de-confidentialité', [AppController::class, 'politique'])->setName('politique');
        $group->get('/gestion-cookies', [AppController::class, 'cookies'])->setName('cookies');
    });

    // for auth
    $app->group('/espace-client', function (RouteCollectorProxy $group) {
        $group->get('', [AppController::class, 'homepage'])->setName('homepage');

        $group->get('/edls', [AppController::class, 'edl'])->setName('edl');
        $group->map(['GET', 'PUT'], '/edl/{id}', [EdlController::class, 'update'])->setName('edl_update');
        $group->map(['GET', 'POST'], '/edl', [EdlController::class, 'create'])->setName('edl_create');

        $group->get('/mon-compte', [AppController::class, 'user'])->setName('user');
        $group->put('/utilisateur/{id}', [UserController::class, 'update'])->setName('user_update');

    })->add(UserAuthMiddleware::class);

};
