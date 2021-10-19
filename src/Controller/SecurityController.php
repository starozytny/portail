<?php

namespace App\Controller;

use App\Repository\PasswordRepository;
use App\Services\ApiService;
use App\Services\MailerService;
use DateTime;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Odan\Session\SessionInterface;
use PDO;
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
    private $passwordRepository;
    private $connection;

    public function __construct(SessionInterface $session, Twig $twig, ApiService $apiService,
                                MailerService $mailerService, PasswordRepository $passwordRepository,
                                Connection $connection)
    {
        $this->session = $session;
        $this->twig = $twig;
        $this->apiService = $apiService;
        $this->mailerService = $mailerService;
        $this->passwordRepository = $passwordRepository;
        $this->connection = $connection;
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
     * @throws Exception
     * @throws \Exception
     */
    public function lostForm(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');
        $error = [['name' => 'fusername', 'message' => 'Cet champ doit être renseigné.']];
        $errorNeverLogin = [['name' => 'fusername', 'message' => 'Ce compte ne s\'est jamais connecté. Veuillez 
                                                                    contacter le manager des comptes pour vous fournir 
                                                                    votre mot de passe.']];
        $errorAlreadySent = [['name' => 'fusername', 'message' => 'Un mail de réinitialisation a déjà été envoyé, 
                                                                    veuillez vérifier vos spams ou courriers indésirables.']];

        $data = json_decode($request->getBody());
        $username = $data->username;
        if($username){

            $res = $this->apiService->callApiWithoutAuth('usermail/' . $username);
            $email = $res->getContents();

            if($email == ""){
                $response->getBody()->write(json_encode($error));
                return $response->withStatus(400);
            }

            $user = $this->passwordRepository->findOneByUsername($username);

            if($user == false){
                $response->getBody()->write(json_encode($errorNeverLogin));
                return $response->withStatus(400);
            }

            if($user['createdAt']){
                $interval = date_diff(new DateTime($user['createdAt']), new DateTime());
                if ($interval->y == 0 && $interval->m == 0 && $interval->d == 0 && $interval->h < 1) {
                    $response->getBody()->write(json_encode($errorAlreadySent));
                    return $response->withStatus(400);
                }
            }

            $createdAt = new DateTime();
            $createdAt->setTimezone(new \DateTimeZone("Europe/Paris"));

            $code = uniqid();

            $values = [
                'code' => $code,
                'createdAt' => $createdAt
            ];
            $this->connection->update('password', $values, ['username' => $username], [
                PDO::PARAM_STR,
                'datetime',
            ]);

            $routeParser = RouteContext::fromRequest($request)->getRouteParser();
            $url = $routeParser->fullUrlFor($request->getUri(), 'reinitPassword', ['token' => $user['token'], 'code' => $code]);

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
     * @param array $args
     * @return ResponseInterface
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws \Exception
     */
    public function reinitPassword(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $token = $args['token'];
        $code = $args['code'];
        $user = $this->passwordRepository->findOneByToken($token);

        $errors = 0;
        if($user){
            $interval = date_diff(new DateTime($user['createdAt']), new DateTime());

            if ($interval->y == 0 && $interval->m == 0 && $interval->d == 0 && $interval->h >= 1) {
                $errors = 1;
            }

            if($code !== $user['code']){
                $errors = 1;
            }
        }else{
            $errors = 1;
        }

        return $this->twig->render($response, 'app/pages/security/reinit.twig', [
            'errors' => $errors,
            'username' => $user['username'],
            'id' => $user['fokusId']
        ]);
    }

    /**
     * Method pour vérifier l'acces au site
     *
     * @param $request
     * @param $username
     * @param $password
     * @return string
     * @throws Exception
     */
    private function loginCheck($request, $username, $password): string
    {
        $user = null;
        $userData = $this->apiService->connect($username, $password);
        if(($userData != false)) {
            $user = [
                $username, //0
                $this->apiService->encryption($password),
                $userData->first_name,
                $userData->last_name,
                $userData->society_data->credits,
                $userData->email, //5
                $userData->user_tag,
                $userData->id,
                $userData->society_data->num_society,
                $userData->rights //9
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

            $currentUser = $this->passwordRepository->findOneByUsername($username);
            if(!$currentUser){
                $values = [
                    'fokusId' => $userData->id,
                    'username' => $username,
                    'token' =>  bin2hex(random_bytes(32))
                ];

                $this->connection->insert('password', $values, [
                    PDO::PARAM_INT,
                    PDO::PARAM_STR,
                    PDO::PARAM_STR,
                ]);
            }

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