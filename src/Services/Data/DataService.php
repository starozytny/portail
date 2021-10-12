<?php

namespace App\Services\Data;

use App\Services\ApiService;
use Psr\Http\Message\ResponseInterface;

class DataService
{
    private $apiService;

    public function __construct(ApiService $apiService)
    {

        $this->apiService = $apiService;
    }
    public function returnError(ResponseInterface $response, $data, $toJson=false, $code=400): ResponseInterface
    {
        $response->getBody()->write($toJson ? json_encode($data) : $data);
        return $response->withStatus($code);
    }

    public function delete(ResponseInterface $response, $path, $method="DELETE"): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->apiService->callApiWithErrors($path, $method, false);
        if($res['code'] == 0){
            return $this->returnError($response, $res['data']);
        }

        return $response->withStatus(200);
    }
}