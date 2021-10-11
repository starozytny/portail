<?php

namespace App\Services\Edl;

use App\Services\ApiService;
use App\Services\SanitizeData;
use App\Services\Validateur;

class TenantService
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

    public function validateData($data, $id): array
    {

        $reference  = $this->sanitizeData->clean($data->reference);
        $lastname   = $this->sanitizeData->clean($data->lastname);
        $firstname  = $this->sanitizeData->clean($data->firstname);
        $phone      = $this->sanitizeData->clean($data->phone);
        $email      = $this->sanitizeData->clean($data->email);
        $addr1      = $this->sanitizeData->clean($data->addr1);
        $addr2      = $this->sanitizeData->clean($data->addr2);
        $addr3      = $this->sanitizeData->clean($data->addr3);
        $city       = $this->sanitizeData->clean($data->city);
        $zipcode    = $this->sanitizeData->clean($data->zipcode);

        // validation des données
        $paramsToValidate = [
            ['type' => 'text',   'name' => 'lastname',          'value' => $lastname],
            ['type' => 'text',   'name' => 'firstname',         'value' => $firstname],
            ['type' => 'text',   'name' => 'reference',         'value' => $reference],
            ['type' => 'length', 'name' => 'reference',         'value' => $reference,  'min' => 0, 'max' => 5],
            ['type' => 'length', 'name' => 'addr1',             'value' => $addr1,      'min' => 0, 'max' => 80],
            ['type' => 'length', 'name' => 'addr2',             'value' => $addr2,      'min' => 0, 'max' => 40],
            ['type' => 'length', 'name' => 'addr2',             'value' => $addr2,      'min' => 0, 'max' => 40],
            ['type' => 'length', 'name' => 'zipcode',           'value' => $zipcode,    'min' => 0, 'max' => 5],
            ['type' => 'length', 'name' => 'city',              'value' => $city,       'min' => 0, 'max' => 40],
            ['type' => 'length', 'name' => 'lastname',          'value' => $lastname,   'min' => 0, 'max' => 80],
            ['type' => 'length', 'name' => 'firstname',         'value' => $firstname,  'min' => 0, 'max' => 80],
            ['type' => 'length', 'name' => 'phone',             'value' => $phone,      'min' => 0, 'max' => 15],
            ['type' => 'length', 'name' => 'email',             'value' => $email,      'min' => 0, 'max' => 80],
        ];
        $errors = $this->validateur->validate($paramsToValidate);
        if(count($errors) > 0){
            return [ 'code' => 0, 'data' => json_encode($errors) ];
        }

        $errors = $this->notExiste($id, $reference, $lastname, $firstname, $addr1);
        if($errors['code'] == 0){
            return [ 'code' => 0, 'data' => json_encode($errors) ];
        }

        return [
            'code' => 1,
            'data' => [
                'last_name'     => $lastname,
                'first_name'    => $firstname,
                'reference'     => $reference,
                'phone'         => $phone,
                'email'         => $email,
                'addr1'         => $addr1,
                'addr2'         => $addr2,
                'addr3'         => $addr3,
                'city'          => $city,
                'zipcode'       => $zipcode
            ]
        ];
    }

    private function notExiste($id, $reference, $lastname, $firstname,  $addr1): array
    {
        $objs = $this->apiService->callApi('tenants');
        foreach($objs as $obj){
            if($obj->id != $id) {
                if ($obj->reference == $reference) {
                    return ['code' => 0, 'data' => [['name' => 'reference', 'message' => "Ce locataire existe déjà."]]];
                }

                if ($obj->addr1 == $addr1 && $obj->last_name == $lastname && $obj->first_name == $firstname) {
                    return ['code' => 0, 'data' => [['name' => 'lastname', 'message' => "Ce locataire existe déjà."]]];
                }
            }
        }

        return ['code' => 1];
    }

    public function extractTenantsFromFormEdl($tenants, $tenantsCreate): array
    {
        $allTenants = $this->apiService->callApi('tenants');

        $tenantsArray = [];
        if($tenantsCreate != ""){
            $tab = explode('#', $tenantsCreate);

            $fail = false; $failsReturn = null;
            foreach($tab as $tenantObject){
                if(!$fail){

                    $obj = json_decode($tenantObject);

                    $alreadyCreated = false;
                    foreach($allTenants as $oriTenant){
                        if($oriTenant->reference == $obj->reference){
                            $alreadyCreated = true;
                        }
                    }

                    if(!$alreadyCreated){
                        $res = $this->createTenant($tenantObject);

                        if($res['code'] == 0){
                            $fail = true;
                            $failsReturn = $res;
                        }else{
                            array_push($tenantsArray, $obj->reference);
                        }
                    }else{
                        array_push($tenantsArray, $obj->reference);
                    }
                }
            }

            if($fail){
                $this->deleteTenantFromArrayReference($tenantsArray);

                return $failsReturn;
            }
        }
        if($tenants != ""){
            $tenants = explode(',', $tenants);
            foreach($tenants as $tenantId){
                foreach($allTenants as $oriTenant){
                    if($oriTenant->id == $tenantId){
                        array_push($tenantsArray, $oriTenant->reference);
                    }
                }
            }
        }

        return [
            'code' => 1,
            'data' => $tenantsArray
        ];
    }

    public function createTenant($json): array
    {
        $obj = json_decode($json);

        $res = $this->apiService->callApiWithErrors('add_tenant', 'POST', false, $this->getDataToSend($obj));
        if($res['code'] == 0){
            return $res;
        }

        return ['code' => 1];
    }

    public function deleteTenantFromArrayReference($references)
    {
        $tenants = $this->apiService->callApi('tenants');
        $toDelete = [];
        foreach($references as $reference){
            foreach($tenants as $tenant){
                if($tenant->reference == $reference){
                    array_push($toDelete, $tenant->id);
                }
            }
        }

        foreach($toDelete as $item){
            $this->apiService->callApi('delete_tenant/' . $item);
        }
    }

    public function getDataToSend($data): array
    {
        return [
            'reference'     => $data->reference,
            'last_name'     => $data->last_name,
            'first_name'    => $data->first_name,
            'phone'         => $data->phone,
            'email'         => $data->email,
            'addr1'         => $data->addr1,
            'addr2'         => $data->addr2,
            'addr3'         => $data->addr3,
            'zipcode'       => $data->zipcode,
            'city'          => $data->city,
        ];
    }
}