<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\SanitizeData;
use App\Services\Validateur;
use Odan\Session\SessionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UserController
{
    private $apiService;
    private $session;
    private $validateur;
    private $sanitizeData;

    public function __construct(SessionInterface $session, ApiService $apiService, Validateur $validateur, SanitizeData $sanitizeData)
    {
        $this->apiService = $apiService;
        $this->session = $session;
        $this->validateur = $validateur;
        $this->sanitizeData = $sanitizeData;
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

        if($res['code'] != 1){
            $response->getBody()->write($res['errors']);
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
        $res = $this->submitForm($data, 'edit_user/' . $args['id'], $args['id']);

        if($res['code'] != 1){
            $response->getBody()->write($res['errors']);
            return $response->withStatus(400);
        }

        $response->getBody()->write(json_encode($res['data']));
        return $response->withStatus(200);
    }

    /**
     * Method pour envoyer le formulaire de création et édition d'un utilisateur
     *
     * @param $data
     * @param $url
     * @return array
     */
    private function submitForm($data, $url, $userId=null): array
    {
        $formFrom = $data->formFrom;
        $username = $data->username ?? "";
        $firstname = $this->sanitizeData->clean($data->firstname);
        $lastname = $this->sanitizeData->clean($data->lastname);
        $password = $data->password ?? "";
        $email = $this->sanitizeData->clean($data->email);
        $userTag = $data->userTag;

        // validation des données
        $paramsToValidate = [
            ['type' => 'text', 'name' => $formFrom . '-firstname',    'value' => $firstname],
            ['type' => 'text', 'name' => $formFrom . '-lastname',     'value' => $lastname],
            ['type' => 'text', 'name' => $formFrom . '-email',        'value' => $email]
        ];
        if($formFrom == "create"){
            array_push($paramsToValidate, ['type' => 'text', 'name' => $formFrom . '-password', 'value' => $password]);
        }
        $errors = $this->validateur->validate($paramsToValidate);
        if(count($errors) > 0){
            return [
                'code' => 0,
                'error' => json_encode($errors)
            ];
        }

        if($formFrom == "create"){
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

        //Appel API
        $dataToSend = [
            'id' => $userId, // for javascript edit
            'username' => $username,
            'first_name' => $firstname,
            'last_name' => $lastname,
            'password' => $password,
            'email' => $email,
            'user_tag' => $userTag
        ];
        $res = $this->apiService->callApi($url, 'POST', false, $dataToSend);
        if($res == false){
            return [
                'code' => 0,
                'errors' => "[UU001] Une erreur est survenu. Veuillez contacter le support."
            ];
        }

        //regeneration des variables en sessions
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

        return [
            'code' => 1,
            'data' => $dataToSend
        ];
    }

    /**
     * Route pour supprimer un utilisateur
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->apiService->callApi('delete_user/' . $args['id'], 'GET', false);
        if($res == false){
            $response->getBody()->write("[UD001] Une erreur est survenu. Veuillez contacter le support.");
            return $response->withStatus(400);
        }

        $response->getBody()->write("Utilisateur supprimé.");
        return $response->withStatus(200);
    }
}