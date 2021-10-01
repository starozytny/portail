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

    public function createProperty($data)
    {
        $obj = $this->apiService->callApi('add_property', 'POST', false, [
            'reference' => $data->reference,
            'addr1' => $data->addr1,
            'addr2' => $data->addr2,
            'addr3' => $data->addr3,
            'zipcode' => $data->zipcode,
            'city' => $data->city,
            'rooms' => $data->room,
            'type' => $data->typeBien,
            'floor' => $data->floor,
            'surface' => $data->surface,
            'door' => $data->door,
            'building' => $data->building,
            'owner' => $data->owner,
            'is_furnished' => $data->isFurnished,
        ]);

        return $obj;
    }
}