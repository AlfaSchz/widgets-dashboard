<?php

namespace App\Controllers\Auth;

use App\Controllers\Controller;

use App\Models\User;

class AuthController extends Controller
{
  public function getSignUp($req, $res)
  {
    if (!isset($_SESSION['user'])) {
        return $this->container->view->render($res, 'auth/signup.twig');
    } else {
      return $res->withRedirect($this->container->router->pathFor('home'));
    }

  }

  public function getSignOut($req, $res)
  {
    session_destroy();
    unset($_SESSION['user']);
    unset($_SESSION['widgets']);
    return $res->withRedirect($this->container->router->pathFor('home'));
  }

  public function postSignUp($req, $res)
  {
    $data = $req->getParams();
    $userDB = new User;
    $singUser = $userDB->signUser($data['name'], $data['password']);
    if ($singUser->errors) {
      // handle errors
       $_SESSION['errors'] = $singUser->errors;
      return $res->withRedirect($this->container->router->pathFor('signup'));
    } else {
      return $res->withRedirect($this->container->router->pathFor('home'));
    }
  }

}
