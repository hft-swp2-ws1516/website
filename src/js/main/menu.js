/*jslint browser: true*/
'use strict';

// for new menu items just add thuse below by adding or acting as shown
document.getElementById("nav01").innerHTML =
    "<nav class='navbar navbar-default'>" +
    "<div class='container'>" +
    "<div class='row'>" +
    "<div class='col-md-8'><ul class='nav navbar-nav'>" +
    "<li><a href='home.html'>Home</a></li>" +
    "<li  class='dropdown'><a href='globaldata.html' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Universal Summary<span class='caret'></span></a>" +
    "<ul class='dropdown-menu'>" +
    "<li id='openGlobaldata'><a href='globaldata.html#'>Summary</a></li>" +
    "<li role='separator' class='divider'></li>" +
    "<li id='loadPFS'><a href='globaldata.html#PFS'>Perfect Forward Secrecy Support</a></li>" +
    "<li id='loadDHE'><a href='globaldata.html#DHE'>Diffie Hellman Keygroups</a></li>" +
    "<li id='loadECDHE'><a href='globaldata.html#ECDHE'>Elliptic Curve Diffie Hellman</a></li>" +
    "<li id='loadCiphers'><a href='globaldata.html#Ciphers'>Cipher Suites</a></li>" +
    "<li id='loadKx'><a href='globaldata.html#Kx'>Key Exchange</a></li>" +
    "<li id='loadAuth'><a href='globaldata.html#Auth'>Authentification Methods</a></li>" +
    "<li id='loadEnc'><a href='globaldata.html#Enc'>Bulk Encryption</a></li>" +
    "<li id='loadMAC'><a href='globaldata.html#MAC'>MAC Distribution</a></li>" +
    "<li role='separator' class='divider'></li>" +
    "<li id='loadlogjam'><a href='globaldata.html#logjam'>Logjam Attack</a></li>" +
    "</ul>" +
    "</li>" +
    "<li><a href='filtering.html'>Detailed Filter</a></li>" +
    "<li><a href='worldmap.html'>Worldmap</a></li>" +
    "<li><a href='analyze-me.html'>Analyse Me</a></li>" +
    "</ul></div>" +
    "<div class='col-md-4 '>Last Scan: <span id='lastScan'> DD.MM.YYYY</span></div>" +
    "</div>" +
    "</div>" +
    "</nav>";


// for footer menu
var n = new Date();
var d = n.getFullYear(); // dynamic Date
document.getElementById("footer").innerHTML =
    "<div class='container'>" +
    " &copy; 2015 - " + d + " " +
    " HfT Stuttgart " +
    " &#124;<a href='#subscribtion' id='sub' data-toggle='modal'> Subscribe </a> " +
    "</div>";

// open Subscribe Modal and this modal will open the subscriber count modal on subscribe.php file
document.getElementById("subscribe").innerHTML =
    "<form id='formCheck' method='post' action='./php/subscribe.php'>" +
    "<div class='container'>" +
    "<div class='modal fade' id='subscribtion' role='dialog'>" +
    "   <div class='modal-dialog'>" +
    "       <div class='modal-content'>" +
    "           <div class='modal-header'>" +
    "               <button type='button' class='close' data-dismiss='modal'>&times;</button>" +
    "               <h4 class='modal-title'><b>Subscribe for e-mail:</b></h4>" +
    "           </div>" +
    "           <div class='modal-body'>" +
    "               <div class='form-group'>" +
    "                   <label for='name'>Full Name:</label>" +
    "                   <input type='text' class='form-control' name='name' id='name' placeholder='Your Name' required>" +
    "                   <span id='usernamestatus'></span>" +
    "               </div>" +
    "               <div class='input-group input-group-lg'>" +
    "                   <span class='input-group-addon' id='sizing-addon1'>@</span>" +
    "                   <label for='email'></label>" +
    "                   <input type='email' class='form-control' name='email' id='email' placeholder='Email' aria-describedby='sizing-addon1' required>" +
    "                   <span id='emailstatus'></span>" +
    "               </div><br><hr>" +
    "               <div>" +
    "                   <table>" +
    "                       <tr>" +
    "                           <td>" +
    "                               <div class='panel-group'>" +
    "                                   <div class='panel panel-default'>" +
    "                                       <div class='panel-heading'>" +
    "                                           <h4 class='panel-title'>" +
    "                                               <a id='t-c' data-toggle='collapse' href='#terms-conditions'>I accept the Terms & Conditions</a>" +
    "                                           </h4>" +
    "                                       </div>" +
    "                                       <div id='terms-conditions' class='panel-collapse collapse'>" +
    "                                               <div class='alert alert-info'>" +
    "                                                   By clicking the Subscribe Button bellow you agree that your Name and e-mail Address" +
    "                                                   will be saved into our Database. We are using those to send you monthly an e-mail " +
    "                                                   about the last CRAWLING results. We assure you that your Name and e-mail address" +
    "                                                   will not be disclosed to third parties!" +
    "                                               </div>" +
    "                                       </div>" +
    "                                   </div>" +
    "                               </div>" +
    "                           </td>" +
    "                       </tr>" +
    "                   </table>" +
    "               </div>" +
    "           </div>" +
    "       <div class='modal-footer' id='sub-unsub'>" +
    "       <table>" +
    "       <tbody>" +
    "       <tr>" +
    "           <td>" +
    "               <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" +
    "               <button type='submit' class='btn btn-success' data-toggle='modal' data-target='#subModal' id='save' disabled>Subscribe</button>" +
    "           </td>" +
    "       </tr>" +
    "       </tbody>" +
    "       </table>" +
    "       </div>" +
    "   </div>" +
    "</div>" +
    "</div>" +
    "</form>";

// enable the Subscribe
$("#t-c").click(function() {
    $("#save").removeAttr("disabled");
});


// Validate
/* form validation */
$(document).ready(function() {
    $("#name").keyup(function() {
        if (/^[a-zA-Z ]+$/.test($(this).val()) && $(this).val().trim() !== "") {
            $(this).css("border-color", "#0F0");
        } else {
            $(this).css("border-color", "#F00");
        }
    });
    $("#email").keyup(function() {
        if (/^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/.test($(this).val()) && $(this).val().trim() !== "") {
            $(this).css("border-color", "#0F0");
        } else {
            $(this).css("border-color", "#F00");
        }
    });
});

function getLatestElementIndex(response) {
    var latestElement = 0;
    for (var i = 0; i < response.length; i++) {
        var split = response[i].month.split('_');
        var comparedate = new Date(split[0], split[1] - 1);
        for (var j = i + 1; j < response.length; j++) {
            var split2 = response[j].month.split('_');
            if (comparedate.getTime() < new Date(split2[0], split2[1] - 1).getTime()) {
                latestElement = j;
            }
        }
    }
    return latestElement;
}


var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];


// Test if browser supports localstorage
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return false;
    }
}

// Latest Scan Date
var latestScan;


if (storageAvailable('localStorage')) {
    // Yippee! We can use localStorage awesomeness
    latestScan = localStorage.getItem('latestScan');

    if (latestScan) {
        $('#lastScan').html(latestScan);

    } else {
        jQuery.get("https://hotcat.de:1337/api/v0/pfs/overview", function(response) {
            var latestElementIndex = getLatestElementIndex(response);
            latestScan = response[latestElementIndex].month;
            var parts = latestScan.split('_');

            var date = monthNames[parts[1] - 1] + ", " + parts[0];

            $('#lastScan').html(date);
            // save the latest Date in the local storage
            localStorage.setItem('latestScan', date);

        });
    }
}
// if localstorage is not supported
else {
    jQuery.get("https://hotcat.de:1337/api/v0/pfs/overview", function(response) {
        var latestElementIndex = getLatestElementIndex(response);
        latestScan = response[latestElementIndex].month;
        var parts = latestScan.split('_');

        var date = monthNames[parts[1] - 1] + ", " + parts[0];

        $('#lastScan').html(date);
    });

}