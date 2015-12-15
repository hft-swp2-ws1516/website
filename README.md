# Setup

## Run on a Apache Webserver (Ubuntu)

Install Apache Webserver with
```
$ apt-get update
$ apt-get install apache2
```

Create a new directory: */var/www/hotcat* and run:

```
$ cd /var/www/hotcat
$ git clone https://github.com/hft-swp2-ws1516/website.git
$ cd /var/www/hotcat/website/
```

### Install npm & gulp

To install [npm](https://www.npmjs.com/) run

```
$ apt-get install npm 
```

This Projekt was created with Webstorm. It uses [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) to build assets from src into dist.

```
$ npm install --global gulp
$ npm install
```

If you have Gulp installed, you can run gulp build in your website directory.

``` 
$ gulp build
```

Open localhost/hotcat/website/dist and you should see the website.

Now you could change the root directory in the config */etc/apache2/sites-enabled/yourconfig.conf and add a reference to the dist folder


