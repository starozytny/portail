<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\Edl\TenantService;
use App\Services\SanitizeData;
use App\Services\Validateur;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class TenantController
{
    private $apiService;
    private $sanitizeData;
    private $validateur;
    private $tenantService;

    public function __construct(ApiService $apiService, SanitizeData $sanitizeData, Validateur $validateur, TenantService $tenantService)
    {
        $this->apiService = $apiService;
        $this->sanitizeData = $sanitizeData;
        $this->validateur = $validateur;
        $this->tenantService = $tenantService;
    }

    private function submitForm($request, $type, $id): array
    {
        $data = json_decode($request->getBody());

        $res = $this->tenantService->validateData($data, $id);
        if($res['code'] == 0){
            return $res;
        }

        $obj = json_encode($res['data']);

        if($type == "create"){
            $res = $this->tenantService->createTenant($obj);
        }else{
//            $res = $this->tenantService->updateProperty($obj, $id);
        }

        return $res;
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->submitForm($request, "create", null);
        if($res['code'] == 0){
            $response->getBody()->write($res['data']);
            return $response->withStatus(400);
        }

        $response->getBody()->write("ok");
        return $response->withStatus(200);
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->withHeader('Content-Type', 'application/json');

        $res = $this->submitForm($request, "update", $args["id"]);
        if($res['code'] == 0){
            $response->getBody()->write($res['data']);
            return $response->withStatus(400);
        }

        $response->getBody()->write(json_encode($res['data']));
        return $response->withStatus(200);
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
            ['type' => 'length', 'min' => 0, 'max' => 5,  'id' => 'reference',  'value'=> $reference],
            ['type' => 'length', 'min' => 0, 'max' => 80, 'id' => 'lastname',   'value' => $lastname],
            ['type' => 'length', 'min' => 0, 'max' => 80, 'id' => 'firstname',  'value' => $firstname],
            ['type' => 'length', 'min' => 0, 'max' => 15, 'id' => 'phone',      'value' => $phone],
            ['type' => 'length', 'min' => 0, 'max' => 80, 'id' => 'email',      'value' => $email],
            ['type' => 'length', 'min' => 0, 'max' => 80, 'id' => 'addr1',      'value' => $addr1],
            ['type' => 'length', 'min' => 0, 'max' => 40, 'id' => 'addr2',      'value' => $addr2],
            ['type' => 'length', 'min' => 0, 'max' => 40, 'id' => 'addr3',      'value' => $addr3],
            ['type' => 'length', 'min' => 0, 'max' => 40, 'id' => 'city',       'value' => $city],
            ['type' => 'length', 'min' => 0, 'max' => 5,  'id' => 'zipcode',    'value' => $zipcode],
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