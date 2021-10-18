<?php

namespace App\Controller\Bibli;

use App\Services\ApiService;
use App\Services\Data\DataService;
use App\Services\SanitizeData;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class NatureController
{
    private $dataService;
    private $apiService;
    private $sanitizeData;

    public function __construct(ApiService $apiService, DataService $dataService, SanitizeData $sanitizeData)
    {
        $this->dataService = $dataService;
        $this->apiService = $apiService;
        $this->sanitizeData = $sanitizeData;
    }

    private function submitForm($request, $type, $id): array
    {
        $data = json_decode($request->getBody());

        if(!isset($data->name) && $data->name == ""){
            return ['code' => 0, 'data' => json_encode([['name' => 'name', 'message' => "Ce champs est obligatoire."]])];
        }

        $dataToSend = [
            'name' => $this->sanitizeData->clean($data->name)
        ];

        if($type == "create"){
            $res = $this->apiService->callApiWithErrors('library/add_nature/', 'POST', false, $dataToSend);
        }else{
            $res = $this->apiService->callApiWithErrors('library/edit_nature/' . $id, 'POST', false, $dataToSend);
        }

        if($res['code'] == 0 && str_contains($res['data'], "already")){
            return ['code' => 0, 'data' => json_encode([['name' => 'name', 'message' => "Cette nature existe déjà."]])];
        }

       return $res;
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->submitForm($request, "create", null);
        if($res['code'] == 0){
            return $this->dataService->returnError($response, $res['data']);
        }

        return $response->withStatus(200);
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->submitForm($request, "update", $args["id"]);
        if($res['code'] == 0){
            return $this->dataService->returnError($response, $res['data']);
        }

        return $response->withStatus(200);
    }

    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->dataService->delete($response, 'library/delete_nature/' . $args['id'], "GET");
    }
}