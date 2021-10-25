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
        $value = str_replace('#', '-', $value);
        return htmlspecialchars($value);
    }

    public function cleanForPost($value): string
    {
        $value = trim($value);
        $value = addslashes($value);
        return str_replace('#', '-', $value);
    }

    public function toFormatPhone($value): string
    {
        $value = trim($value);
        $value = str_replace(' ', '.', $value);
        return htmlspecialchars($value);
    }
}