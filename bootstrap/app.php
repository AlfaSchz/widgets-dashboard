<?php
// Start session
session_start();

// Load dependencies
require __DIR__ . '/../vendor/autoload.php';

// Initialize Slim App
$app = new \Slim\App([
  'settings' => [
    'displayErrorDetails' => true
  ]
]);

// Connect to MongoDB
$client = new MongoDB\Client("mongodb://localhost:27017");
$widgetsDashboardDB = $client->widgetsDashboard;

// Initialize container and properties
$container = $app->getContainer();

$container['db'] = $widgetsDashboardDB;

$container['view'] = function($container) {

  $view = new \Slim\Views\Twig(__DIR__ . '/../resources/views', [
    'cache' => false
  ]);

  $view->addExtension(new \Slim\Views\TwigExtension(
    $container->router,
    $container->request->getUri()
  ));

  return $view;
};

$container['HomeController'] = function ($container) {
  return new \App\Controllers\HomeController($container);
};
$container['WidgetsController'] = function ($container) {
  return new \App\Controllers\WidgetsController($container);
};
$container['AuthController'] = function ($container) {
  return new \App\Controllers\Auth\AuthController($container);
};

$container['csrf'] = function () {
  return new \Slim\Csrf\Guard;
};
$container['auth'] = function ($container) {
  return new \App\Auth\Auth;
};

$app->add(new \App\Middleware\Auth($container));
$app->add(new \App\Middleware\ErrorsMiddleware($container));
$app->add(new \App\Middleware\CsrfViewMiddleware($container));


$app->add($container->csrf);

require __DIR__ . '/../app/routes.php';
