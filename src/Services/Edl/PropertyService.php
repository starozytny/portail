<?php

namespace App\Services\Edl;

use App\Services\ApiService;
use App\Services\SanitizeData;
use App\Services\Validateur;

class PropertyService
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
        $typeBien       = $this->sanitizeData->clean($data->typeBien);
        $reference      = $this->sanitizeData->clean(mb_strtoupper($data->reference));
        $owner          = $this->sanitizeData->clean($data->owner);
        $building       = $this->sanitizeData->clean($data->building);
        $addr1          = $this->sanitizeData->clean($data->addr1);
        $addr2          = $this->sanitizeData->clean($data->addr2);
        $addr3          = $this->sanitizeData->clean($data->addr3);
        $surface        = $this->sanitizeData->clean($data->surface);
        $rooms          = $this->sanitizeData->clean($data->rooms);
        $floor          = $this->sanitizeData->clean($data->floor);
        $door           = $this->sanitizeData->clean($data->door);
        $city           = $this->sanitizeData->clean($data->city);
        $zipcode        = $this->sanitizeData->clean($data->zipcode);
        $isFurnished    = $this->sanitizeData->clean($data->isFurnished);

        // validation des données
        $paramsToValidate = [
            ['type' => 'text',   'name' => 'reference',     'value' => $reference],
            ['type' => 'text',   'name' => 'addr1',         'value' => $addr1],
            ['type' => 'text',   'name' => 'city',          'value' => $city],
            ['type' => 'text',   'name' => 'zipcode',       'value' => $zipcode],
            ['type' => 'length', 'name' => 'reference',     'value' => $reference,  'min' => 0, 'max' => 10],
            ['type' => 'length', 'name' => 'addr1',         'value' => $addr1,      'min' => 0, 'max' => 64],
            ['type' => 'length', 'name' => 'addr2',         'value' => $addr2,      'min' => 0, 'max' => 64],
            ['type' => 'length', 'name' => 'addr2',         'value' => $addr2,      'min' => 0, 'max' => 64],
            ['type' => 'length', 'name' => 'zipcode',       'value' => $zipcode,    'min' => 0, 'max' => 10],
            ['type' => 'length', 'name' => 'city',          'value' => $city,       'min' => 0, 'max' => 64],
            ['type' => 'length', 'name' => 'door',          'value' => $door,       'min' => 0, 'max' => 20],
            ['type' => 'length', 'name' => 'floor',         'value' => $floor,      'min' => 0, 'max' => 20],
            ['type' => 'length', 'name' => 'typeBien',      'value' => $typeBien,   'min' => 0, 'max' => 20],
            ['type' => 'length', 'name' => 'building',      'value' => $building,   'min' => 0, 'max' => 40],
            ['type' => 'length', 'name' => 'owner',         'value' => $owner,      'min' => 0, 'max' => 32],
        ];
        $errors = $this->validateur->validate($paramsToValidate);
        if(count($errors) > 0){
            return [ 'code' => 0, 'data' => json_encode($errors) ];
        }

        $errors = $this->notExiste($id, $reference, $addr1, $city, $zipcode, $isFurnished);
        if($errors['code'] == 0){
            return [ 'code' => 0, 'data' => json_encode($errors['data']) ];
        }

        return [
            'code' => 1,
            'data' => [
                'typeBien'      => $typeBien,
                'reference'     => $reference,
                'owner'         => $owner,
                'building'      => $building,
                'addr1'         => $addr1,
                'addr2'         => $addr2,
                'addr3'         => $addr3,
                'surface'       => $surface,
                'rooms'         => $rooms,
                'floor'         => $floor,
                'door'          => $door,
                'city'          => $city,
                'zipcode'       => $zipcode,
                'isFurnished'   => $isFurnished
            ]
        ];
    }

    private function notExiste($id, $reference, $addr1, $city, $zipcode, $isFurnished): array
    {
        $properties = $this->apiService->callApi('properties');
        foreach($properties as $property){
            if($property->id != $id) {
                if (mb_strtoupper($property->reference) == mb_strtoupper($reference)) {
                    return ['code' => 0, 'data' => [['name' => 'reference', 'message' => "Ce bien existe déjà."]]];
                }

                if (mb_strtoupper($property->addr1) == mb_strtoupper($addr1) &&
                    mb_strtoupper($property->city) == mb_strtoupper($city) &&
                    mb_strtoupper($property->zipcode) == mb_strtoupper($zipcode) &&
                    mb_strtoupper($property->is_furnished) == mb_strtoupper($isFurnished)
                ) {
                    return ['code' => 0, 'data' => [['name' => 'addr1', 'message' => "Ce bien existe déjà."]]];
                }
            }
        }

        return ['code' => 1];
    }

    public function getPropertyUid($bienId): array
    {
        $property = $this->apiService->callApi('properties/' . $bienId);
        if($property == false){
            return [
                'code' => 0,
                'message' => "[SERVICEPE002] Une erreur est survenu. Veuillez contacter le support."
            ];
        }
        return [
            'code' => 1,
            'data' => $property->uid
        ];
    }

    public function createProperty($bien, $returnEntity = false): array
    {
        $bienId = null; $lastInventoryUid = null;
        $res = $this->apiService->callApiWithErrors('add_property', 'POST', false, $this->getDataToSend($bien, true));
        if($res['code'] == 0){
            return $res;
        }

        //get id created
        $properties = $this->apiService->callApi('properties');
        foreach($properties as $property){
            if($property->reference == $bien->reference){
                $bienId = $property->id;
                $lastInventoryUid = $property->last_inventory_uid;
            }
        }

        if(!$bienId){
            return [
                'code' => 0,
                'data' => "[SERVICEPE001] Une erreur est survenu. Veuillez contacter le support."
            ];
        }

        if(!$returnEntity){
            return [
                'code' => 1,
                'data' => $bienId,
                'lastInventoryUid' => $lastInventoryUid
            ];
        }else{
            return $this->returnElement($bien->reference);
        }
    }

    public function updateProperty($data, $id): array
    {
        $bien = json_decode($data);
        $this->apiService->callApiWithErrors('edit_property/' . $id, 'PUT', false, $this->getDataToSend($bien, false));

        return $this->returnElement($bien->reference);
    }

    private function returnElement($reference): array
    {
        $objs = $this->apiService->callApiWithErrors('properties');

        $data = null;
        foreach($objs['data'] as $obj){
            if($obj->reference == $reference){
                $data = $obj;
            }
        }

        if($data == null){
            return ['code' => 0, 'data' => "[PFORM001] Veuillez rafraichir la page manuellement."];
        }

        return ['code' => 1, 'data' => json_encode($data)];
    }

    private function getDataToSend($data, $toClean): array
    {
        return [
            'reference'     => $toClean ? $this->sanitizeData->cleanForPost($data->reference) : $data->reference,
            'addr1'         => $toClean ? $this->sanitizeData->cleanForPost($data->addr1) : $data->addr1,
            'addr2'         => $toClean ? $this->sanitizeData->cleanForPost($data->addr2) : $data->addr2,
            'addr3'         => $toClean ? $this->sanitizeData->cleanForPost($data->addr3) : $data->addr3,
            'zipcode'       => $toClean ? $this->sanitizeData->cleanForPost($data->zipcode) : $data->zipcode,
            'city'          => $toClean ? $this->sanitizeData->cleanForPost($data->city) : $data->city,
            'rooms'         => $toClean ? (int) $this->sanitizeData->cleanForPost($data->rooms) : (int) $data->rooms,
            'type'          => $toClean ? $this->sanitizeData->cleanForPost($data->typeBien) : $data->typeBien,
            'floor'         => $toClean ? $this->sanitizeData->cleanForPost($data->floor) : $data->floor,
            'surface'       => $toClean ? (float) $this->sanitizeData->cleanForPost($data->surface) : (float) $data->surface,
            'door'          => $toClean ? $this->sanitizeData->cleanForPost($data->door) : $data->door,
            'building'      => $toClean ? $this->sanitizeData->cleanForPost($data->building) : $data->building,
            'owner'         => $toClean ? $this->sanitizeData->cleanForPost($data->owner) : $data->owner,
            'is_furnished'  => $toClean ? (int) $this->sanitizeData->cleanForPost($data->isFurnished) : (int) $data->isFurnished,
        ];
    }
}