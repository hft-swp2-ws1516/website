<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Experimental Study on TLS-Handshakes</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Place favicon.ico in the root directory -->
    <link href="../css/site.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/checkbox.css">
    <!-- Bootstrap -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
</head>
<body>
<!--[if lt IE 8]>
<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade
    your browser</a> to improve your experience.</p>
<![endif]-->

<!-- Add your site or application content here -->

<!-- Use this for the new menuitems. If they are any changes just remember you should change the menu.js file into js-folder
and the menu item will display dynamicly-->
<nav id="nav01" class="navbar navbar-default navbar-fixed-top"></nav>

<div class="container">
    <div class="content-wrapper">

        <?php
        /**
         * Created by PhpStorm.
         * User: ermaldo
         * Date: 13.12.15
         * Time: 21:21
         *
         * Verify.php verifies if the Url was send to the given email and contains
         * email address and the generated hash value matches with those in Mongodb.
         * So the URL contains email and hash values. We are getting and store those
         * in local Fields. Those are $email and $hash as you see below. Than we are looking
         * for subscriber that active is still 0, hash and email are the same that we stored in the database.
         * $hash is a 32 bit character value that is randomly generated.
         *
         */

        // include Mongo-Connection
        include('mongo.php'); // Connect to database
        // look for email and hash are set and are not empty
        if(isset($_GET['email']) && !empty($_GET['email']) AND isset($_GET['hash']) && !empty($_GET['hash']))
        {
            // Verify Data
            $email  = $_GET['email']; // Store email locally
            $hash   = $_GET['hash'];  // Store hash locally

            // Find Query. Looking for Users or subscriber where activation is 0
            $search = $people->find(
                array('$and' => array(
                    array('active' => "0"),
                    array('hash' => $hash),
                    array("email" => $email))
                )
            );

            // looking if we have a match
            $match  = $people->count($search);


            // returns true if we have match
            if($match > 0)
            {
                // The mail address is not a fake one. Activate the account
                $people->update(
                    array("hash" => $hash),
                    array('$set' => array("active" => "1")));
                $mes = "<h1>Your Subscription is successfully verified!</h1>";
            }else{
                $notValid = "<h1>The URL is either invalid or you already";
                $notValid .="have activated your Subscription!</h1>";
                echo $notValid;
            }
        }else{
            $notValid = "<h1>Invalid approach, please use the link that";
            $notValid .="has been send to your email!</h1>";
            echo $notValid;
        }
            echo $mes;
        ?>


    </div>
</div>

<footer id="footer"></footer>
<div id="subscribe"></div>
<script src="../js/menu.js"></script>
<!--
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/{{JQUERY_VERSION}}/jquery.min.js"></script>
 <script>window.jQuery || document.write('<script src="js/vendor/jquery-{{JQUERY_VERSION}}.min.js"><\/script>')</script>
 //Dynamic Menu


 // Google Analytics: change UA-XXXXX-X to be your site's ID.
 <script>
 (function (b, o, i, l, e, r) {
     b.GoogleAnalyticsObject = l;
     b[l] || (b[l] =
         function () {
             (b[l].q = b[l].q || []).push(arguments)
         });
     b[l].l = +new Date;
     e = o.createElement(i);
     r = o.getElementsByTagName(i)[0];
     e.src = 'https://www.google-analytics.com/analytics.js';
     r.parentNode.insertBefore(e, r)
 }(window, document, 'script', 'ga'));
 ga('create', 'UA-XXXXX-X', 'auto');
 ga('send', 'pageview');
 </script>

-->
</body>
</html>

