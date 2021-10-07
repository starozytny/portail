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

    public function validateData($data): array
    {
        $typeBien       = $this->sanitizeData->clean($data->typeBien);
        $reference      = $this->sanitizeData->clean($data->reference);
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
            ['type' => 'text', 'name' => 'reference',    'value' => $reference],
            ['type' => 'text', 'name' => 'addr1',        'value' => $addr1],
            ['type' => 'text', 'name' => 'city',         'value' => $city],
            ['type' => 'text', 'name' => 'zipcode',      'value' => $zipcode],
            ['type' => 'length', 'min' => 0, 'max' => 10, 'id' => 'reference',  'value'=> $reference],
            ['type' => 'length', 'min' => 0, 'max' => 64, 'id' => 'addr1',      'value'=> $addr1],
            ['type' => 'length', 'min' => 0, 'max' => 64, 'id' => 'addr2',      'value'=> $addr2],
            ['type' => 'length', 'min' => 0, 'max' => 64, 'id' => 'addr2',      'value'=> $addr2],
            ['type' => 'length', 'min' => 0, 'max' => 10, 'id' => 'zipcode',    'value'=> $zipcode],
            ['type' => 'length', 'min' => 0, 'max' => 64, 'id' => 'city',       'value'=> $city],
            ['type' => 'length', 'min' => 0, 'max' => 20, 'id' => 'door',       'value'=> $door],
            ['type' => 'length', 'min' => 0, 'max' => 20, 'id' => 'floor',      'value'=> $floor],
            ['type' => 'length', 'min' => 0, 'max' => 20, 'id' => 'typeBien',   'value'=> $typeBien],
            ['type' => 'length', 'min' => 0, 'max' => 40, 'id' => 'building',   'value'=> $building],
            ['type' => 'length', 'min' => 0, 'max' => 32, 'id' => 'owner',      'value'=> $owner],
        ];
        $errors = $this->validateur->validate($paramsToValidate);
        if(count($errors) > 0){
            return [ 'code' => 0, 'data' => json_encode($errors) ];
        }

        $properties = $this->apiService->callApi('properties');
        foreach($properties as $property){
            if($property->reference == $reference){
                return [ 'code' => 0, 'data' => json_encode([['name' => 'reference', 'message' => "Ce bien existe déjà."]]) ];
            }

            if($property->addr1 == $addr1 && $property->city == $city && $property->zipcode == $city && $property->is_furnished == $isFurnished){
                return [ 'code' => 0, 'data' => json_encode([['name' => 'addr1', 'message' => "Ce bien existe déjà."]]) ];
            }
        }

        return [
            'code' => 1,
            'data' => [
                'typeBien' => $typeBien,
                'reference' => $reference,
                'owner' => $owner,
                'building' => $building,
                'addr1' => $addr1,
                'addr2' => $addr2,
                'addr3' => $addr3,
                'surface' => $surface,
                'rooms' => $rooms,
                'floor' => $floor,
                'door' => $door,
                'city' => $city,
                'zipcode' => $zipcode,
                'isFurnished' => $isFurnished
            ]
        ];
    }

    public function extractBienFromFormEdl($bienId, $bienCreate): array
    {
        if($bienCreate != "") {
            $res = $this->extractBienFromJs($bienCreate);
            if($res['code'] == 0){
                return $res;
            }

            $bienId = $res['data'];
            $lastInventoryUid = ['lastInventoryUid' => $res['lastInventoryUid']];
        }else{
            $property = $this->apiService->callApi('properties/' . $bienId);
            $lastInventoryUid = ['lastInventoryUid' => $property->last_inventory_uid];
        }

        return array_merge($this->getPropertyUid($bienId), $lastInventoryUid);
    }

    public function extractBienFromJs($bienCreate): array
    {
        $bienCreate = json_decode($bienCreate);

        $bienId = null; $alreadyCreated = false; $lastInventoryUid = null;
        $properties = $this->apiService->callApi('properties');
        foreach($properties as $property){
            if($property->reference == $bienCreate->reference){
                $bienId = $property->id;
                $alreadyCreated = true;
            }
        }

        if(!$alreadyCreated){
            $res = $this->createProperty($bienCreate);
            if($res['code'] == 0){
                return $res;
            }

            //get id created
            $properties = $this->apiService->callApi('properties');
            foreach($properties as $property){
                if($property->reference == $bienCreate->reference){
                    $bienId = $property->id;
                    $lastInventoryUid = $property->last_inventory_uid;
                }
            }
        }

        if(!$bienId){
            return [
                'code' => 0,
                'message' => "[SERVICEPE001] Une erreur est survenu. Veuillez contacter le support."
            ];
        }

        return [
            'code' => 1,
            'data' => $bienId,
            'lastInventoryUid' => $lastInventoryUid
        ];
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

    private function createProperty($data): array
    {
        return $this->apiService->callApiWithErrors('add_property', 'POST', false, [
            'reference'     => $data->reference,
            'addr1'         => $data->addr1,
            'addr2'         => $data->addr2,
            'addr3'         => $data->addr3,
            'zipcode'       => $data->zipcode,
            'city'          => $data->city,
            'rooms'         => (int) $data->rooms,
            'type'          => $data->typeBien,
            'floor'         => $data->floor,
            'surface'       => (float) $data->surface,
            'door'          => $data->door,
            'building'      => $data->building,
            'owner'         => $data->owner,
            'is_furnished'  => (int) $data->isFurnished,
        ]);
    }
}