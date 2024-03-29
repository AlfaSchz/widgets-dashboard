<?php

namespace App\Middleware;

class ErrorsMiddleware extends Middleware
{
  public function __invoke($req, $res, $next) {

    if (isset($_SESSION['errors'])) {
        $this->container->view->getEnvironment()->addGlobal('errors', $_SESSION['errors']);
        unset($_SESSION['errors']);
    }

    return $next($req, $res);
  }
}
