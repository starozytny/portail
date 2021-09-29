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

        $data = $this->apiService->callApi('users');
        $users = [];
        foreach($data as $elem){
            array_push($users, ['value' => $elem->id, 'label' => $elem->first_name . ' ' . $elem->last_name]);
        }

        return $this->twig->render($response, 'app/pages/edl/create.twig', [
            'users' => $users
        ]);
    }
}