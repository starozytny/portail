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

    private function submitForm($data, $url)
    {
        $formFrom = $data->formFrom;

        $error0 = ['name' => $formFrom . '-firstname', 'message' => 'Cet champ doit être renseigné.'];
        $error1 = ['name' => $formFrom . '-lastname', 'message' => 'Cet champ doit être renseigné.'];
        $error2 = ['name' => $formFrom . '-email', 'message' => 'Cet champ doit être renseigné.'];
        $error3 = ['name' => $formFrom . '-userTag', 'message' => 'Cet champ doit être renseigné.'];
        $errors = [];

        $username = $this->session->get('user')[0];
        $firstname = $data->firstname;
        $lastname = $data->lastname;
        $password = isset($data->password) ?: "";
        $email = $data->email;
        $userTag = $data->userTag;
        if($firstname != "" && $lastname != "" && $email != ""){

            if($data->formFrom == "create"){
                //create userTag, username
                $i = 0;
                $uid = round(microtime(true));
                $loginId = substr($uid, 3, -2);

                $username = $this->session->get('user')[8] . $loginId;
                $userTag = mb_strtoupper(substr($firstname, 0, 3));

                $users = $this->apiService->callApi('users');
                foreach($users as $user){
                    if($user->username == $username){
                        $loginId++;
                        $username = $this->session->get('user')[8] . $loginId;
                    }
                    if($user->user_tag == $userTag){
                        $i++;
                        $userTag = $userTag . $i;
                    }
                }
            }

            $res = $this->apiService->callApi($url, 'POST', false, [
                'username' => $username,
                'first_name' => $firstname,
                'last_name' => $lastname,
                'password' => $password,
                'email' => $email,
                'user_tag' => $userTag
            ]);
            if($res == false){
                return "[UU001] Une erreur est survenu. Veuillez contacter le support.";
            }

            if($formFrom == "main"){
                $user = [
                    $this->session->get('user')[0],
                    $this->session->get('user')[1],
                    $firstname,
                    $lastname,
                    $this->session->get('user')[4],
                    $email,
                    $userTag,
                    $this->session->get('user')[7],
                    $this->session->get('user')[8],
                    $this->session->get('user')[9],
                ];

                $this->session->destroy();
                $this->session->start();
                $this->session->regenerateId();

                $this->session->set('user', $user);
            }

            return 1;
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
            if($userTag == ""){
                array_push($errors, $error3);
            }
        }

        return $errors;
    }

    /**
     * Route pour ajouter un utilisateur
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $data = json_decode($request->getBody());
        $res = $this->submitForm($data, 'add_user/');

        if($res != 1){
            $response->getBody()->write($res);
            return $response->withStatus(400);
        }

        $response->getBody()->write("Utilisateur ajouté.");
        return $response->withStatus(200);
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

        $data = json_decode($request->getBody());
        $res = $this->submitForm($data, 'edit_user/' . $args['id']);

        if($res != 1){
            $response->getBody()->write($res);
            return $response->withStatus(400);
        }

        $response->getBody()->write("Données mises à jour.");
        return $response->withStatus(200);
    }
}