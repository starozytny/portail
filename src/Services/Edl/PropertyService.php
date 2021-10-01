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

    public function extractBienFromFormEdl($from, $bienId, $bienCreate): array
    {
        if($bienCreate != "") {
            $res = $this->extractBienFromJs($bienCreate);
            if($res['code'] == 0){
                return $res;
            }

            $bienId = $res['data'];
        }

        return $this->getPropertyUid($bienId);
    }

    public function extractBienFromJs($bienCreate): array
    {
        $bienCreate = json_decode($bienCreate);
        $res = $this->createProperty($bienCreate);

        if($res['code'] == 0){
            return $res;
        }

        $bienId = null;
        $properties = $this->apiService->callApi('properties');
        foreach($properties as $property){
            if($property->reference == $bienCreate->reference){
                $bienId = $property->id;
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
            'data' => $bienId
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