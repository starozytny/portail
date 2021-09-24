<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

class CoreController
{
    private $twig;
    private $userRepository;

    public function __construct(Twig $twig, UserRepository $userRepository)
    {
        $this->twig = $twig;
        $this->userRepository = $userRepository;
    }

    public function homepage(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $viewData = [
            'name' => 'World',
            'notifications' => [
                'message' => 'You are good!'
            ],
        ];

        var_dump($this->userRepository->getUser('002A8080'));

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