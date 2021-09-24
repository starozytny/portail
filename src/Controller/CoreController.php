<?php

namespace App\Controller;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

class CoreController
{
    private $twig;

    public function __construct(Twig $twig)
    {
        $this->twig = $twig;
    }

    public function homepage(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $viewData = [
            'name' => 'World',
            'notifications' => [
                'message' => 'You are good!'
            ],
        ];

        return $this->twig->render($response, 'index.twig', $viewData);
    }

    public function contact(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $viewData = [
            'name' => 'Contact',
            'notifications' => [
                'message' => 'You are good!'
            ],
        ];

        return $this->twig->render($response, 'index.twig', $viewData);
    }
}