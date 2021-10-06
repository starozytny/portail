<?php

namespace App\Services\Edl;

use App\Services\ApiService;

class PropertyService
{
    private $apiService;

    public function __construct(ApiService $apiService)
    {

        $this->apiService = $apiService;
    }

    public function extractBienFromFormEdl($bienId, $bienCreate): array
    {
        $lastInventoryUid = ['lastInventoryUid' => null];
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
            'rooms'         => $data->room,
            'type'          => $data->typeBien,
            'floor'         => $data->floor,
            'surface'       => $data->surface,
            'door'          => $data->door,
            'building'      => $data->building,
            'owner'         => $data->owner,
            'is_furnished'  => $data->isFurnished,
        ]);
    }
}