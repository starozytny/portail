<?php

namespace App\Controller;

use App\Repository\UserRepository;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class CoreController
{
    private $twig;
    private $userRepository;

    public function __construct(Twig $twig, UserRepository $userRepository)
    {
        $this->twig = $twig;
        $this->userRepository = $userRepository;
    }

    /**
     * @throws SyntaxError
     * @throws GuzzleException
     * @throws RuntimeError
     * @throws LoaderError
     */
    public function homepage(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $client = new Client();
        $res = $client->get( 'http://v2.focus.immo/api/login_data', [
            'auth' =>  ['999A8080', 'pierre']
        ]);

        if($res->getStatusCode() == 200){
            $body = $res->getBody();
            $viewData = [
                'test' => json_encode(json_decode($body)),
                'name' => 'World',
                'notifications' => [
                    'message' => 'You are good!'
                ],
            ];
        }

        return $this->twig->render($response, 'app/pages/index.twig', $viewData);
    }

    public function contact(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $viewData = [
            'name' => 'Contact',
            'notifications' => [
                'message' => 'You are good!'
            ],
        ];

        return $this->twig->render($response, 'app/pages/index.twig', $viewData);
    }
}