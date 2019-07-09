<?php

$app->get('/', 'HomeController:index')->setName('home');
$app->get('/signup', 'AuthController:getSignUp')->setName('signup');
$app->post('/signup', 'AuthController:postSignUp');
$app->get('/signout', 'AuthController:getSignOut')->setName('signout');
$app->post('/widgets', 'WidgetsController:add');
$app->post('/widget-remove', 'WidgetsController:remove');
