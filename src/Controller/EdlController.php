<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\Edl\PropertyService;
use App\Services\Edl\TenantService;
use App\Services\Validateur;
use Odan\Session\SessionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Routing\RouteContext;
use Slim\Views\Twig;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class EdlController
{
    private $twig;
    private $apiService;
    private $validateur;
    private $propertyService;
    private $tenantService;
    private $session;

    public function __construct(Twig $twig, ApiService $apiService, Validateur $validateur, SessionInterface $session,
                                PropertyService $propertyService, TenantService $tenantService)
    {
        $this->twig = $twig;
        $this->apiService = $apiService;
        $this->validateur = $validateur;
        $this->propertyService = $propertyService;
        $this->tenantService = $tenantService;
        $this->session = $session;
    }

    /**
     * Methode pour envoyer les data pour créer ou modifier un edl
     *
     * @param $existe
     * @param $request
     * @param $data
     * @param $url
     * @return array
     */
    private function submitForm($existe, $request, $data, $url): array
    {
        $structure      = $data->structure;
        $model          = $data->model;
        $attribution    = $data->attribution;
        $startDate      = $data->startDate;
        $type           = $data->type;
        $bienId         = $data->bien;
        $bienCreate     = $data->bienCreate;
        $tenants        = $data->tenants;
        $tenantsCreate  = $data->tenantsCreate;

        // validation des données
        $paramsToValidate = [
            ['type' => 'text', 'name' => 'structure',    'value' => $structure],
            ['type' => 'text', 'name' => 'attribution',  'value' => $attribution],
            ['type' => 'text', 'name' => 'type',         'value' => $type]
        ];
        if($structure == 1) { //etablir structure = model required
            array_push($paramsToValidate, ['type' => 'text', 'name' => 'model', 'value' => $model]);
        }
        $errors = $this->validateur->validate($paramsToValidate);
        if($bienId == "" && $bienCreate == ""){
            array_push($errors, [
                'name' => 'bien',
                'message' => 'Veuillez sélectionner ou ajouter un bien'
            ]);
        }
        if($tenants == "" && $tenantsCreate == ""){
            array_push($errors, [
                'name' => 'tenants',
                'message' => 'Veuillez sélectionner ou ajouter un locataire'
            ]);
        }

        if(count($errors) > 0){
            return ['code' => 0,'errors' => json_encode($errors)];
        }

        // extract tenants before property
        // if tenants from create fails, delete them
        $res = $this->tenantService->extractTenantsFromFormEdl($tenants, $tenantsCreate);
        if($res['code'] == 0){
            return ['code' => 0,'errors' => $res['message']];
        }
        $tenantsArray = $res['data'];

        $res = $this->propertyService->extractBienFromFormEdl($bienId, $bienCreate);
        if($res['code'] == 0){
            return ['code' => 0,'errors' => $res['message']];
        }
        $propertyUid = $res['data'];

        //send to api
        $dataToSend = [
            'property_uid'  => $propertyUid,
            'date'          => $startDate,
            'type'          => $type,
            'tenants'       => json_encode($tenantsArray),
            'user_id'       => $attribution,
            'input'         => $model
        ];

        $method = "PUT";
        if(!$existe){
            $method = "POST";
            array_push($dataToSend, ['uid' => round(microtime(true) * 10000)]);
        }

        $res = $this->apiService->callApiWithErrors($url, $method, false, $dataToSend);
        if($res['code'] == 0){
            return ['code' => 0,'errors' => $res['message']];
        }

        //redirect to edl list
        $routeParser = RouteContext::fromRequest($request)->getRouteParser();
        $url = $routeParser->fullUrlFor($request->getUri(), 'edl');

        return ['code' => 1, 'data' => $url];
    }

    /**
     * Route pour créer un edl
     *
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $method = $request->getMethod();

        if($method == "POST"){
            $response->withHeader('Content-Type', 'application/json');

            $data = json_decode($request->getBody());
            $res = $this->submitForm(null, $request, $data, 'add_inventory/');

            if($res['code'] != 1){
                $response->getBody()->write($res['errors']);
                return $response->withStatus(400);
            }

            $response->getBody()->write($res['data']);
            return $response->withStatus(200);
        }

        $properties = $this->apiService->callApi('properties');
        $tenants = $this->apiService->callApi('tenants');

        return $this->twig->render($response, 'app/pages/edl/create.twig', [
            'users' => $this->getUsers(),
            'properties' => $properties,
            'tenants' => $tenants,
            'models' => $this->getModels(),
            'donnees' => json_encode($tenants)
        ]);
    }

    /**
     * Route pour modifier un edl
     *
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $method = $request->getMethod();

        if($method == "PUT"){
            $response->withHeader('Content-Type', 'application/json');

            $existe = $this->apiService->callApi('inventories/' . $args['id']);
            if($existe == false){
                $response->getBody()->write("[EU001] Une erreur est survenu. Veuillez contacter le support.");
                return $response->withStatus(400);
            }

            $data = json_decode($request->getBody());
            $res = $this->submitForm($existe, $request, $data, 'edit_inventory/' . $args['id']);

            if($res['code'] != 1){
                $response->getBody()->write($res['errors']);
                return $response->withStatus(400);
            }

            $response->getBody()->write($res['data']);
            return $response->withStatus(200);
        }

        $edl = $this->apiService->callApi('inventories/full/' . $args['id']);
        $properties = $this->apiService->callApi('properties');
        $tenants = $this->apiService->callApi('tenants');

        return $this->twig->render($response, 'app/pages/edl/update.twig', [
            'edl' => $edl,
            'users' => $this->getUsers(),
            'properties' => $properties,
            'tenants' => $tenants,
            'models' => $this->getModels(),
            'donnees' => json_encode($edl),
        ]);
    }

    /**
     * Route pour supprimer un edl
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->apiService->callApi('delete_inventory/' . $args['id'], 'DELETE', false);
        if($res == false){
            $response->getBody()->write("[ED001] Une erreur est survenu. Veuillez contacter le support.");
            return $response->withStatus(400);
        }

        $response->getBody()->write("Etat des lieux supprimé.");
        return $response->withStatus(200);
    }

    /**
     * Method retournant un tableau pour le select HTML
     * @return array
     */
    private function getUsers(): array
    {
        $objs = [];
        $user = $this->session->get('user');

        if($user[9] == 1){
            $data = $this->apiService->callApi('users');
            if($data){
                foreach($data as $elem){
                    array_push($objs, ['value' => $elem->id, 'label' =>  $elem->first_name . ' ' . $elem->last_name . ' - ' . '#' . $elem->username]);
                }
            }
        }else{
            array_push($objs, ['value' => $user[7], 'label' =>  $user[2] . ' ' . $user[3] . ' - ' . '#' . $user[0]]);
        }

        return $objs;
    }

    /**
     * Method retournant un tableau pour le select HTML
     * @return array
     */
    private function getModels(): array
    {

        $objs = [];
        $data = $this->apiService->callApi('models');

        if($data){
            foreach($data as $elem){
                array_push($objs, ['value' => 10 . $elem->id, 'label' =>  $elem->name]);
            }
        }

        return $objs;
    }
}