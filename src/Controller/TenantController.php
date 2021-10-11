<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\Edl\TenantService;
use App\Services\SanitizeData;
use App\Services\Validateur;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class TenantController
{
    private $apiService;
    private $tenantService;

    public function __construct(ApiService $apiService, TenantService $tenantService)
    {
        $this->apiService = $apiService;
        $this->tenantService = $tenantService;
    }

    private function submitForm($request, $type, $id): array
    {
        $data = json_decode($request->getBody());

        $res = $this->tenantService->validateData($data, $id);
        if($res['code'] == 0){
            return $res;
        }

        $obj = json_encode($res['data']);

        if($type == "create"){
            $res = $this->tenantService->createTenant($obj);
        }else{
            $res = $this->tenantService->updateTenant($obj, $id);
        }

        return $res;
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->submitForm($request, "create", null);
        if($res['code'] == 0){
            $response->getBody()->write($res['data']);
            return $response->withStatus(400);
        }

        return $response->withStatus(200);
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->submitForm($request, "update", $args["id"]);
        if($res['code'] == 0){
            $response->getBody()->write($res['data']);
            return $response->withStatus(400);
        }

        return $response->withStatus(200);
    }

    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->apiService->callApiWithErrors('delete_tenant/' . $args['id'], 'DELETE', false);
        if($res['code'] == 0){
            $response->getBody()->write($res['data']);
            return $response->withStatus(400);
        }

        return $response->withStatus(200);
    }

    public function check(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $data = json_decode($request->getBody());

        $res = $this->tenantService->validateData($data, null);
        if($res['code'] == 0){
            $response->getBody()->write($res['data']);
            return $response->withStatus(400);
        }

        $dataToSend = $res['data'];

        $response->getBody()->write(json_encode($dataToSend));
        return $response->withStatus(200);
    }
}