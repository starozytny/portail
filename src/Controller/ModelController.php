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

        $dataName  = $data->name;
        $name      = $this->sanitizeData->cleanForPost($data->name);
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

        if($res['code'] == 0){
            return ['code' => 0, 'data' => json_encode(['message' => $res['data']])];
        }

        $objs = $this->apiService->callApiWithErrors('models');

        $data = null;
        foreach($objs['data'] as $obj){
            if(mb_strtolower($obj->name) == mb_strtolower($dataName)){
                $data = $obj;
            }
        }

        if($data == null){
            return ['code' => 0, 'data' => json_encode(['message' => "[MFORM001] Veuillez rafraichir la page manuellement."])];
        }

        return ['code' => 1, 'data' => json_encode($data)];
    }

    /**
     * POST - route pour créer un modele
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->submitForm($request, "create", null);
        return $this->dataService->returnResponse($res['code'] == 0 ? 400 : 200, $response, $res['data']);
    }

    /**
     * PUT - route pour modifier un modele
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->submitForm($request, "update", $args["id"]);
        return $this->dataService->returnResponse($res['code'] == 0 ? 400 : 200, $response, $res['data']);
    }

    /**
     * DELETE - route pour supprimer un modele
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