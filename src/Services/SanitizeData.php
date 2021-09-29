<?php


namespace App\Services;


class SanitizeData
{
    public function fullClean($value)
    {
        $value = trim($value);
        $value = mb_strtolower($value);
        return str_replace(" ", "", $value);
    }

    public function clean($value): string
    {
        $value = trim($value);
        return htmlspecialchars($value);
    }
}