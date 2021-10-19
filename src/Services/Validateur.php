<?php

namespace App\Services;

class Validateur
{
    public function validate($data): array
    {
        $errors = [];
        foreach($data as $elem){
            $validate = $this->switchCase($elem);
            if($validate != 1){
                array_push($errors, [
                    'name' => $elem['name'],
                    'message' => $validate
                ]);
            }
        }

        return $errors;
    }

    private function switchCase($elem)
    {
        switch ($elem['type']){
            case 'array':
                return $this->validateArray($elem['value']);
            case 'length':
                return $this->validateLength($elem['value'], $elem['min'], $elem['max']);
            default:
                return $this->validateText($elem['value']);
        }
    }

    private function validateArray($value)
    {
        if(count($value) <= 0){
            return 'Ce champ doit être renseigné.';
        }

        return 1;
    }

    private function validateLength($value, $min, $max)
    {
        if(strlen($value) < $min || strlen($value) > $max){
            return 'Ce champ doit contenir entre ' . $min . ' et ' . $max . ' caractères.';
        }

        return 1;
    }

    private function validateText($value)
    {
        if($value == ""){
            return 'Ce champ doit être renseigné';
        }

        return 1;
    }
}