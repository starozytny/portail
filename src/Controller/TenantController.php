<?php

namespace App\Controller;

use App\Services\Data\DataService;
use App\Services\Edl\TenantService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class TenantController
{
    private $tenantService;
    private $dataService;

    public function __construct(TenantService $tenantService, DataService $dataService)
    {
        $this->tenantService = $tenantService;
        $this->dataService = $dataService;
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
            $obj = json_decode($obj);
            $res = $this->tenantService->createTenant($obj);
        }else{
            $res = $this->tenantService->updateTenant($obj, $id);
        }

        return $res;
    }

    /**
     * POST - Route pour créer un tenant
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
     * PUT - Route pour mettre a jour un tenant
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
     * DELETE - route pour supprimer un tenant
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->dataService->delete($response, 'delete_tenant/' . $args['id']);
    }

    /**
     * POST - route pour savoir si un tenant exist
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function check(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = json_decode($request->getBody());

        $res = $this->tenantService->validateData($data, null);
        if($res['code'] == 0){
            return $this->dataService->returnResponse(400, $response, $res['data']);
        }

        return $this->dataService->returnResponse(200, $response, $res['data'], true);
    }
}