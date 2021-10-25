<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\Data\DataService;
use App\Services\SanitizeData;
use App\Services\Validateur;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Odan\Session\SessionInterface;
use PDO;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UserController
{
    private $apiService;
    private $session;
    private $validateur;
    private $sanitizeData;
    private $connection;
    private $dataService;

    public function __construct(SessionInterface $session, ApiService $apiService, Validateur $validateur,
                                SanitizeData $sanitizeData, Connection $connection, DataService $dataService)
    {
        $this->apiService = $apiService;
        $this->session = $session;
        $this->validateur = $validateur;
        $this->sanitizeData = $sanitizeData;
        $this->connection = $connection;
        $this->dataService = $dataService;
    }

    /**
     * POST - Route pour ajouter un utilisateur
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = json_decode($request->getBody());
        $res = $this->submitForm($data, 'add_user/');

        return $this->dataService->returnResponse($res['code'] != 1 ? 400 : 200, $response,
            $res['code'] != 1 ? $res['data'] : "Utilisateur ajouté."
        );
    }

    /**
     * PUT - Route pour modifier un utilisateur
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = json_decode($request->getBody());
        $res = $this->submitForm($data, 'edit_user/' . $args['id'], $args['id']);

        return $this->dataService->returnResponse($res['code'] != 1 ? 400 : 200, $response,
            $res['code'] != 1 ? $res['data'] : json_encode($res['data'])
        );
    }

    /**
     * Method pour le formulaire de création et édition d'un utilisateur
     *
     * @param $data
     * @param $url
     * @param null $userId
     * @return array
     */
    private function submitForm($data, $url, $userId=null): array
    {
        $formFrom = $data->formFrom;
        $username = $data->username ?? "";
        $firstname = $this->sanitizeData->cleanForPost($data->firstname);
        $lastname = $this->sanitizeData->cleanForPost($data->lastname);
        $password = $data->password ?? "";
        $email = $this->sanitizeData->clean($data->email);
        $userTag = $data->userTag;

        // validation des données
        $paramsToValidate = [
            ['type' => 'text', 'name' => $formFrom . '-firstname',    'value' => $firstname],
            ['type' => 'text', 'name' => $formFrom . '-lastname',     'value' => $lastname],
            ['type' => 'text', 'name' => $formFrom . '-email',        'value' => $email]
        ];
        if($formFrom == "create" || $password != ""){
            array_push($paramsToValidate, ['type' => 'text', 'name' => $formFrom . '-password', 'value' => $password]);
        }
        $errors = $this->validateur->validate($paramsToValidate);
        if(count($errors) > 0){
            return ['code' => 0, 'data' => json_encode($errors)];
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
            return ['code' => 0, 'data' => "[UU001] Une erreur est survenu. Veuillez contacter le support."];
        }

        //regeneration des variables en sessions
        if($formFrom == "main"){
            $sessionPassword = $password != "" ? $this->apiService->encryption($password) : $this->session->get('user')[1];

            $user = [
                $this->session->get('user')[0], //username
                $sessionPassword, //password
                $firstname,
                $lastname,
                $this->session->get('user')[4], //crédits
                $email,
                $userTag,
                $this->session->get('user')[7], //id
                $this->session->get('user')[8], //num_society
                $this->session->get('user')[9], //rights
            ];

            $this->session->destroy();
            $this->session->start();
            $this->session->regenerateId();

            $this->session->set('user', $user);
        }

        if($formFrom != "create" && $password != ""){
            $res = $this->apiService->callApiWithoutAuth("edit_user_password/" . $username . "-" . $userId, 'PUT', false, [
                'password' => $password
            ]);
            if($res == false){
                return ['code' => 0, 'data' => "[UU002] Une erreur est survenu. Veuillez contacter le support."];
            }
        }

        return ['code' => 1, 'data' => $dataToSend];
    }

    /**
     * DELETE - Route pour supprimer un utilisateur
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $msg = "Vous n'avez pas le droit de supprimer cet utilisateur.";
        if($this->session->get('user')[9] == "1"){

            $inventories = $this->apiService->callApi('inventories/list');
            $canDelete = true;
            foreach($inventories as $inventory){
                if($inventory->user_id == $args['id']){
                    $canDelete = false;
                }
            }

            if($canDelete){
                $res = $this->apiService->callApi('delete_user/' . $args['id'], 'GET', false);

                return $this->dataService->returnResponse( $res == false ? 400 : 200, $response,
                    $res == false ? "[UD001] Une erreur est survenu. Veuillez contacter le support." : "Utilisateur supprimé."
                );
            }else{
                $msg = "Des états des lieux sont associés à cet utilisateur. Vous ne pouvez pas le supprimer.";
            }
        }

        return $this->dataService->returnResponse( 400, $response, $msg);
    }

    /**
     * POST - modifie le mot de passe d'un utilisateur
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     * @throws Exception
     */
    public function updatePassword(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = json_decode($request->getBody());

        $password = $data->password;
        $passwordConfirm = $data->passwordConfirm;

        // validation des données
        if($password == "" && $password != $passwordConfirm){
            return $this->dataService->returnResponse( 400, $response, [['name' => 'password', 'message' => "Veuillez vérifier votre saisie."]], true);
        }

        $res = $this->apiService->callApiWithoutAuth("edit_user_password/" . $args['username'] . "-" . $args['id'], 'PUT', false, [
            'password' => $password
        ]);
        if($res == false){
            return $this->dataService->returnResponse( 400, $response, ['message' => "[UUPASS001] Une erreur est survenu. Veuillez contacter le support."], true);
        }

        $values = [
            'code' => null,
            'createdAt' => null
        ];
        $this->connection->update('password', $values, ['username' => $args['username']], [
            PDO::PARAM_STR,
            'datetime',
        ]);

        return $this->dataService->returnResponse( 200, $response, ['message' => "Mot de passe mis à jour."], true);
    }
}