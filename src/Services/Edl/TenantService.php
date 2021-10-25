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

        $reference  = $this->sanitizeData->clean(mb_strtoupper($data->reference));
        $lastname   = $this->sanitizeData->clean($data->lastname);
        $firstname  = $this->sanitizeData->clean($data->firstname);
        $phone      = $this->sanitizeData->toFormatPhone($data->phone);
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
            return [ 'code' => 0, 'data' => json_encode($errors['data']) ];
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
                if (mb_strtoupper($obj->reference) == mb_strtoupper($reference)) {
                    return ['code' => 0, 'data' => [['name' => 'reference', 'message' => "Ce locataire existe déjà."]]];
                }

                if (mb_strtoupper($obj->addr1) == mb_strtoupper($addr1) &&
                    mb_strtoupper($obj->last_name) == mb_strtoupper($lastname) &&
                    mb_strtoupper($obj->first_name) == mb_strtoupper($firstname)
                ) {
                    return ['code' => 0, 'data' => [['name' => 'lastname', 'message' => "Ce locataire existe déjà."]]];
                }
            }
        }

        return ['code' => 1];
    }

    public function createTenant($json): array
    {
        $this->apiService->callApiWithErrors('add_tenant', 'POST', false, $this->getDataToSend($json, true));

        return $this->returnElement($json->reference);
    }

    public function updateTenant($data, $id): array
    {
        $obj = json_decode($data);
        $this->apiService->callApiWithErrors('edit_tenant/' . $id, 'PUT', false, $this->getDataToSend($obj, false));

        return $this->returnElement($obj->reference);
    }

    private function returnElement($reference): array
    {
        $objs = $this->apiService->callApiWithErrors('tenants');

        $data = null;
        foreach($objs['data'] as $obj){
            if($obj->reference == $reference){
                $data = $obj;
            }
        }

        if($data == null){
            return ['code' => 0, 'data' => ['message' => "[TFORM001] Veuillez rafraichir la page manuellement."]];
        }

        return ['code' => 1, 'data' => json_encode($data)];
    }

    /**
     * for create if no use cleanForPost = fail create
     * for update if we use cleanForPost and have ' => add \' and not in create function
     *
     * @param $data
     * @param $toClean
     * @return array
     */
    public function getDataToSend($data, $toClean): array
    {
        return [
            'reference'     => $toClean ? $this->sanitizeData->cleanForPost($data->reference) : $data->reference,
            'last_name'     => $toClean ? $this->sanitizeData->cleanForPost($data->last_name) : $data->last_name,
            'first_name'    => $toClean ? $this->sanitizeData->cleanForPost($data->first_name) : $data->first_name,
            'phone'         => $toClean ? $this->sanitizeData->cleanForPost($data->phone) : $data->phone,
            'email'         => $toClean ? $this->sanitizeData->cleanForPost($data->email) : $data->email,
            'addr1'         => $toClean ? $this->sanitizeData->cleanForPost($data->addr1) : $data->addr1,
            'addr2'         => $toClean ? $this->sanitizeData->cleanForPost($data->addr2) : $data->addr2,
            'addr3'         => $toClean ? $this->sanitizeData->cleanForPost($data->addr3) : $data->addr3,
            'zipcode'       => $toClean ? $this->sanitizeData->cleanForPost($data->zipcode) : $data->zipcode,
            'city'          => $toClean ? $this->sanitizeData->cleanForPost($data->city) : $data->city,
        ];
    }
}