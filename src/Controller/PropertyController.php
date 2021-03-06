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
            $res = $this->propertyService->createProperty($obj, true);
        }else{
            $res = $this->propertyService->updateProperty($obj, $id);
        }

       return $res;
    }

    /**
     * POST - route pour créer un bien
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
     * PUT - route pour modifier un bien
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
     * DELETE - route pour supprimer un bien
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->dataService->delete($response, 'delete_property/' . $args['id']);
    }

    /**
     * POST - route pour checker si un bien existe
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function check(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = json_decode($request->getBody());

        $res = $this->propertyService->validateData($data, null);
        if($res['code'] == 0){
            return $this->dataService->returnResponse(400, $response, $res['data']);
        }

        return $this->dataService->returnResponse(200, $response, $res['data'], true);
    }
}