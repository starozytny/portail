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
        $elements = $this->apiService->callApi('inventories/full/list/' . ($args['status'] == "en-cours" ? 0 : 2));

        $data = [];

        foreach ($elements as $elem) {

            foreach($users as $user){
                if($user->id == $elem->inventory->user_id){
                    $elem->inventory->user = $user;
                }
            }

            $input = $elem->inventory->input;
            if((int) $input < 0){
                foreach($models as $model){
                    if($model->id == abs($input)){
                        $elem->inventory->model = $model;
                    }
                }
            }

            $inventoryDate = $elem->inventory->date;
            if($inventoryDate == "0"){
                if(!isset($data['unknown'])){
                    $data['unknown'] = [ 'unknown' => [$elem] ];
                }else{
                    array_push($data['unknown']['unknown'], $elem);
                }
            }else{
                $year = date('Y', $inventoryDate);
                $month = date('m', $inventoryDate);

                if(!isset($data[$year])){
                    $data[$year] = [ $month => [$elem] ];
                }else{
                    if(!isset($data[$year][$month])){
                        $data[$year][$month] = [$elem];
                    }else{
                        array_push($data[$year][$month], $elem);
                    }
                }
            }
        }

        return $this->twig->render($response, 'app/pages/edl/index.twig', [
            'data' => $data,
            'donnees' => json_encode($data)
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

        $data = [];
        foreach($objs as $obj){
            if($obj->is_imported == "0"){
                array_push($data, $obj);
            }
        }

        return $this->twig->render($response, 'app/pages/property/index.twig', [
            'data' => $data
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

        $data = [];
        foreach($objs as $obj){
            if($obj->is_imported == "0"){
                array_push($data, $obj);
            }
        }

        return $this->twig->render($response, 'app/pages/tenant/index.twig', [
            'data' => $data
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