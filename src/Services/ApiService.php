<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Odan\Session\SessionInterface;
use Psr\Container\ContainerInterface;

class ApiService
{
    private $apiUrl;
    private $settings;
    private $session;

    public function __construct(SessionInterface $session, ContainerInterface $container)
    {
        $settings =  $container->get('settings');

        $this->apiUrl = $settings['api_url'];
        $this->settings = $settings;
        $this->session = $session;
    }

    public function encryption($data)
    {
        $ciphering = $this->settings['ciphering'];
        $iv_length = openssl_cipher_iv_length($ciphering);
        return openssl_encrypt($data, $ciphering, $this->settings['passphrase'], 0,  $this->settings['iv']);
    }

    public function decryption($data=null)
    {
        $ciphering = $this->settings['ciphering'];
        if($data == null){
            $data = $this->session->get('user')[1];
        }

        $iv_length = openssl_cipher_iv_length($ciphering);
        return openssl_decrypt($data, $ciphering, $this->settings['passphrase'], 0,  $this->settings['iv']);
    }

    public function connect($username, $password)
    {
        $client = new Client();

        try {
            $response = $client->get($this->apiUrl . 'login_data' , ['auth' =>  [$username, $password]]);
            $data = json_decode($response->getBody());
            return $data->user;
        } catch (GuzzleException $e){
            return false;
        }
    }

    public function callApi($path)
    {
        $client = new Client();

        $username = $this->session->get('user')[0];
        $password = $this->decryption();

        try {
            $response = $client->get($this->apiUrl . $path , ['auth' =>  [$username, $password]]);
            return json_decode($response->getBody());
        } catch (GuzzleException $e){
            return false;
        }
    }

    public function callApiWithoutAuth($path)
    {
        $client = new Client();

        try {
            $response = $client->get($this->apiUrl . $path);
            return $response->getBody();
        } catch (GuzzleException $e){
            return false;
        }
    }
}