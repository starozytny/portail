<?php

namespace App\Controller;

use App\Services\ApiService;
use App\Services\SanitizeData;
use App\Services\Validateur;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class PropertyController
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
        $typeBien = $this->sanitizeData->clean($data->typeBien);
        $reference = $this->sanitizeData->clean($data->reference);
        $owner = $this->sanitizeData->clean($data->owner);
        $building = $this->sanitizeData->clean($data->building);
        $addr1 = $this->sanitizeData->clean($data->addr1);
        $addr2 = $this->sanitizeData->clean($data->addr2);
        $addr3 = $this->sanitizeData->clean($data->addr3);
        $surface = $this->sanitizeData->clean($data->surface);
        $room = $this->sanitizeData->clean($data->room);
        $floor = $this->sanitizeData->clean($data->floor);
        $door = $this->sanitizeData->clean($data->door);
        $city = $this->sanitizeData->clean($data->city);
        $zipcode = $this->sanitizeData->clean($data->zipcode);
        $isFurnished = $this->sanitizeData->clean($data->isFurnished);

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
            $response->getBody()->write(json_encode($errors));
            return $response->withStatus(400);
        }

        $dataToSend = [
            'typeBien' => $typeBien,
            'reference' => $reference,
            'owner' => $owner,
            'building' => $building,
            'addr1' => $addr1,
            'addr2' => $addr2,
            'addr3' => $addr3,
            'surface' => $surface,
            'room' => $room,
            'floor' => $floor,
            'door' => $door,
            'city' => $city,
            'zipcode' => $zipcode,
            'isFurnished' => $isFurnished,
        ];

        $properties = $this->apiService->callApi('properties');
        foreach($properties as $property){
            if($property->reference == $reference){
                $response->getBody()->write(json_encode([['name' => 'reference', 'message' => "Ce bien existe déjà."]]));
                return $response->withStatus(400);
            }

            if($property->addr1 == $addr1 && $property->city == $city && $property->zipcode == $city && $property->isFurniture == $isFurniture){
                $response->getBody()->write(json_encode([['name' => 'addr1', 'message' => "Ce bien existe déjà."]]));
                return $response->withStatus(400);
            }
        }

        $response->getBody()->write(json_encode($dataToSend));
        return $response->withStatus(200);
    }
}