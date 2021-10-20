<?php

namespace App\Controller\Bibli;

use App\Services\ApiService;
use App\Services\Data\DataService;
use App\Services\SanitizeData;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class CounterController
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
        if(!isset($data->unit) && $data->unit == ""){
            return ['code' => 0, 'data' => json_encode([['name' => 'unit', 'message' => "Ce champs est obligatoire."]])];
        }

        $name = $this->sanitizeData->clean($data->name);

        $dataToSend = [
            'name' => $name,
            'unit' => $this->sanitizeData->clean($data->unit)
        ];

        if($type == "create"){
            $res = $this->apiService->callApiWithErrors('library/add_counter/', 'POST', false, $dataToSend);
        }else{
            $res = $this->apiService->callApiWithErrors('library/edit_counter/' . $id, 'POST', false, $dataToSend);
        }

        if($res['code'] == 0 && str_contains($res['data'], "already")){
            return ['code' => 0, 'data' => json_encode([['name' => 'name', 'message' => "Ce compteur existe déjà."]])];
        }

        $objs = $this->apiService->callApiWithErrors('library/counters');

        $data = null;
        foreach($objs['data'] as $obj){
            if($obj->name == $name){
                $data = $obj;
            }
        }

        if($data == null){
            return ['code' => 0, 'data' => "[CFORM001] Veuillez rafraichir la page manuellement."];
        }

        return ['code' => 1, 'data' => json_encode($data)];
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->submitForm($request, "create", null);

        return $this->dataService->returnResponse($res['code'] == 0 ? 400 : 200, $response, $res['data']);
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->submitForm($request, "update", $args["id"]);

        return $this->dataService->returnResponse($res['code'] == 0 ? 400 : 200, $response, $res['data']);
    }

    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->dataService->delete($response, 'library/delete_counter/' . $args['id'], "GET");
    }
}