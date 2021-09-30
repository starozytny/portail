<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\SanitizeData;
use App\Services\Validateur;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class TenantController
{
    private $apiService;
    private $sanitizeData;
    private $validateur;

    public function __construct(ApiService $apiService, SanitizeData $sanitizeData, Validateur $validateur)
    {
        $this->apiService = $apiService;
        $this->sanitizeData = $sanitizeData;
        $this->validateur = $validateur;
    }

    public function check(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $data = json_decode($request->getBody());
        $lastname = $this->sanitizeData->clean($data->lastname);
        $firstname = $this->sanitizeData->clean($data->firstname);
        $reference = $this->sanitizeData->clean($data->reference);
        $phone = $this->sanitizeData->clean($data->phone);
        $email = $this->sanitizeData->clean($data->email);
        $addr1 = $this->sanitizeData->clean($data->addr1);
        $addr2 = $this->sanitizeData->clean($data->addr2);
        $addr3 = $this->sanitizeData->clean($data->addr3);
        $city = $this->sanitizeData->clean($data->city);
        $zipcode = $this->sanitizeData->clean($data->zipcode);

        // validation des données
        $paramsToValidate = [
            ['type' => 'text', 'name' => 'lastname',            'value' => $lastname],
            ['type' => 'text', 'name' => 'firstname',           'value' => $firstname],
            ['type' => 'text', 'name' => 'reference-tenant',    'value' => $reference],
        ];
        $errors = $this->validateur->validate($paramsToValidate);
        if(count($errors) > 0){
            $response->getBody()->write(json_encode($errors));
            return $response->withStatus(400);
        }

        $dataToSend = [
            'id' => $reference,
            'last_name' => $lastname,
            'first_name' => $firstname,
            'reference' => $reference,
            'phone' => $phone,
            'email' => $email,
            'addr1' => $addr1,
            'addr2' => $addr2,
            'addr3' => $addr3,
            'city' => $city,
            'zipcode' => $zipcode
        ];

        $tenants = $this->apiService->callApi('tenants');
        foreach($tenants as $tenant){
            if($tenant->reference == $reference){
                $response->getBody()->write(json_encode([['name' => 'reference-tenant', 'message' => "Ce locataire existe déjà."]]));
                return $response->withStatus(400);
            }

            if($tenant->last_name == $lastname && $tenant->first_name == $firstname && $tenant->addr1 == $addr1){
                $response->getBody()->write(json_encode([['name' => 'lastname', 'message' => "Ce locataire existe déjà."]]));
                return $response->withStatus(400);
            }
        }

        $response->getBody()->write(json_encode($dataToSend));
        return $response->withStatus(200);
    }
}