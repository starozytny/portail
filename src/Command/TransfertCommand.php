<?php

namespace App\Command;

use App\Repository\OldRepository;
use App\Services\ApiService;
use App\Services\Edl\PropertyService;
use App\Services\Edl\TenantService;
use App\Services\SanitizeData;
use Doctrine\DBAL\Exception;
use Faker\Factory;
use Odan\Session\SessionInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

final class TransfertCommand extends Command
{
    private $oldRepository;
    private $propertyService;
    private $sanitizeData;
    private $tenantService;
    private $apiService;
    private $session;

    public function __construct(ApiService    $apiService, SessionInterface $session, SanitizeData $sanitizeData,
                                OldRepository $oldRepository, PropertyService $propertyService, TenantService $tenantService) {
        parent::__construct(null);

        $this->oldRepository = $oldRepository;
        $this->propertyService = $propertyService;
        $this->sanitizeData = $sanitizeData;
        $this->tenantService = $tenantService;
        $this->apiService = $apiService;
        $this->session = $session;
    }

    protected function configure(): void
    {
        parent::configure();

        $this->setName('transfert');
        $this->setDescription('Transfert old data to api db');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        if($this->connect()){
            $output->writeln('<info>Transfert des données</info>');

//            $this->createProperty();
//            $this->createTenants();
            $this->createInventory();
        }

        return 0;
    }

    protected function connect(): bool
    {
        $username = "998A8080";
        $password = "chanbora";

        $userData = $this->apiService->connect($username, $password);
        if(($userData != false)) {
            $user = [
                $username,
                $this->apiService->encryption($password),
                $userData->first_name,
                $userData->last_name,
                $userData->society_data->credits,
                $userData->email,
                $userData->user_tag,
                $userData->id,
                $userData->society_data->num_society,
                $userData->rights
            ];

//            $this->session->destroy();
//            $this->session->start();
//            $this->session->regenerateId();

            $this->session->set('user', $user);

            return true;
        }

        return false;
    }

    /**
     * @throws Exception
     * @throws \Doctrine\DBAL\Driver\Exception
     */
    private function createProperty()
    {
        $properties = $this->oldRepository->findAllProperties();

        $i = 0;
        foreach($properties as $property){
            if($i < 100){
                $data = json_decode(json_encode($property));

                $bien = $this->getDataBien($data);

                $this->propertyService->extractBienFromJs(json_encode($bien));
            }

            $i++;
        }
    }

    private function getDataBien($data): array
    {
        return [
            'reference'     => substr($data->reference, 0, 9),
            'addr1'         => $this->sanitizeData->cleanForPost($data->addr1),
            'addr2'         => $this->sanitizeData->cleanForPost($data->addr2),
            'addr3'         => $this->sanitizeData->cleanForPost($data->addr3),
            'zipcode'       => $this->sanitizeData->cleanForPost($data->zipcode),
            'city'          => $this->sanitizeData->cleanForPost($data->city),
            'rooms'         => (int) $data->rooms,
            'typeBien'      => $this->sanitizeData->cleanForPost($data->type),
            'floor'         => $this->sanitizeData->cleanForPost($data->floor),
            'surface'       => (float) $data->surface,
            'door'          => "",
            'building'      => "",
            'owner'         => $this->sanitizeData->cleanForPost($data->owner),
            'isFurnished'   => (int) $data->is_furnished,
        ];
    }

    private function createTenants()
    {
        $faker = Factory::create('fr_FR');
        $data = [];
        for($i = 0 ; $i < 100 ; $i++){
            $item = [
                'reference'     => 'TE' . $i,
                'addr1'         => $faker->streetAddress,
                'addr2'         => $faker->secondaryAddress,
                'addr3'         => "",
                'zipcode'       => $faker->postcode,
                'city'          => $faker->city,
                'last_name'     => $faker->lastName,
                'first_name'    => $faker->firstName,
                'phone'         => $faker->phoneNumber,
                'email'         => $faker->email,
            ];

            array_push($data, json_encode($item));
        }

        $data = implode("#", $data);
        $this->tenantService->extractTenantsFromFormEdl("", $data);
    }

    /**
     * @throws \Doctrine\DBAL\Driver\Exception
     * @throws Exception
     */
    private function createInventory()
    {
        $objs = $this->oldRepository->findAllInventories();

        $i = 0;
        foreach($objs as $obj){
            if($i < 100){
                $data = json_decode(json_encode($obj));
                $property = $this->oldRepository->findOneByUidProperty($data->property_uid);
                $property = json_decode(json_encode($property));
                $bien = $this->getDataBien($property);
                $this->propertyService->extractBienFromJs(json_encode($bien));

                $uid = null;
                $properties = $this->apiService->callApi('properties');
                foreach($properties as $p){
                    if($p->reference == $property->reference){
                        $uid = $p->uid;
                    }
                }

                if($uid){
                    $item = [
                        'uid'           => $data->uid,
                        'property_uid'  => $uid,
                        'date'          => $data->start_date,
                        'type'          => $data->type,
                        'tenants'       => '["TE4"]',
                        'user_id'       => 5,
                        'input'         => 0
                    ];

                    $this->apiService->callApiWithErrors('add_inventory/', "POST", false, $item);

                    $i++;
                }
            }
        }
    }
}