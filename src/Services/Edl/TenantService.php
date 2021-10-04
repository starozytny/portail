<?php

namespace App\Services\Edl;

use App\Services\ApiService;

class TenantService
{
    private $apiService;

    public function __construct(ApiService $apiService)
    {

        $this->apiService = $apiService;
    }

    public function extractTenantsFromFormEdl($tenants, $tenantsCreate): array
    {
        $allTenants = $this->apiService->callApi('tenants');

        $tenantsArray = [];
        if($tenantsCreate != ""){
            $tenants = explode('#', $tenants);

            $fail = false; $failsReturn = null;
            foreach($tenants as $tenantObject){
                if(!$fail){

                    $obj = json_decode($tenantObject);

                    $alreadyCreated = false;
                    foreach($allTenants as $oriTenant){
                        if($oriTenant->reference == $obj->reference){
                            $alreadyCreated = true;
                        }
                    }

                    if(!$alreadyCreated){
                        $res = $this->createTenant($obj);

                        if($res['code'] == 0){
                            $fail = true;
                            $failsReturn = $res;
                        }else{
                            array_push($tenantsArray, $obj->reference);
                        }
                    }else{
                        array_push($tenantsArray, $obj->reference);
                    }
                }
            }

            if($fail){
                $this->deleteTenantFromArrayReference($tenantsArray);

                return $failsReturn;
            }
        }
        if($tenants != ""){
            $tenants = explode(',', $tenants);
            foreach($tenants as $tenantId){
                foreach($allTenants as $oriTenant){
                    if($oriTenant->id == $tenantId){
                        array_push($tenantsArray, $oriTenant->reference);
                    }
                }
            }
        }

        return [
            'code' => 1,
            'data' => $tenantsArray
        ];
    }

    public function deleteTenantFromArrayReference($references)
    {
        $tenants = $this->apiService->callApi('tenants');
        $toDelete = [];
        foreach($references as $reference){
            foreach($tenants as $tenant){
                if($tenant->reference == $reference){
                    array_push($toDelete, $tenant->id);
                }
            }
        }

        foreach($toDelete as $item){
            $this->apiService->callApi('delete_tenant/' . $item);
        }
    }

    public function createTenant($data): array
    {
        return $this->apiService->callApiWithErrors('add_tenant', 'POST', false, [
            'reference'     => $data->reference,
            'last_name'     => $data->last_name,
            'first_name'    => $data->first_name,
            'phone'         => $data->phone,
            'email'         => $data->email,
            'addr1'         => $data->addr1,
            'addr2'         => $data->addr2,
            'addr3'         => $data->addr3,
            'zipcode'       => $data->zipcode,
            'city'          => $data->city,
        ]);
    }
}