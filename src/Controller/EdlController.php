<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\Edl\PropertyService;
use App\Services\Validateur;
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
    /**
     * @var PropertyService
     */
    private $propertyService;

    public function __construct(Twig $twig, ApiService $apiService, Validateur $validateur,
                                PropertyService $propertyService)
    {
        $this->twig = $twig;
        $this->apiService = $apiService;
        $this->validateur = $validateur;
        $this->propertyService = $propertyService;
    }

    private function getUsers(): array
    {
        $data = $this->apiService->callApi('users');
        $objs = [];
        foreach($data as $elem){
            array_push($objs, ['value' => $elem->id, 'label' =>  $elem->first_name . ' ' . $elem->last_name . ' - ' . '#' . $elem->username]);
        }

        return $objs;
    }

    private function getModels(): array
    {
        $data = $this->apiService->callApi('models');
        $objs = [];
        foreach($data as $elem){
            array_push($objs, ['value' => 10 . $elem->id, 'label' =>  $elem->name]);
        }

        return $objs;
    }

    /**
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $method = $request->getMethod();

        $allTenants = $this->apiService->callApi('tenants');

        if($method == "POST"){

            $data = json_decode($request->getBody());
            $structure = $data->structure;
            $model = $data->model;
            $attribution = $data->attribution;
            $startDate = $data->startDate;
            $type = $data->type;
            $bien = $data->bien;
            $bienCreate = $data->bienCreate;
            $tenants = $data->tenants;
            $tenantsCreate = $data->tenantsCreate;

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

            if($bien == "" && $bienCreate == ""){
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
                $response->getBody()->write(json_encode($errors));
                return $response->withStatus(400);
            }

            // extract data bien and tenants to create
            $propertyUid = null;
            if($bienCreate != "") {
                $this->propertyService->createProperty(json_decode($bienCreate));

                $response->getBody()->write("error");
                return $response->withStatus(400);
            }else{
                $property = $this->apiService->callApi('properties/' . $bien);
                if($property == false){
                    $response->getBody()->write("[EP001] Une erreur est survenu. Veuillez contacter le support.");
                    return $response->withStatus(400);
                }
                $propertyUid = $property->uid;
            }

            $tenantsArray = [];
            if($tenantsCreate != ""){

            }
            if($tenants != ""){
                $tenants = explode(',', $tenants);
                foreach($tenants as $tenantId){
                    foreach($allTenants as $oriTenant){
                        if($oriTenant->id == $tenantId){
                            array_push($tenantsArray, $oriTenant->reference);
                        }
                    }
                }
            }

            $dataToSend = [
                'uid' => round(microtime(true)),
                'property_uid' => $propertyUid, // for javascript edit
                'date' => $startDate,
                'type' => $type,
                'tenants' => json_encode($tenantsArray),
                'user_id' => $attribution,
                'comparative' => 0,
                'input' => $model
            ];
            $res = $this->apiService->callApiInventory('add_inventory', 'POST', false, $dataToSend);
            if($res['code'] == 0){
                $response->getBody()->write($res['message']);
                return $response->withStatus(400);
            }

            $routeParser = RouteContext::fromRequest($request)->getRouteParser();
            $url = $routeParser->fullUrlFor($request->getUri(), 'edl');

            $response->getBody()->write($url);
            return $response->withStatus(200);
        }

        $properties = $this->apiService->callApi('properties');

        return $this->twig->render($response, 'app/pages/edl/create.twig', [
            'users' => $this->getUsers(),
            'properties' => $properties,
            'tenants' => $allTenants,
            'models' => $this->getModels(),
            'donnees' => json_encode($allTenants)
        ]);
    }

    /**
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $method = $request->getMethod();

        $allTenants = $this->apiService->callApi('tenants');

        if($method == "PUT"){
            $response->withHeader('Content-Type', 'application/json');

            $response->getBody()->write("Cool !");
            return $response->withStatus(200);
        }

        $edl = $this->apiService->callApi('inventories/full/' . $args['id']);
        $properties = $this->apiService->callApi('properties');

        return $this->twig->render($response, 'app/pages/edl/update.twig', [
            'edl' => $edl,
            'users' => $this->getUsers(),
            'properties' => $properties,
            'tenants' => $allTenants,
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
}