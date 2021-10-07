<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\Edl\PropertyService;
use App\Services\SanitizeData;
use App\Services\Validateur;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class PropertyController
{
    private $apiService;
    private $propertyService;

    public function __construct(ApiService $apiService, PropertyService $propertyService)
    {
        $this->apiService = $apiService;
        $this->propertyService = $propertyService;
    }

    private function submitForm($request, $type): array
    {
        $data = json_decode($request->getBody());

        $res = $this->propertyService->validateData($data);
        if($res['code'] == 0){
            return $res;
        }

        $obj = json_encode($res['data']);

        if($type == "create"){
            $res = $this->propertyService->createProperty($obj);
        }else{
            $res = $this->propertyService->updateProperty($obj);
        }

       return $res;
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->submitForm($request, "create");
        if($res['code'] == 0){
            $response->getBody()->write($res['data']);
            return $response->withStatus(400);
        }

        $response->getBody()->write($res['data']);
        return $response->withStatus(200);
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->submitForm($request, "update");
        if($res['code'] == 0){
            $response->getBody()->write($res['message']);
            return $response->withStatus(400);
        }

        $response->getBody()->write($res['data']);
        return $response->withStatus(200);
    }

    public function check(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $data = json_decode($request->getBody());

        $res = $this->propertyService->validateData($data);
        if($res['code'] == 0){
            $response->getBody()->write($res['data']);
            return $response->withStatus(400);
        }

        $dataToSend = $res['data'];

        $response->getBody()->write(json_encode($dataToSend));
        return $response->withStatus(200);
    }
}