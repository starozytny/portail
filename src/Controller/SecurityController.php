<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\MailerService;
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
    private $mailerService;

    public function __construct(SessionInterface $session, Twig $twig, ApiService $apiService, MailerService $mailerService)
    {
        $this->session = $session;
        $this->twig = $twig;
        $this->apiService = $apiService;
        $this->mailerService = $mailerService;
    }

    /**
     * Route pour la view : connexion à l'espace client
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function index(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        if($this->session->get('user')){
            $username = $this->session->get('user')[0];
            $password = $this->apiService->decryption();

            $url = $this->loginCheck($request, $username, $password);

            return $response->withStatus(302)->withHeader('Location', $url);
        }

        return $this->twig->render($response, 'app/pages/security/index.twig', [
            'errors' => $request->getQueryParams()
        ]);
    }

    /**
     * POST Route pour la soumission du formulaire de connexion
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    public function loginForm(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $data = (array)$request->getParsedBody();
        $username = (string)($data['username'] ?? '');
        $password = (string)($data['password'] ?? '');

        $url = $this->loginCheck($request, $username, $password);

        return $response->withStatus(302)->withHeader('Location', $url);
    }

    /**
     * Route pour se déconnecter
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    public function logout(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $this->session->destroy();

        $routeParser = RouteContext::fromRequest($request)->getRouteParser();
        $url = $routeParser->urlFor('login');

        return $response->withStatus(302)->withHeader('Location', $url);
    }

    /**
     * Route pour envoyer un lien de réinitialisation de mot de passe
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    public function lostForm(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');
        $error = [['name' => 'fusername', 'message' => 'Cet champ doit être renseigné.']];

        $data = json_decode($request->getBody());
        $username = $data->username;
        if($username){

            $res = $this->apiService->callApiWithoutAuth('usermail/' . $username);
            $email = $res->getContents();

            if($email == ""){
                $response->getBody()->write(json_encode($error));
                return $response->withStatus(400);
            }

            $routeParser = RouteContext::fromRequest($request)->getRouteParser();
            $url = $routeParser->fullUrlFor($request->getUri(), 'reinitPassword');

            if($this->mailerService->sendMail(
                    'chanbora.chhun@outlook.fr',
                    "Mot de passe oublié pour Fokus.",
                    "Lien de réinitialisation de mot de passe.",
                    'app/email/security/forget.twig',
                    ['username' => $username, 'url' => $url]) != true)
            {
                $response->getBody()->write("Nous sommes désolé, le service d'envoi de mail est hors service pour le moment.");
                return $response->withStatus(400);
            }

            $response->getBody()->write(sprintf("Le lien de réinitialisation de votre mot de passe a été envoyé à : %s", $this->getHiddenEmail($email)));
            return $response->withStatus(200);
        }

        $response->getBody()->write(json_encode($error));
        return $response->withStatus(400);
    }

    /**
     * Route pour réinitialisation de mot de passe
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function reinitPassword(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return $this->twig->render($response, 'app/pages/security/reinit.twig');
    }

    /**
     * Method pour vérifier l'acces au site
     *
     * @param $request
     * @param $username
     * @param $password
     * @return string
     */
    private function loginCheck($request, $username, $password): string
    {
        $user = null;
        $userData = $this->apiService->connect($username, $password);
        if(($userData != false)) {
            $user = [
                $username,
                $this->apiService->encryption($password),
                $userData->first_name,
                $userData->last_name,
                $userData->society_data->credits,
                $userData->email
            ];
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
            $url = $routeParser->urlFor('login', [], ['errors' => "1"]);
        }

        return $url;
    }

    /**
     * Hide email for RGPD
     *
     * @param $email
     * @return string
     */
    private function getHiddenEmail($email): string
    {
        $at = strpos($email, "@");
        $domain = substr($email, $at, strlen($email));
        $firstLetter = substr($email, 0, 1);
        $etoiles = "";
        for($i=1 ; $i < $at ; $i++){
            $etoiles .= "*";
        }
        return $firstLetter . $etoiles . $domain;
    }
}