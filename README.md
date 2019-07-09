# Widget Dashboard

Simple customizable widgets dashboard demo application. Powered by Slim Framework, Twig, MongoDB and Vue.

## Installation and dependencies

Download repo
```
$ git clone
$ cd widgets-dashboard
```

Install [Composer](https://getcomposer.org/download/) (you can also use a local installation)
```
$ sudo apt-get install composer
```

Install [php driver for MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
```
$ sudo pecl install mongodb
```
Remember to enable `extension=mongodb.so` in the necessary php.ini files (hint on how to use [MongoDB with Apache/PHP](https://stackoverflow.com/questions/35908380/composer-does-not-install-mongodb-ubuntu#36022900)).

Start mongodb
```
$ systemctl start mongod.service
```

## Database

Login into the [MongoDB shell](https://docs.mongodb.com/manual/mongo/).
```
$ mongo
```


Create the Database:

```
> use widgetsDashboard;
```

Create the collections:

```
> db.createCollection('users');
> db.createCollection('widgets');
```

Set your webserver to point to:
```
...path-to-your/widget-dashboard/public/
```
