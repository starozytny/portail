<?php

namespace App\Controller\Bibli;

use App\Services\Data\DataService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class BibliController
{
    private $dataService;

    public function __construct(DataService $dataService)
    {
        $this->dataService = $dataService;
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->dataService->submitFormWithName($request, "create", null, $args['entity']);

        return $this->dataService->returnResponse($res['code'] == 0 ? 400 : 200, $response, $res['data']);
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->dataService->submitFormWithName($request, "update", $args["id"], $args['entity']);

        return $this->dataService->returnResponse($res['code'] == 0 ? 400 : 200, $response, $res['data']);
    }

    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->dataService->delete($response, 'library/delete_'.$args['entity'].'/' . $args['id'], "GET");
    }
}