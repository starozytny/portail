<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\Data\DataService;
use App\Services\Edl\PropertyService;
use App\Services\SanitizeData;
use App\Services\Validateur;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class PropertyController
{
    private $propertyService;
    private $dataService;

    public function __construct(PropertyService $propertyService, DataService $dataService)
    {
        $this->propertyService = $propertyService;
        $this->dataService = $dataService;
    }

    private function submitForm($request, $type, $id): array
    {
        $data = json_decode($request->getBody());

        $res = $this->propertyService->validateData($data, $id);
        if($res['code'] == 0){
            return $res;
        }

        $obj = json_encode($res['data']);

        if($type == "create"){
            $obj = json_decode($obj);
            $res = $this->propertyService->createProperty($obj);
        }else{
            $res = $this->propertyService->updateProperty($obj, $id);
        }

       return $res;
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
        return $this->dataService->delete($response, 'delete_property/' . $args['id']);
    }

    public function check(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $data = json_decode($request->getBody());

        $res = $this->propertyService->validateData($data, null);
        if($res['code'] == 0){
            return $this->dataService->returnError($response, $res['data']);
        }

        $response->getBody()->write(json_encode($res['data']));
        return $response->withStatus(200);
    }
}