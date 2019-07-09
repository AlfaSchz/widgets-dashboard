<?php

namespace App\Controllers;

use App\Models\User;
use App\Models\Widget;

class HomeController extends Controller
{
  public function index($req, $res)
  {

    if (!$_SESSION['user']) return $res->withRedirect($this->container->router->pathFor('signup'));

    // Get user widgets dashboard
    $userDB = new User;
    $user = $userDB->getOne([ '_id' =>  $_SESSION['user'] ]);

    $widgetDB = new Widget;
    $widgets = $widgetDB->getWidgets();

    $this->container->view->getEnvironment()->addGlobal('widgets', json_encode($widgets));

    return $this->container->view->render($res, 'home.twig');
  }
}
