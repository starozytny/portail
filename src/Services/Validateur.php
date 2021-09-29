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
            default:
                return $this->validateText($elem['value']);
        }
    }

    private function validateText($value)
    {
        if($value == ""){
            return 'Ce champ doit être renseigné';
        }

        return 1;
    }
}