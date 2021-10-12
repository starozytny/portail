<?php

namespace App\Services\Edl;

use App\Services\ApiService;
use App\Services\SanitizeData;
use App\Services\Validateur;

class ElementService
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
        $name       = $this->sanitizeData->clean($data->name);
        $category   = $this->sanitizeData->clean($data->category);
        $family     = $this->sanitizeData->clean($data->family);
        $gender     = $this->sanitizeData->clean($data->gender);
        $orthog     = $this->sanitizeData->clean($data->orthog);
        $variants   = $data->variants;

        // validation des données
        $paramsToValidate = [
            ['type' => 'text',   'name' => 'name',     'value' => $name],
            ['type' => 'text',   'name' => 'category', 'value' => $category],
            ['type' => 'text',   'name' => 'family',   'value' => $family],
            ['type' => 'text',   'name' => 'gender',   'value' => $gender],
            ['type' => 'text',   'name' => 'orthog',   'value' => $orthog],
            ['type' => 'length', 'name' => 'name',     'value' => $name,      'min' => 0, 'max' => 40],
        ];
        $errors = $this->validateur->validate($paramsToValidate);
        if(count($errors) > 0){
            return [ 'code' => 0, 'data' => json_encode($errors) ];
        }

        $errors = $this->notExiste($id, $name);
        if($errors['code'] == 0){
            return [ 'code' => 0, 'data' => json_encode($errors['data']) ];
        }

        $gender = $gender == 0 ? "m" : "f";
        $gender = $gender . (($orthog == 0) ? "" : "p");

        return [
            'code' => 1,
            'data' => [
                'name'      => $name,
                'category'  => $category,
                'family'    => $family,
                'gender'    => $gender,
                'variants'  => $variants,
            ]
        ];
    }

    private function notExiste($id, $name): array
    {
        $objs = $this->apiService->callApi('library');
        foreach($objs->elements as $obj){
            if($obj->id != $id) {
                if (mb_strtolower($obj->name) == mb_strtolower($name)) {
                    return ['code' => 0, 'data' => [['name' => 'name', 'message' => "Cet élément existe déjà."]]];
                }
            }
        }

        return ['code' => 1];
    }

    public function createElement($json): array
    {
        $obj = json_decode($json);
        $id = null;
        $res = $this->apiService->callApiWithErrors('library/add_element', 'POST', false, $this->getDataToSend($obj));
        if($res['code'] == 0){
            return $res;
        }

        //get id created
        $objs = $this->apiService->callApi('library');
        foreach($objs->elements as $elem){
            if($elem->name == $obj->name){
                $id = $elem->id;
            }
        }

        if(!$id){
            return [
                'code' => 0,
                'data' => "[SERVICEEL001] Une erreur est survenu. Veuillez contacter le support."
            ];
        }

        return [
            'code' => 1,
            'data' => $id,
        ];
    }

    public function updateElement($data, $id): array
    {
        $obj = json_decode($data);
        return $this->apiService->callApiWithErrors('library/edit_element/' . $id, 'POST', false, $this->getDataToSend($obj));
    }

    private function getDataToSend($data): array
    {
        return [
            'name'          => $data->name,
            'category'      => (int) $data->category,
            'family'        => (int) $data->family,
            'gender'        => $data->gender,
            'variants'      => "",
        ];
    }
}