<?php
/**
 * Created by PhpStorm.
 * User: ermaldo
 * Date: 10.01.16
 * Time: 21:13
 */


/*********************************************************************************************************************
 *                                                                                                                   *
 *                      The array below [$codes] can be extended if they are any needs                               *
 *                                                                                                                   *
 *********************************************************************************************************************/
$status = $_SERVER['REDIRECT_STATUS'];
$codes = array(
    403 => array('403 Forbidden', 'You are not authorized to access this file.'),
    404 => array('404 File Not Found', 'The document/file requested was not found on this server.'),
    405 => array('405 Method Not Allowed', 'The method specified in the Request-Line is not allowed for the specified resource.'),
    408 => array('408 Request Timeout', 'The browser failed to send a request in the time allowed by the server.'),
    500 => array('500 Internal Server Error', 'Your request could not be proceeded because of an internal server error.'),
    502 => array('502 Bad Gateway', 'The server received aan invalid response.'),
    504 => array('504 Bad Gateway Timeout', 'The upstream server failed to send a request in the time allowed by the server.'),
);

$title   = $codes[$status][0];
$message = $codes[$status][1];

if($title == false || strlen($status) != 3)
{
    $title   = 'Unrecognized Status Code';
    $message = 'The website returned an unrecognised status code';
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title><?php echo $title; ?></title>
    <style>
        html, body{
            font-size: 100%;
        }

        body{
            font-family: Arial, sans-serif;
            background: #f7f7f7;
            margin: 0;
            padding: 0;
        }

        #content{
            box-sizing: border-box;
            max-width: 100%;
            width: 800px;
            margin: 50px auto;
            padding: 50px;
            background: #fff;
        }

        h1{
            margin-top: 0;
        }

        p{
            font-size: 1.3rem;
            line-height: 2.5;
        }
    </style>
</head>
<body>
    <div id="content">
        <h1><?php echo "Server response code: " . $title; ?></h1>
        <?php
            $statusCodeImg = $title;
            $imgSource = "";
        /* Lets get dynamically the Server Code images for each and every code defined by tittle */
            switch ($statusCodeImg)
            {
                case "403 Forbidden":
                    // forbidden.jpg doesn´t exist. Should be created by Photoshop artists :)
                    $imgSource = "/src/img/forbidden.jpg";
                    break;
                case "404 File Not Found":
                    // filenotfound404.jpg doesn´t exist. Should be created by Photoshop artists :)
                    $imgSource = "/src/img/filenotfound404.jpg";
                    break;
                case "405 Method Not Allowed":
                    // methodNotAllowed.jpg doesn´t exist. Should be created by Photoshop artists :)
                    $imgSource = "/src/img/methodNotAllowed.jpg";
                    break;
                case "408 Request Timeout":
                    // requestTimeout.jpg doesn´t exist. Should be created by Photoshop artists :)
                    $imgSource = "/src/img/requestTimeout.jpg";
                    break;
                case "500 Internal Server Error":
                    // internalError.jpg doesn´t exist. Should be created by Photoshop artists :)
                    $imgSource = "/src/img/internalError.jpg";
                    break;
                case "502 Bad Gateway":
                    // badGateway.jpg doesn´t exist. Should be created by Photoshop artists :)
                    $imgSource = "/src/img/badGateway.jpg";
                    break;
                case "504 Bad Gateway Timeout":
                    // badGatewayTimeout.jpg doesn´t exist. Should be created by Photoshop artists :)
                    $imgSource = "/src/img/badGatewayTimeout.jpg";
                    break;
                default:
                    // unrecogized.jpg doesn´t exist. Should be created by Photoshop artists :)
                    $imgSource = "/src/img/unrecogized.jpg";
            }
        ?>
        <img src="<?php echo $imgSource ?>"/>
        <p><?php echo $message; ?></p>
        <a href="/src/index.html" id="go-to-index">Return to Website</a>  <a href="javascript:close_window();">CLOSE THE TAB</a>
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
