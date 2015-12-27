<?php
/**
 * Created by PhpStorm.
 * User: ermaldo
 * Date: 05.12.15
 * Time: 18:28
 *
 * This subscribe.php file includes the mongo.php file in which an Instance($n), database($db->learningmongo --> change in whatever you like)
 * and a collection($people --> change in whatever you like) of MongoDb are defined/created. Here we have also included the index.html file, which will be the
 * clone of subscribe.php by showing exactly the content of index.html.
 * The subscribe.php  insert the given values from (subscribtion Modal) by the users into the database.
 *
 */

include('mongo.php'); /** path should be adjusted later on the server */
include('../index.html');/** path should be adjusted later on the server */
/** Checking if the name-field is not blank */
if(isset($_POST['name']) && !empty($_POST['name']) AND isset($_POST['email']) && !empty($_POST['email']))
{
        $name  = $_POST['name'];  // Turn our post-name into a local variable
        $email = $_POST['email']; // Turn our post-email into a local variable

        // Generate random 32 character hash for the validation and assign it to a local variable
        $hash    = md5(rand(0,1000));
        // Default value for the activation. If 0, means user has not activated through the link
        // If the link has been clicked once the activation will change to 1
        $active  = "0";
    if(!preg_match("/^([a-zA-z0-9])+([a-zA-Z0-9._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9._-]+)+$/", $email)||empty($name))
    {
        // Return an Error if Mail doe not match. Server side looking
        $msg = "Please fill in the name field and enter a valid name";
    }else{
        // Return success - Valid email and name field not empty
        $msg = "<b>".$name."</b>"." one last step is needed in order to complete your Subscribing. <br/> Please activate your Subscription by clicking the link we have sent to "."<a href='#'>".$email."</a>"." <br/> Thanks to Subscriber";
        try{
            /** if not blank we will insert the given values in the collection */
            $people->insert( array(
                "name"   => $name,
                "email"  => $email,
                "hash"   => $hash,
                "active" => $active
            ));

            // Send the email
            $to          = $email;
            $subject     = "Subscribing for Crawler-Results";
            $messageBody = "<!doctype html><html class='no-js' lang=''>";
            $messageBody .="<head><meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'>";
            $messageBody .="<title>Experimental Study on TLS-Handshakes</title><meta name='description' content=''>";
            $messageBody .="<meta name='viewport' content='width=device-width, initial-scale=1'>";
            $messageBody .= "<link href='../css/bootstrap.min.css' rel='stylesheet'><meta charset='utf-8'>";
            $messageBody .="<meta name='viewport' content='width=device-width, initial-scale=1'>";
            $messageBody .="<link rel='stylesheet' href='http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'>";
            $messageBody .="<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'>";
            $messageBody .="</script><script src='http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js'>";
            $messageBody .="</script></head><body><div class='container'><div class='content-wrapper'>";
            $messageBody .="<h1>Crawling-Results are right on the way to you!</h1><hr>";
            $messageBody .="<p>Tanks for subscribing! We will sent as soon as possible the";
            $messageBody .="Crawling-Results to " .$name. " and " .$email. " </p><hr>";
            $messageBody .="<p>Please click the link to activate your account:";

            /*----------------------------ADJUST THE PATH TO SERVER------------------------------------*/
            $messageBody .="http://localhost/src/php/verify.php?email=$email&hash=$hash"; // You should adjust the Path
            /*----------------------------ADJUST THE PATH TO SERVER------------------------------------*/

            $messageBody .="<br/></p><h1>Last Crawl of alexa top 1 m Websites: YYYY:MM:DD HH:MM:SS</h1></div></div></body></html>";

            /*----------------------------SERVER EMAIL-------------------------------*/
            $headers     = "From: noreplay@hotcat.de" . "\r\n"; // set from headers
            /*----------------------------SERVER EMAIL-------------------------------*/

            $headers     .= "Content-type: text/html; charset=iso-8859-1\n";
            mail($to, $subject, $messageBody, $headers); // Send mail
        }catch(Exception $e){
            echo "Message: ".$e->getMessage();
        }
    }
     /** path should be adjusted later on the server */
    header("Refresh: ../index.html");
}



/** @var  $cursor : dealing with the result. But i am not using it for now. Maybe it would be useful later. */
$cursor = $people->find(); //handling with result

?>


<!-- The modal that will be shown after saving data. This modal contains the count of Subscribers -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
</head>
<body>

<div class="container">
    <!-- Modal -->
    <div class="modal fade" id="subModal" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" onclick="backToHeader()">&times;</button>
                    <h1 class="modal-title">Subscription information</h1>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info>">
                        <h3>
                            <p id="subscribe">
                                <?php
                                    echo $msg;
                                ?>
                                <strong>
                                    <span class="badge">
                                        <?php
                                            echo $cursor->count($_GET['_id']);
                                        ?>
                                    </span>
                                </strong>
                            </p>
                        </h3>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal" onclick="backToHeader()">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    $('#subModal').modal({
        backdrop: 'static',
        keyboard: false
    })
</script>
<script>
    $.ajax({
        url: 'subscribe.php',
        dataType: 'text',
        success: function() {
            $("#subModal").modal();
        }
    });
</script>
<script>
    function backToHeader()
    {
        this.location.href="../index.html";
    }
</script>
<script src="../js/menu.js"></script>
</body>
</html>
