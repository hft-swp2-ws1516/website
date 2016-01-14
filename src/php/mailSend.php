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
$message = "Hello .$recipientName.\n\nyour HOTCAT  Newsletter for " . $date . " has arrived.
\nWe have got for you the new TLS Scanning results in the attached pdf.
\nTo know the detailed results please visit us at: "."https://hotcat.de \n\n".
"If you Want UNSBSCRIBE our Newsletter you can click the following Link:\n
https://hotcat.de/php/unsubscribe.php?email=".$recipientMail."&hash_unsubscribe=".$recipientHashUn."
\nThanks you for your Subscription.\n with best Regards\n\n " . $senderName;
$subject = "your new TLS Scanning result ";
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