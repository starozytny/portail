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

    /**
     * POST - route pour créer un élément en fonction de l'entity passé en paramètres
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->dataService->submitFormWithName($request, "create", null, $args['entity']);

        return $this->dataService->returnResponse($res['code'] == 0 ? 400 : 200, $response, $res['data']);
    }

    /**
     * PUT - route pour mettre à jour un élément en fonction de l'entity passé en paramètres
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $res = $this->dataService->submitFormWithName($request, "update", $args["id"], $args['entity']);

        return $this->dataService->returnResponse($res['code'] == 0 ? 400 : 200, $response, $res['data']);
    }

    /**
     * DELETE - route pour supprimer un élément en fonction de l'entity passé en paramètres
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->dataService->delete($response, 'library/delete_'.$args['entity'].'/' . $args['id'], "GET");
    }
}