<?php
namespace App\Models;
use \stdClass;

class Widget extends MongoConnection
{
  protected $err;

  public function __construct() {
    parent::__construct('widgets');
    $error = new stdClass();
    $error->errors = [];
    $this->err = $error;
  }

  public function addWidget($params) {
    // Add the widget params to the widgets table
    $params['user'] = $_SESSION['user'];
    $this->addOne($params);

    $widgetObj = $this->getOne($params);
    return $widgetObj;
  }

  public function getWidgets() {
    // Get widgets by userID
    $widgets = $this->getAll([ 'user' =>  $_SESSION['user'] ]);
    return $widgets;
  }

  public function deleteWidget($widgetId) {
    $widget = $this->getOneById($widgetId);
    $this->collection->deleteOne($widget);
    return 'Widget deleted';
  }
}
