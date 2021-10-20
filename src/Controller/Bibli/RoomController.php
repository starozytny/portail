<?php

namespace App\Controller\Bibli;

use App\Services\ApiService;
use App\Services\Data\DataService;
use App\Services\SanitizeData;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class RoomController
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

        $name = $this->sanitizeData->clean($data->name);

        $dataToSend = [
            'name' => $name
        ];

        if($type == "create"){
            $res = $this->apiService->callApiWithErrors('library/add_room/', 'POST', false, $dataToSend);
        }else{
            $res = $this->apiService->callApiWithErrors('library/edit_room/' . $id, 'POST', false, $dataToSend);
        }

        if($res['code'] == 0 && str_contains($res['data'], "already")){
            return ['code' => 0, 'data' => json_encode([['name' => 'name', 'message' => "Cette pièce existe déjà."]])];
        }

        $objs = $this->apiService->callApiWithErrors('library/rooms');

        $data = null;
        foreach($objs['data'] as $obj){
            if($obj->name == $name){
                $data = $obj;
            }
        }

        if($data == null){
            return ['code' => 0, 'data' => "[RFORM001] Veuillez rafraichir la page manuellement."];
        }

       return ['code' => 1, 'data' => json_encode($data)];
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->submitForm($request, "create", null);
        if($res['code'] == 0){
            return $this->dataService->returnError($response, $res['data']);
        }

        return $this->dataService->returnSuccess($response, $res['data']);
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->submitForm($request, "update", $args["id"]);
        if($res['code'] == 0){
            return $this->dataService->returnError($response, $res['data']);
        }

        return $this->dataService->returnSuccess($response, $res['data']);
    }

    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->dataService->delete($response, 'library/delete_room/' . $args['id'], "GET", "Pièce supprimée avec succès !");
    }
}