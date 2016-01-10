<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Experimental Study on TLS-Handshakes</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="../css/forSubAndUnsubscribe.css" rel="stylesheet">
</head>
<body>
<!--[if lt IE 8]>
<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade
    your browser</a> to improve your experience.</p>
<![endif]-->


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
        if(isset($_GET['email']) && !empty($_GET['email']) AND isset($_GET['hash_subscribe']) && !empty($_GET['hash_subscribe']))
        {
            // Verify Data
            $email  = $_GET['email']; // Store email locally
            $hash_subscribe   = $_GET['hash_subscribe'];  // Store hash locally

            /**
             * Try to get connection to MongoDb. If there is no connection we will throw the MongoException
             */
            try{
                $connect = $n->selectDB("learningmongo");
                $people = $connect->selectCollection("people");
            }catch(MongoConnectionException $e){
                die("Problem during mongodb initialization. Please start mongodb server." . $e->getMessage());
            }

            /**
             * The query below is comparable with the sql query as follow : "SELECT email, hash_subscribe, active
             * FROM collection-name WHERE email = $email AND hash_subscribe = $hash_subscribe AND active = 0"
             */
            $where = array(
                '$and' => array(
                    array(  'email'             =>    $email            ),
                    array(  'hash_subscribe'    =>    $hash_subscribe   ),
                    array(  'active'            =>    '0'               )
                )
            );

            try{
                $search = $people->find($where);
            }catch(MongoCursorException $e){
                die("Could not aggregate over the Documents. For more information see ". $e->getMessage());
            }

            /**
             * Use $match to search for the one and only document that correspond
             * with hash_subscribe = $hash_subscribe and active = 0
             */
            $match  = $people->count(array('active' => '0'), array('hash_subscribe' => $hash_subscribe));

            // returns true if we have match
            if($match > 0)
            {
                // The mail address is not a fake one. Activate the account
                $people->update(
                    array("hash_subscribe" => $hash_subscribe),
                    array('$set' => array("active" => "1")));
                $mes = "<h3>Your Subscription is successfully verified! As soon as possible we will send the data<br> to ";
                $mes .= "<a href='#'>".$email."</a> . If you like you can directly navigate to our Website by<br> ";
                $mes .= "clicking the <p style='background: #ffb81c''>GO TO HOTCAT</p> Link or colse the current Tab by clicking the ";
                $mes .= "<p style='background: #ffb81c'>CLOSE THE TAB</p> below!<h3>";
            }else{
                $mes = "<h3>The URL is either invalid or you already ";
                $mes .="have activated your Subscription!</h3>";
            }
        }else{
            $mes = "<h3>Invalid approach, please use the link that ";
            $mes .="has been send to your email!</h3>";
        }
        ?>
        <pre>
        <div id="wrap">

        <!-- Displaying the corresponding message -->
        <?php
            if(isset($mes))
            {
                echo "<div class='statusmsg'>".$mes."</div>";
            }
        ?>

<a href="../index.html" id="go-to-index">GO TO HOTCAT</a>  <a href="javascript:close_window();">CLOSE THE TAB</a>
        </div>
        </pre>
    <!-- end wrap div -->

    </div>
</div>
<script>
    function close_window(){
        if(confirm("Close Window?")){
            close();
        }
    }
</script>
</body>
</html>

