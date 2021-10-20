<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\Data\DataService;
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
    private $dataService;

    public function __construct(Twig $twig, ApiService $apiService, Validateur $validateur, SessionInterface $session,
                                PropertyService $propertyService, TenantService $tenantService, DataService $dataService)
    {
        $this->twig = $twig;
        $this->apiService = $apiService;
        $this->validateur = $validateur;
        $this->propertyService = $propertyService;
        $this->tenantService = $tenantService;
        $this->session = $session;
        $this->dataService = $dataService;
    }

    /**
     * Methode pour le formulaire de création ou edition d'edl
     *
     * @param $existe
     * @param $request
     * @param $data
     * @param $url
     * @return array
     */
    private function submitForm($existe, $request, $data, $url): array
    {
        $method = $existe ? "PUT" : "POST";

        $structure      = $data->structure;
        $model          = $data->model;
        $attribution    = $data->attribution;
        $startDate      = $data->startDate;
        $type           = $data->type;
        $property       = $data->property;
        $tenants        = $data->tenants;

        // validation des données
        $paramsToValidate = [
            ['type' => 'text', 'name' => 'structure',    'value' => $structure],
            ['type' => 'text', 'name' => 'attribution',  'value' => $attribution],
            ['type' => 'text', 'name' => 'type',         'value' => $type],
            ['type' => 'text', 'name' => 'property',     'value' => $property],
            ['type' => 'text', 'name' => 'tenants',      'value' => $tenants]
        ];
        if($structure == 1) { //etablir structure = model required
            array_push($paramsToValidate, ['type' => 'text', 'name' => 'model', 'value' => $model]);
        }
        $errors = $this->validateur->validate($paramsToValidate);
        if(count($errors) > 0){
            return ['code' => 0, 'data' => json_encode($errors)];
        }

        // extract tenants before property
        // if tenants from create fails, delete them
        $tenantsArray = [];
        foreach($tenants as $tenant){
            if(!isset($tenant->id)){
                $this->tenantService->createTenant($tenant);
            }
            array_push($tenantsArray, $tenant->reference);
        }

        if(!isset($property->id)){
            $res = $this->propertyService->createProperty($property);
            if($res['code'] == 0){
                return $res;
            }

            $p = $this->propertyService->getPropertyUid($res['data']);
            $propertyUid = $p['data']; //bienId
            $lastInventoryUid = $res['lastInventoryUid'];
        }else{
            $property = $this->apiService->callApi('properties/' . $property->id);
            $propertyUid = $property->uid;
            $lastInventoryUid = $property->last_inventory_uid;
        }

        if($structure == 2){
            $model = $lastInventoryUid;
        }

        //send to api
        $dataToSend = [
            'uid'           => "",
            'property_uid'  => $propertyUid,
            'date'          => $startDate,
            'type'          => $type,
            'tenants'       => json_encode($tenantsArray),
            'user_id'       => $attribution,
            'input'         => $model
        ];

        if(!$existe){
            $dataToSend['uid'] = round(microtime(true) * 10000);
        }

        $res = $this->apiService->callApiWithErrors($url, $method, false, $dataToSend);
        if($res['code'] == 0){
            if($res['status'] == 409){
                $msg = "Vous avez atteint le maximum d'état des lieux pour ce bien.";
                if($res['data'] == "Incoming inventory already exists for this property\n"){
                    $msg = "Un état des lieux ENTRANT existe déjà pour ce bien.";
                }else if($res['data'] == "Outgoing inventory already exists for this property\n"){
                    $msg = "Un état des lieux SORTANT existe déjà pour ce bien.";
                }
                return ['code' => 0, 'data' => json_encode([['name' => 'type', 'message' => $msg]])];
            }
            return $res;
        }

        //redirect to edl list
        $routeParser = RouteContext::fromRequest($request)->getRouteParser();
        $url = $routeParser->fullUrlFor($request->getUri(), 'edl', ['status' => 'en-cours']);

        return ['code' => 1, 'data' => $url];
    }

    /**
     * POST - Route pour créer un edl
     *
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $method = $request->getMethod();

        if($method == "POST"){
            $data = json_decode($request->getBody());
            $res = $this->submitForm(null, $request, $data, 'add_inventory/');

            return $this->dataService->returnResponse($res['code'] != 1 ? 400 : 200, $response, $res['data']);
        }

        $properties = $this->apiService->callApi('properties');
        $tenants = $this->apiService->callApi('tenants');

        return $this->twig->render($response, 'app/pages/edl/create.twig', [
            'users' => $this->getUsers(),
            'properties' => $properties,
            'tenants' => $tenants,
            'models' => $this->getModels()
        ]);
    }

    /**
     * PUT - Route pour modifier un edl
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
                return $this->dataService->returnResponse(400, $response, "[EU001] Une erreur est survenu. Veuillez contacter le support.");
            }

            $data = json_decode($request->getBody());

            $res = $this->submitForm($existe, $request, $data, 'edit_inventory/' . $args['id']);

            return $this->dataService->returnResponse($res['code'] != 1 ? 400 : 200, $response, $res['data']);
        }

        $edl = $this->apiService->callApi('inventories/full/' . $args['id']);
        $properties = $this->apiService->callApi('properties');
        $tenants = $this->apiService->callApi('tenants');

        return $this->twig->render($response, 'app/pages/edl/update.twig', [
            'edl' => $edl,
            'users' => $this->getUsers(),
            'properties' => $properties,
            'tenants' => $tenants,
            'models' => $this->getModels()
        ]);
    }

    /**
     * DELETE - Route pour supprimer un edl
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->apiService->callApi('delete_inventory/' . $args['id'], 'DELETE', false);
        return $this->dataService->returnResponse($res == false ? 400 : 200, $response,
            $res == false ? "[EU001] Une erreur est survenu. Veuillez contacter le support." : "Etat des lieux supprimé."
        );
    }

    /**
     * GET - Route pour récupérer le pdf d'un edl via son uid
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function pdf(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->apiService->callApi('inventories/pdf/' . $args['uid'], "GET", false);
        if($res == false){
            return $this->dataService->returnResponse(400, $response, "[ED001] Une erreur est survenu. Veuillez contacter le support.");
        }

        $response = $response->withHeader('Content-Type', 'application/pdf');
        $response = $response->withHeader('Content-Disposition', sprintf('attachment; filename="%s"', "edl.pdf"));

        $stream = fopen('php://memory', 'w+');
        fwrite($stream, $res);
        rewind($stream);

        $response->getBody()->write(fread($stream, (int)fstat($stream)['size']));
        return $response;
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
                array_push($objs, ['value' => "-" . $elem->id, 'label' =>  $elem->name]);
            }
        }

        return $objs;
    }
}