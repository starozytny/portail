<?php

use Fullpipe\TwigWebpackExtension\WebpackExtension;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Middleware\ErrorMiddleware;
use Selective\BasePath\BasePathMiddleware;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;
use Doctrine\DBAL\Configuration as DoctrineConfiguration;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;
use Twig\Extension\DebugExtension;
use Odan\Session\PhpSession;
use Odan\Session\SessionInterface;
use Odan\Session\SessionMiddleware;

return [
    'settings' => function () {
        return require __DIR__ . '/settings.php';
    },

    SessionInterface::class => function (ContainerInterface $container) {
        $settings = $container->get('settings');
        $session = new PhpSession();
        $session->setOptions((array)$settings['session']);

        return $session;
    },

    SessionMiddleware::class => function (ContainerInterface $container) {
        return new SessionMiddleware($container->get(SessionInterface::class));
    },

    App::class => function (ContainerInterface $container) {
        AppFactory::setContainer($container);

        return AppFactory::create();
    },

    ResponseFactoryInterface::class => function (ContainerInterface $container) {
        return $container->get(App::class)->getResponseFactory();
    },

    ErrorMiddleware::class => function (ContainerInterface $container) {
        $app = $container->get(App::class);
        $settings = $container->get('settings')['error'];

        return new ErrorMiddleware(
            $app->getCallableResolver(),
            $app->getResponseFactory(),
            (bool)$settings['display_error_details'],
            (bool)$settings['log_errors'],
            (bool)$settings['log_error_details']
        );
    },

    BasePathMiddleware::class => function (ContainerInterface $container) {
        return new BasePathMiddleware($container->get(App::class));
    },

    // Twig templates
    Twig::class => function (ContainerInterface $container) {
        $settings = $container->get('settings');
        $twigSettings = $settings['twig'];

        $options = $twigSettings['options'];
        $options['cache'] = $options['cache_enabled'] ? $options['cache_path'] : false;
        $options['debug'] = true;

        $twig = Twig::create($twigSettings['paths'], $options);

        // Add extension here
        $twig->addExtension(new DebugExtension());

        // The path must be absolute.
        // e.g. /var/www/example.com/public
        $publicPath = (string)$settings['public'];

        // Add extensions
        $twig->addExtension(new WebpackExtension(
            // The manifest file.
            $publicPath . '/assets/manifest.json',
            // The public path
            $publicPath
        ));

        $environment = $twig->getEnvironment();
        $environment->addGlobal('session', $_SESSION);

        return $twig;
    },

    TwigMiddleware::class => function (ContainerInterface $container) {
        return TwigMiddleware::createFromContainer(
            $container->get(App::class),
            Twig::class
        );
    },

    Connection::class => function (ContainerInterface $container) {
        $config = new DoctrineConfiguration();
        $connectionParams = $container->get('settings')['db'];

        return DriverManager::getConnection($connectionParams, $config);
    },

    PDO::class => function (ContainerInterface $container) {
        return $container->get(Connection::class)->getWrappedConnection();
    },
];