<?php

namespace App\Controller;

use App\Services\ApiService;
use Odan\Session\SessionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Routing\RouteContext;
use Slim\Views\Twig;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

final class SecurityController
{
    private $session;
    private $twig;
    private $apiService;

    public function __construct(SessionInterface $session, Twig $twig, ApiService $apiService)
    {
        $this->session = $session;
        $this->twig = $twig;
        $this->apiService = $apiService;
    }

    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    public function index(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return $this->twig->render($response, 'app/pages/security/index.twig');
    }

    public function login(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $data = (array)$request->getParsedBody();
        $username = (string)($data['username'] ?? '');
        $password = (string)($data['password'] ?? '');

        // Pseudo example
        // Check user credentials. You may use an application/domain service and the database here.
        $user = null;
        if($this->apiService->connect($username, $password)) {
            $user = [$username, $this->apiService->encryption($password)];
        }

        // Get RouteParser from request to generate the urls
        $routeParser = RouteContext::fromRequest($request)->getRouteParser();

        if ($user) {
            // Login successfully
            // Clears all session data and regenerate session ID
            $this->session->destroy();
            $this->session->start();
            $this->session->regenerateId();

            $this->session->set('user', $user);

            // Redirect to protected page
            $url = $routeParser->urlFor('homepage');
        } else {
            // Redirect back to the login page
            $url = $routeParser->urlFor('login', [], ['errors' => "fail"]);
        }

        return $response->withStatus(302)->withHeader('Location', $url);
    }

    public function logout(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $this->session->destroy();

        $routeParser = RouteContext::fromRequest($request)->getRouteParser();
        $url = $routeParser->urlFor('login');

        return $response->withStatus(302)->withHeader('Location', $url);
    }
}