<?php
/**
 * Created by PhpStorm.
 * User: geo
 * Date: 12/2/15
 * Time: 8:06 PM
 */

/**
 * To execute this Script you need php pear:
 * apt-get install php-pear
 * pear install Mail
 * pear install Mail_Mime
 */
require("Mail.php");
require("Mail/mime.php");
include('mongo.php');





/**
 * Please install phantomjs and replace $path with urs
 * to install: sudo apt-get install phantomjs , to check :phantomjs -v
 * If Installation wasn't successful please visit http://phantomjs.org/build.html
 * The Date will be added at the end of  File name to differentiate between files
 * File name will be Something like this : TLSCrawler12-2015.pdf
 *
 */

$date = date('m-Y');
//$pjsRastersizePath='/usr/local/share/phantomjs/examples/rasterize.js';
$pjsRastersizePath='/var/www/html/src/js/phantomjs/examples/rasterize.js';
$htmlGraphPath='/var/www/html/src/mailgraphs.html';
$pdfFile='/var/www/html/src/TLSCrawler'.$date.'.pdf';

//calling phantomjs from Terminal to creat the chart pdf

$response = exec('phantomjs '.$pjsRastersizePath.' '.$htmlGraphPath.' '.$pdfFile );

// wait till the file is created

sleep(5);
/**
 * e-mail setup:
 * please change 'from' to sender e-mail address
 *
*/
$senderName="HOTCAT Team";
global $from;
//$to="geo85.g@gmail.com";

$recipientCourser = $people->find(array("active" => "1"));

foreach($recipientCourser as $recipientData){
sendEmail($recipientData,$pdfFile,$from,$date,$senderName);
}

//send email
function sendEmail($recipientData,$pdfFile,$date,$senderName)
{
$recipientName=$recipientData["name"];
$recipientMail=$recipientData["email"];
$recipientHashUn=$recipientData["hash_unsubscribe"];
$message = "Dear .$recipientName.\n\nyour Hotcat report for " . $date . " has arrived!
\nThe attached PDF file contains the most recent SSL/TLS scanning results, aggregated just for you (and all the other subscribers).
\nIn case you are interested in more detailed results and other awesome stuff, please visit: "."https://hotcat.de \n\n".
"If you are, on the other hand, not interested any more in receiving Hotcat reports, please use the following link in order to cancel your subscription:\n
https://hotcat.de/php/unsubscribe.php?email=".$recipientMail."&hash_unsubscribe=".$recipientHashUn."
\nPlease be advised that we kill a really cute baby kitten for every user that unsubscribes. Anyway, thanks for your subscription and have a lovely day!\n With hot regards\n\n " . $senderName;
$subject = "Your monthly Hotcat report";
$mime = new Mail_mime();
$mime->setTXTBody($message);

$mime->addAttachment($pdfFile, "Application/pdf");

$body = $mime->get();
$header = $mime->headers(array(
'To' => $recipientMail,
'Subject' => $subject
));


$mail =& Mail::factory('mail');
$mail ->send($recipientMail, $header, $body);

//errors
if (PEAR::isError($mail)) {
echo("<p>" . $mail->getMessage() . "<p>");
    } else {
    echo("Message sent successfully to ".$recipientMail."!\n");
    }
    sleep(5);
    }