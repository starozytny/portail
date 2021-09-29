<?php

namespace App\Controller;

use App\Services\ApiService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class EdlController
{
    private $twig;
    private $apiService;

    public function __construct(Twig $twig, ApiService $apiService)
    {
        $this->twig = $twig;
        $this->apiService = $apiService;
    }

    private function getUsers(): array
    {
        $data = $this->apiService->callApi('users');
        $users = [];
        foreach($data as $elem){
            array_push($users, ['value' => $elem->id, 'label' =>  $elem->first_name . ' ' . $elem->last_name . ' - ' . '#' . $elem->username]);
        }

        return $users;
    }

    /**
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $method = $request->getMethod();

        if($method == "POST"){

        }

        $properties = $this->apiService->callApi('properties');

        return $this->twig->render($response, 'app/pages/edl/create.twig', [
            'users' => $this->getUsers(),
            'properties' => $properties,
            'donnees' => json_encode($properties)
        ]);
    }

    /**
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $method = $request->getMethod();

        if($method == "POST"){

        }

        $edl = $this->apiService->callApi('inventories/' . $args['id']);

        return $this->twig->render($response, 'app/pages/edl/update.twig', [
            'edl' => $edl,
            'test' => json_encode($edl),
            'users' => $this->getUsers()
        ]);
    }
}