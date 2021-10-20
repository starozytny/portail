<?php

use App\Controller\AppController;
use App\Controller\Bibli\BibliController;
use App\Controller\Bibli\CounterController;
use App\Controller\Bibli\ElementController;
use App\Controller\EdlController;
use App\Controller\ModelController;
use App\Controller\PropertyController;
use App\Controller\SecurityController;
use App\Controller\TenantController;
use App\Controller\UserController;
use App\Middleware\UserAuthMiddleware;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {
    $app->get('/', [SecurityController::class, 'index'])->setName('login');
    $app->post('/login', [SecurityController::class, 'loginForm'])->setName('loginForm');
    $app->get('/logout', [SecurityController::class, 'logout'])->setName('logout');
    $app->post('/lost-password', [SecurityController::class, 'lostForm'])->setName('lostForm');
    $app->get('/reinitialiser-mot-de-passe/{token}-{code}', [SecurityController::class, 'reinitPassword'])->setName('reinitPassword');
    $app->put('/update-password/{username}-{id}', [UserController::class, 'updatePassword'])->setName('updatePassword');

    $app->group('/legales', function (RouteCollectorProxy $group) {
        $group->get('/mentions-legales', [AppController::class, 'mentions'])->setName('mentions');
        $group->get('/politique-de-confidentialité', [AppController::class, 'politique'])->setName('politique');
        $group->get('/gestion-cookies', [AppController::class, 'cookies'])->setName('cookies');
    });

    // for auth
    $app->group('/espace-client', function (RouteCollectorProxy $group) {
        $group->get('', [AppController::class, 'homepage'])->setName('homepage');
        $group->get('/documentation', [AppController::class, 'documentation'])->setName('documentation');
        $group->get('/documentation-portail', [AppController::class, 'documentationPortail'])->setName('documentationPortail');

        $group->get('/edls/{status}', [AppController::class, 'edl'])->setName('edl');
        $group->map(['GET', 'PUT'], '/edl/{id}', [EdlController::class, 'update'])->setName('edl_update');
        $group->delete('/edl/{id}', [EdlController::class, 'delete'])->setName('edl_delete');
        $group->map(['GET', 'POST'], '/edl', [EdlController::class, 'create'])->setName('edl_create');
        $group->get('/edl-pdf/{uid}', [EdlController::class, 'pdf'])->setName('edl_pdf');

        $group->get('/mon-compte', [AppController::class, 'user'])->setName('user');
        $group->put('/utilisateur/{id}', [UserController::class, 'update'])->setName('user_update');
        $group->delete('/utilisateur/{id}', [UserController::class, 'delete'])->setName('user_delete');
        $group->post('/utilisateur', [UserController::class, 'create'])->setName('user_create');

        $group->get('/biens', [AppController::class, 'property'])->setName('property_index');
        $group->post('/property', [PropertyController::class, 'create'])->setName('property_create');
        $group->put('/property/{id}', [PropertyController::class, 'update'])->setName('property_update');
        $group->delete('/property/{id}', [PropertyController::class, 'delete'])->setName('property_delete');
        $group->post('/property-check', [PropertyController::class, 'check'])->setName('property_check');

        $group->get('/locataires', [AppController::class, 'tenant'])->setName('tenant_index');
        $group->post('/tenant', [TenantController::class, 'create'])->setName('tenant_create');
        $group->put('/tenant/{id}', [TenantController::class, 'update'])->setName('tenant_update');
        $group->delete('/tenant/{id}', [TenantController::class, 'delete'])->setName('tenant_delete');
        $group->post('/tenant-check', [TenantController::class, 'check'])->setName('tenant_check');

        $group->get('/modeles', [AppController::class, 'modele'])->setName('modele_index');
        $group->post('/modeles', [ModelController::class, 'create']);
        $group->put('/modeles/{id}', [ModelController::class, 'update']);
        $group->delete('/modeles/{id}', [ModelController::class, 'delete']);

        $group->get('/bibliotheque', [AppController::class, 'bibli'])->setName('bibli_index');

        $group->post('/bibliotheque/elements/{entity}', [BibliController::class, 'create']);
        $group->put('/bibliotheque/elements/{entity}/{id}', [BibliController::class, 'update']);
        $group->delete('/bibliotheque/elements/{entity}/{id}', [BibliController::class, 'delete']);

        $group->post('/bibliotheque/counter', [CounterController::class, 'create']);
        $group->put('/bibliotheque/counter/{id}', [CounterController::class, 'update']);
        $group->delete('/bibliotheque/counter/{id}', [CounterController::class, 'delete']);

        $group->post('/bibliotheque/element', [ElementController::class, 'create']);
        $group->put('/bibliotheque/element/{id}', [ElementController::class, 'update']);
        $group->delete('/bibliotheque/element/{id}', [ElementController::class, 'delete']);

    })->add(UserAuthMiddleware::class);

};
