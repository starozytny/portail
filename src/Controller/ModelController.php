<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\Data\DataService;
use App\Services\SanitizeData;
use App\Services\Validateur;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ModelController
{
    private $apiService;
    private $validateur;
    private $dataService;
    private $sanitizeData;

    public function __construct(ApiService $apiService, Validateur $validateur, DataService $dataService, SanitizeData $sanitizeData)
    {
        $this->apiService = $apiService;
        $this->validateur = $validateur;
        $this->dataService = $dataService;
        $this->sanitizeData = $sanitizeData;
    }

    /**
     * Methode pour envoyer les data pour créer ou modifier un edl
     *
     * @param $request
     * @param $type
     * @param $id
     * @return array
     */
    private function submitForm($request, $type, $id): array
    {
        $data = json_decode($request->getBody());

        $name      = $this->sanitizeData->clean($data->name);
        $content   = $data->content;

        // validation des données
        $paramsToValidate = [
            ['type' => 'text',  'name' => 'name',     'value' => $name],
            ['type' => 'array', 'name' => 'content',  'value' => $content],
        ];
        $errors = $this->validateur->validate($paramsToValidate);
        if(count($errors) > 0){
            return ['code' => 0,'data' => json_encode($errors)];
        }

        $dataToSend = [
            'name'     => $name,
            'content'  => json_encode($content),
        ];

        if($type == "create"){
            $res = $this->apiService->callApiWithErrors('models/add_model/', 'POST', false, $dataToSend);
        }else{
            $models = $this->apiService->callApi('models');
            foreach($models as $model){
                if($model->id != $id && $model->name == $name){
                    return ['code' => 0, 'data' => json_encode([['name' => 'name', 'message' => "Ce modèle existe déjà."]])];
                }
            }

            $res = $this->apiService->callApiWithErrors('models/edit_model/' . $id, 'POST', false, $dataToSend);
        }

        if($res['code'] == 0 && str_contains($res['data'], "already")){
            return ['code' => 0, 'data' => json_encode([['name' => 'name', 'message' => "Ce modèle existe déjà."]])];
        }

        return $res;
    }

    /**
     * Route pour créer un modele
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->submitForm($request, "create", null);
        if($res['code'] == 0){
            return $this->dataService->returnError($response, $res['data']);
        }

        return $response->withStatus(200);
    }

    /**
     * Route pour modifier un modele
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->submitForm($request, "update", $args["id"]);
        if($res['code'] == 0){
            return $this->dataService->returnError($response, $res['data']);
        }

        return $response->withStatus(200);
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
        return $this->dataService->delete($response, 'models/delete_model/' . $args['id']);
    }
}