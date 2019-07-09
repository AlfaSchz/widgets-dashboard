<?php

namespace App\Controllers;

use App\Models\Widget;

class WidgetsController extends Controller
{
  public function add($req, $res)
  {

    // Add the widget
    $data = $req->getParams();
    $widgetDB = new Widget;
    $widget = $widgetDB->addWidget($data);

    // Respond to the http request with widget data and new csfr keys
    $widget['cfsr'] = $this->container->csfr;

    return json_encode($widget);
  }

  public function remove($req, $res)
  {
    // Remove the widget
    $data = $req->getParams();
    $widgetDB = new Widget;
    $widgetDB->deleteWidget($data['_id']);

    $csfr = [];
    // Respond to the http request with widget data and new csfr keys
    $csfr['cfsr'] = $this->container->csfr;

    return json_encode($csfr);
  }
}
