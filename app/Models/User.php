<?php

namespace App\Models;
use \stdClass;

class User extends MongoConnection
{
  protected $err;

  public function __construct() {
    parent::__construct('users');
    $error = new stdClass();
    $error->errors = [];
    $this->err = $error;
  }

  public function signUser($name, $password) {
    $userObj = $this->getOne([ 'name' => $name ]);
    // If user exists try to log in
    if ($userObj) {
      return $this->logIn($userObj, $password);
    // Else try to add  user
    } else {
      return $this->addUser($name, $password);
    }
  }

  public function addUser($name, $password) {
    if (!$name) $this->err->errors['name'] = 'Name must not be empty';
    if (strlen($password) < 4) $this->err->errors['password'] = 'Password must be 4 charcters or more, it is easy...';
    if ($this->err->errors) return $this->err;
    $this->addOne([ 'name' => $name, 'hash' => $this->hash($password)]);
    $userObj = $this->getOne([ 'name' => $name ]);
    return $this->logIn($userObj, $password);
  }

  public function logIn($userObj, $password) {
    if (password_verify($password, $userObj->hash)) {
      return $_SESSION['user'] = $userObj->_id;
    } else {
      $this->err->errors['password'] = 'Wrong password. There is no recovery pasword but you can create a new user...';
      return $this->err;
    }
  }

  public static function hash($password) {
    return password_hash($password, PASSWORD_BCRYPT);
  }

}
