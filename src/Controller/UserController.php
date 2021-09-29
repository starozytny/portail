<?php

namespace App\Controller;

use App\Services\ApiService;
use Odan\Session\SessionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UserController
{
    private $apiService;
    private $session;

    public function __construct(SessionInterface $session, ApiService $apiService)
    {
        $this->apiService = $apiService;
        $this->session = $session;
    }

    /**
     * Route pour modifier un utilisateur
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');
        $error0 = ['name' => 'firstname', 'message' => 'Cet champ doit être renseigné.'];
        $error1 = ['name' => 'lastname', 'message' => 'Cet champ doit être renseigné.'];
        $error2 = ['name' => 'email', 'message' => 'Cet champ doit être renseigné.'];
        $errors = [];

        $data = json_decode($request->getBody());
        $firstname = $data->firstname;
        $lastname = $data->lastname;
        $email = $data->email;
        if($firstname != "" && $lastname != "" && $email != ""){

            $res = $this->apiService->callApi('edit_user/' . $args['id'], 'POST', false, [
                'first_name' => $firstname,
                'last_name' => $lastname,
                'email' => $email,
                'user_tag' => $data->userTag
            ]);
            if($res == false){
                $response->getBody()->write("[UU001] Une erreur est survenu. Veuillez contacter le support.");
                return $response->withStatus(400);
            }

            if($data->main){
                $user = [
                    $this->session->get('user')[0],
                    $this->session->get('user')[1],
                    $firstname,
                    $lastname,
                    $this->session->get('user')[4],
                    $email,
                    $this->session->get('user')[6],
                    $this->session->get('user')[7]
                ];

                $this->session->destroy();
                $this->session->start();
                $this->session->regenerateId();

                $this->session->set('user', $user);
            }

            $response->getBody()->write($firstname . " " . $lastname . " mis à jour.");
            return $response->withStatus(200);
        }else{
            if($firstname == ""){
                array_push($errors, $error0);
            }
            if($lastname == ""){
                array_push($errors, $error1);
            }
            if($email == ""){
                array_push($errors, $error2);
            }
        }

        $response->getBody()->write(json_encode($errors));
        return $response->withStatus(400);
    }
}