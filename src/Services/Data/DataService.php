<?php

namespace App\Services\Data;

use App\Services\ApiService;
use App\Services\SanitizeData;
use Psr\Http\Message\ResponseInterface;

class DataService
{
    private $apiService;
    private $sanitizeData;

    public function __construct(ApiService $apiService, SanitizeData $sanitizeData)
    {
        $this->apiService = $apiService;
        $this->sanitizeData = $sanitizeData;
    }

    public function returnResponse($code, ResponseInterface $response, $data, $toJson=false): ResponseInterface
    {
        $response->getBody()->write($toJson ? json_encode($data) : $data);
        return $response->withStatus($code);
    }

    public function returnError(ResponseInterface $response, $data, $toJson=false, $code=400): ResponseInterface
    {
        $response->getBody()->write($toJson ? json_encode($data) : $data);
        return $response->withStatus($code);
    }

    public function returnSuccess(ResponseInterface $response, $data, $toJson=false, $code=200): ResponseInterface
    {
        $response->getBody()->write($toJson ? json_encode($data) : $data);
        return $response->withStatus($code);
    }

    public function delete(ResponseInterface $response, $path, $method="DELETE", $msg = "Donnée supprimée avec succès !"): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->apiService->callApiWithErrors($path, $method, false);
        if($res['code'] == 0){
            return $this->returnError($response, $res['data']);
        }

        $response->getBody()->write(json_encode(['message' => $msg]));
        return $response->withStatus(200);
    }

    public function submitFormWithName($request, $type, $id, $entity): array
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
            $res = $this->apiService->callApiWithErrors('library/add_'. $entity .'/', 'POST', false, $dataToSend);
        }else{
            $res = $this->apiService->callApiWithErrors('library/edit_'. $entity .'/' . $id, 'POST', false, $dataToSend);
        }

        if($res['code'] == 0 && str_contains($res['data'], "already")){
            return ['code' => 0, 'data' => json_encode([['name' => 'name', 'message' => "Ce nom existe déjà."]])];
        }

        $objs = $this->apiService->callApiWithErrors('library/'. $entity .'s');

        $data = null;
        foreach($objs['data'] as $obj){
            if($obj->name == $name){
                $data = $obj;
            }
        }

        if($data == null){
            return ['code' => 0, 'data' => "[FORM001] Veuillez rafraichir la page manuellement."];
        }

        return ['code' => 1, 'data' => json_encode($data)];
    }
}