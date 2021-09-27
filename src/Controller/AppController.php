<?php

namespace App\Controller;

use App\Services\ApiService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class AppController
{
    private $twig;
    private $apiService;

    public function __construct(Twig $twig, ApiService $apiService)
    {
        $this->twig = $twig;
        $this->apiService = $apiService;
    }

    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    public function homepage(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $viewData = [
            'name' => 'World',
            'notifications' => [
                'message' => 'You are good!'
            ],
        ];

        return $this->twig->render($response, 'app/pages/index.twig', $viewData);
    }

    /**
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function edl(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $elements = $this->apiService->callApi('inventories/full/list');

        $data = ['unknown' => [ 'unknown' => [] ]];

        foreach ($elements as $elem) {
            $inventoryDate = $elem->inventory->date;
            if($inventoryDate == "0"){
                array_push($data['unknown']['unknown'], $elem);
            }else{
                $year = date('Y', $inventoryDate);
                $month = date('m', $inventoryDate);

                if(!isset($data[$year])){
                    $data[$year] = [ $month => [$elem] ];
                }else{
                    if(!isset($data[$year][$month])){
                        $data[$year][$month] = [$elem];
                    }else{
                        array_push($data[$year][$month], $elem);
                    }
                }
            }
        }

        return $this->twig->render($response, 'app/pages/edl/index.twig', [
            'data' => $data,
            'donnees' => json_encode($data)
        ]);
    }
}