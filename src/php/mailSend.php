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





/**
 * Please install phantomjs and replace $path with urs
 * to install: sudo apt-get install phantomjs , to check :phantomjs -v
 * If Installation wasn't successful please visit http://phantomjs.org/build.html
 * The Date will be added at the end of  File name to differentiate between files
 * File name will be Something like this : TLSCrawler12-2015.pdf
 *
 */

$date = date('m-Y');
$pjsRastersizePath='/usr/local/share/phantomjs/examples/rasterize.js';
$htmlGraphPath='/var/www/html/website/src/allgraphs.html';
$pdfFile='/var/www/html/website/src/TLSCrawler'.$date.'.pdf';

//calling phantomjs from Terminal to creat the chart pdf

$response = exec('phantomjs '.$pjsRastersizePath.' '.$htmlGraphPath.' '.$pdfFile );

// wait till the file is created

sleep(5);
/**
 * e-mail setup:
 * please change 'from' to sender e-mail address
 *
*/
$senderName="TLSCrawler Team";
global $from;
$from="geo85.g@gmail.com";
$recipient=" recipeintName";
//$to="geo85.g@gmail.com";

$recipientArray=array("geo85.g@gmail.com"=>'George',
"22beer1bif@hft-stuttgart.de"=>'Ermal',"21ertu1bwi@hft-stuttgart.de"=>'Tugba'
,"lukaskomarek@web.de"=>'Lukas K.',"12anni1bif@hft-stuttgart.de"=>'Nico A.'
, "12wede1bif@hft-stuttgart.de"=>'Dennis',"22krni1bif@hft-stuttgart.de"=>'Nico K.');


foreach($recipientArray as$recipientEmail=> $recipientName){
    sendEmail($recipientName,$recipientEmail,$pdfFile,$from,$date,$senderName);
}

//send email
function sendEmail($recipientName,$recipientEmail,$pdfFile,$senderEmail,$date,$senderName)
{
    $message = "Hello $recipientName,\n\nyour TLSCrawler Newsletter for ".$date." has arrived.
\nWe have got for you the new Crawilng results in the attatched pdf.
\nThanks you for your Subscreption.\nwith best Regards\n\n".$senderName;
    $subject = "your new Crawling result ";
    $mime = new Mail_mime();
    $mime->setTXTBody($message);

    $mime->addAttachment($pdfFile, "Application/pdf");
    $senderName = "TLS Crawler Team";

    $body = $mime->get();
    $header = $mime->headers(array(
        'From' =>$senderEmail,
        'To' => $recipientEmail,
        'Subject' => $subject
    ));
//please change username and password.
//you may also have to change your smpt setting if you
//are not going to use gmail.
    $smtp = Mail::factory('smtp', array(
        'host' => "ssl://smtp.googlemail.com",
        'port' => "465",
        'auth' => true,
        'username' => "username",
        'password' => "password"
    ));

    $mail = $smtp->send($recipientEmail, $header, $body);

//errors
    if (PEAR::isError($mail)) {
        echo("<p>" . $mail->getMessage() . "<p>");
    } else {
        echo("Message sent successfully to ".$recipientEmail."!\n");
    }
}