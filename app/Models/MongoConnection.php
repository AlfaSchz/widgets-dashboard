<?php

namespace App\Models;

use MongoDB\Client as MongoDB;
use MongoDB\BSON\ObjectId as ObjectId;

class MongoConnection
{
  protected $widgetsDashboardDB;
  protected $collection;

  public function __construct($collection) {
    $client = new MongoDB("mongodb://localhost:27017");
    $this->widgetsDashboardDB = $client->widgetsDashboard;
    $this->collection = $this->widgetsDashboardDB->{$collection};
  }

  public function addOne($data) {
    $sanitizedData = [];
    foreach ($data as $cname => $cvalue) {
        if ($cname !== 'csrf_name' && $cname !== 'csrf_value') $sanitizedData[$cname] =$cvalue;
    }
    $this->collection->insertOne( $sanitizedData );
  }

  public function getOne($data) {
    $sanitizedData = [];
    foreach ($data as $cname => $cvalue) {
        if ($cname !== 'csrf_name' && $cname !== 'csrf_value') $sanitizedData[$cname] =$cvalue;
    }
    return $this->collection->findOne($sanitizedData);
  }

  public function getOneById($id) {
    return $this->collection->findOne(['_id'=> new ObjectId($id)]);
  }

  public function getAll($data) {
    return $this->collection->find($data)->toArray();
  }
}
