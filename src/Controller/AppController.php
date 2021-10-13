<?php

namespace App\Controller;

use App\Services\ApiService;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class AppController
{
    private $twig;
    private $apiService;
    private $container;

    public function __construct(ContainerInterface $container, Twig $twig, ApiService $apiService)
    {
        $this->twig = $twig;
        $this->apiService = $apiService;
        $this->container = $container;
    }

    public function homepage(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = $this->apiService->callApi('inventories/full/list/0');

        return $this->twig->render($response, 'app/pages/index.twig', [
            'data' => json_encode($data)
        ]);
    }

    public function mentions(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->twig->render($response, 'app/pages/legales/mentions.twig');
    }

    public function politique(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->twig->render($response, 'app/pages/legales/politique.twig');
    }

    public function cookies(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->twig->render($response, 'app/pages/legales/cookies.twig');
    }

    /**
     * Route liste des états des lieux
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function edl(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $users    = $this->apiService->callApi('users');
        $models    = $this->apiService->callApi('models');
        $properties    = $this->apiService->callApi('properties');
        $tenants    = $this->apiService->callApi('tenants');
        $elements = $this->apiService->callApi('inventories/list/' . ($args['status'] == "en-cours" ? 0 : 2));

        $data = [];

        foreach ($elements as $elem) {

            $element = [
                'inventory' => "",
                'property' => "",
                'tenants' => ""
            ];

            $element = json_encode($element);
            $element = json_decode($element);

            $element->inventory = $elem;

            foreach($users as $user){
                if($user->id == $elem->user_id){
                    $element->inventory->user = $user;
                }
            }

            foreach($properties as $property){
                if($elem->property_uid == $property->uid){
                    $element->property = $property;
                }
            }

            $element->tenants = [];
            foreach(json_decode($elem->tenants) as $reference){
                foreach($tenants as $tenant){
                    if($reference == $tenant->reference){
                        array_push($element->tenants, $tenant);
                    }
                }
            }

            $input = $elem->input;
            if((int) $input < 0){
                foreach($models as $model){
                    if($model->id == abs($input)){
                        $element->inventory->model = $model;
                    }
                }
            }

            $inventoryDate = $elem->date;
            if($inventoryDate == "0"){
                if(!isset($data['unknown'])){
                    $data['unknown'] = [ 'unknown' => [$element] ];
                }else{
                    array_push($data['unknown']['unknown'], $element);
                }
            }else{
                $year = date('Y', $inventoryDate);
                $month = date('m', $inventoryDate);

                if(!isset($data[$year])){
                    $data[$year] = [ $month => [$element] ];
                }else{
                    if(!isset($data[$year][$month])){
                        $data[$year][$month] = [$element];
                    }else{
                        array_push($data[$year][$month], $element);
                    }
                }
            }
        }

        return $this->twig->render($response, 'app/pages/edl/index.twig', [
            'data' => $data
        ]);
    }

    /**
     * Route pour mon compte
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function user(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = $this->apiService->callApi('users');

        return $this->twig->render($response, 'app/pages/user/index.twig', [
            'data' => $data
        ]);
    }

    /**
     * Route pour la documentation pdf
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     */
    public function documentation(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response = $response->withHeader('Content-Type', 'application/pdf');
        $response = $response->withHeader('Content-Disposition', sprintf('inline; filename="%s"', "documentation.pdf"));

        $stream = fopen($this->container->get('settings')['root'] . '/documents/documentation.pdf', 'r');
        $response->getBody()->write(fread($stream, (int)fstat($stream)['size']));
        return $response;
    }

    /**
     * Route pour la liste des biens
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function property(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $objs = $this->apiService->callApi('properties');
        $inventories = $this->apiService->callApi('inventories/list');
        return $this->twig->render($response, 'app/pages/property/index.twig', [
            'data' => $objs,
            'inventories' => $inventories
        ]);
    }

    /**
     * Route pour la liste des locataires
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array $args
     * @return ResponseInterface
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function tenant(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $objs = $this->apiService->callApi('tenants');
        $inventories = $this->apiService->callApi('inventories/list');
        return $this->twig->render($response, 'app/pages/tenant/index.twig', [
            'data' => $objs,
            'inventories' => $inventories
        ]);
    }

    public function bibli(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $objs = $this->apiService->callApi('library');
        return $this->twig->render($response, 'app/pages/bibli/index.twig', [
            'data' => $objs
        ]);
    }
}