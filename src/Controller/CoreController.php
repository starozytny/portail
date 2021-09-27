<?php

namespace App\Controller;

use App\Services\ApiService;
use GuzzleHttp\Exception\GuzzleException;
use http\Exception\RuntimeException;
use Odan\Session\SessionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class CoreController
{
    private $twig;
    /**
     * @var SessionInterface
     */
    private $session;
    private $apiService;

    public function __construct(SessionInterface $session, Twig $twig, ApiService $apiService)
    {
        $this->twig = $twig;
        $this->session = $session;
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

        $decryption = $this->apiService->decryption();


        var_dump($decryption);

        return $this->twig->render($response, 'app/pages/index.twig', $viewData);
    }
}