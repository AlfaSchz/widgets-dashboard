<?php

namespace App\Middleware;
use App\Models\User;

class Auth extends Middleware
{
  public function __invoke($req, $res, $next) {

    if (isset($_SESSION['user'])) {
        $userDB = new User;
        $user = $userDB->getOne([ '_id' => $_SESSION['user'] ]);
        $this->container->view->getEnvironment()->addGlobal('user', $user);
    }

    return $next($req, $res);
  }
}
