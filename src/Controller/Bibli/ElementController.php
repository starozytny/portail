<?php

namespace App\Controller\Bibli;

use App\Services\Data\DataService;
use App\Services\Edl\ElementService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ElementController
{
    private $dataService;
    private $elementService;

    public function __construct(DataService $dataService, ElementService $elementService)
    {
        $this->dataService = $dataService;
        $this->elementService = $elementService;
    }

    private function submitForm($request, $type, $id): array
    {
        $data = json_decode($request->getBody());

        $res = $this->elementService->validateData($data, $id);
        if($res['code'] == 0){
            return $res;
        }

        $obj = json_encode($res['data']);

        if($type == "create"){
            $res = $this->elementService->createElement($obj);
        }else{
            $res = $this->elementService->updateElement($obj, $id);
        }

       return $res;
    }

    /**
     * POST - route pour créer un élément
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
     * PUT - route pour modifier un élément
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
     * DELETE - route pour supprimer un élément
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->dataService->delete($response, 'library/delete_element/' . $args['id'], "GET");
    }
}