/*jslint browser: true*/
'use strict';

// for new menu items just add thuse below by adding or acting as shown
document.getElementById("nav01").innerHTML =
    "<nav class='navbar navbar-default'>" +
    "<div class='container'>" +
    "<div class='row'>" +
    "<div class='col-md-8'>" +
    "<div style='float:left'><a href='home.html'><img class='img-fluid' width='200' src='img/hotcat_logo.svg'  alt='Hotcat Logo'/></a></div>" +
    "<button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#bs-example-navbar-collapse-2' aria-expanded='false'>" +
    "<span class='sr-only'>Toggle navigation</span>" +
    "<span class='icon-bar'></span>" +
    "<span class='icon-bar'></span>" +
    "<span class='icon-bar'></span>" +
    "</button>" +
    "<div class='collapse navbar-collapse' id='bs-example-navbar-collapse-2'>" +
    "<ul style='float:right' class='nav navbar-nav'>" +
    "<li></li>" +
    "<li  class='dropdown'><a href='globaldata.html' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Universal Summary<span class='caret'></span></a>" +
    "<ul class='dropdown-menu'>" +
    "<li id='openGlobaldata'><a href='globaldata.html#'>Summary</a></li>" +
    "<li role='separator' class='divider'></li>" +
    "<li class='loadPFS'><a href='globaldata.html#PFS'>Perfect Forward Secrecy Support</a></li>" +
    "<li class='loadDHE'><a href='globaldata.html#DHE'>Diffie Hellman Keygroups</a></li>" +
    "<li class='loadECDHE'><a href='globaldata.html#ECDHE'>Elliptic Curve Diffie Hellman</a></li>" +
    "<li class='loadCiphers'><a href='globaldata.html#Ciphers'>Cipher Suites</a></li>" +
    "<li class='loadKx'><a href='globaldata.html#Kx'>Key Exchange</a></li>" +
    "<li class='loadAuth'><a href='globaldata.html#Auth'>Authentification Methods</a></li>" +
    "<li class='loadEnc'><a href='globaldata.html#Enc'>Bulk Encryption</a></li>" +
    "<li class='loadMAC'><a href='globaldata.html#MAC'>MAC Distribution</a></li>" +
    "<li role='separator' class='divider'></li>" +
    "<li class='loadlogjam'><a href='globaldata.html#logjam'>Logjam Attack</a></li>" +
    "</ul>" +
    "</li>" +
    "<li><a href='filtering.html'>Detailed Filter</a></li>" +
    "<li><a href='worldmap.html'>Worldmap</a></li>" +
    "<li><a href='analyze-me.html'>Analyse Me</a></li>" +
    "</ul></div>" +
    "<div class='col-md-4 '></div>" +
    "</div></div>" +
    "</div>" +
    "</nav>";


// for footer menu
var dateObject = new Date();
var currentYear = dateObject.getFullYear(); // dynamic Date
document.getElementById("footer").innerHTML =
    "<div class='container'>" +
    "<div class='row'>" +
    "<div class='col-md-8'>" +
    " &copy; 2015 - " + currentYear + " " +
    " HfT Stuttgart " +
    " &#124;<a href='#subscribtion' id='sub' data-toggle='modal'> Subscribe </a> " +
    "</div>" +
    "<div class='col-md-4 '></div>" +
    " Last Scan: <span id='lastScan'>DD.MM.YYYY</span> " +
    "</div></div>" +
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
    "                                                   By clicking the 'Subscribe' button below, you agree that Hotcat will send you an e-mail containing" +
    "                                                   the most recent results of our SSL/TLS scanner on a monthly basis. You also agree that the name and" +
    "                                                   e-mail address you provided will be saved in our database. Neither your name nor your e-mail address will be" +
    "                                                   used outside the scope of Hotcat's subscription function. Particularly, they will not be given to any third" +
    "                                                   party." +
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

/*---------------------------------------- START USER-INPUT VALIDATION-------------------------------------------*/
var name_tocheck = false;
var email_tocheck = false;

// enable the Subscribe
$(document).ready(function() {
    validate();
    $("#name, #email").change(validate);
});
$("#t-c").click(function() {
    validate();
});


/* form validation  that shows the user the correct format of name and email on keyup and change event*/
$(document).ready(function() {
    $("#name").change(function() {
        if (/^[a-zA-Z ]+$/.test($(this).val()) && $(this).val().trim() !== "") {
            name_tocheck = true;
            $(this).css("border-color", "#0F0");
        } else {
            name_tocheck = false;
            $(this).css("border-color", "#F00");
        }
    });
    $("#email").change(function() {
        if (/^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/.test($(this).val()) && $(this).val().trim() !== "") {
            email_tocheck = true;
            $(this).css("border-color", "#0F0");
        } else {
            email_tocheck = false;
            $(this).css("border-color", "#F00");
        }
    });
});

$(document).ready(function() {
    $("#name").keyup(function() {
        if (/^[a-zA-Z ]+$/.test($(this).val()) && $(this).val().trim() !== "") {
            name_tocheck = true;
            $(this).css("border-color", "#0F0");
        } else {
            name_tocheck = false;
            $(this).css("border-color", "#F00");
        }
    });
    $("#email").keyup(function() {
        if (/^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/.test($(this).val()) && $(this).val().trim() !== "") {
            email_tocheck = true;
            $(this).css("border-color", "#0F0");
        } else {
            email_tocheck = false;
            $(this).css("border-color", "#F00");
        }
    });
});

function disableBtn() {
    document.getElementById("save").disabled = true;
}

function undisableBtn() {
    document.getElementById("save").disabled = false;
}

function validate() {
    if (name_tocheck == true && email_tocheck == true) {
        undisableBtn();
    } else {
        disableBtn();
    }
}
/*---------------------------------------- END USER-INPUT VALIDATION-------------------------------------------*/

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