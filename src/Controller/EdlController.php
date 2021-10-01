<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\Validateur;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class EdlController
{
    private $twig;
    private $apiService;
    private $validateur;

    public function __construct(Twig $twig, ApiService $apiService, Validateur $validateur)
    {
        $this->twig = $twig;
        $this->apiService = $apiService;
        $this->validateur = $validateur;
    }

    private function getUsers(): array
    {
        $data = $this->apiService->callApi('users');
        $objs = [];
        foreach($data as $elem){
            array_push($objs, ['value' => 10 . $elem->id, 'label' =>  $elem->first_name . ' ' . $elem->last_name . ' - ' . '#' . $elem->username]);
        }

        return $objs;
    }

    private function getModels(): array
    {
        $data = $this->apiService->callApi('models');
        $objs = [];
        foreach($data as $elem){
            array_push($objs, ['value' => $elem->id, 'label' =>  $elem->name]);
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

        if($method == "POST"){
            $response->withHeader('Content-Type', 'application/json');

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

            $response->getBody()->write("Cool !");
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
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $method = $request->getMethod();

        if($method == "PUT"){
            $response->withHeader('Content-Type', 'application/json');

            $response->getBody()->write("Cool !");
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
}