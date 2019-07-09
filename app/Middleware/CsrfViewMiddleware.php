<?php

namespace App\Middleware;

class CsrfViewMiddleware extends Middleware
{
  public function __invoke($req, $res, $next) {

    $tokenName = $this->container->csrf->getTokenName();
    $tokenNameKey = $this->container->csrf->getTokenNameKey();
    $tokenValue = $this->container->csrf->getTokenValue();
    $tokenValueKey = $this->container->csrf->getTokenValueKey();

    $this->container->csfr = [
      'field' => "<input type='hidden' name='$tokenNameKey' value='$tokenName'>
                  <input type='hidden' name='$tokenValueKey' value='$tokenValue'>"
    ];

    $this->container->view->getEnvironment()->addGlobal('csrf', $this->container->csfr);

    return $next($req, $res);
  }
}
