/**
 * Created by ermaldo on 25.11.15.
 */


// for new menu items just add thuse below by adding or acting as shown
document.getElementById("nav01").innerHTML =
"<nav class='navbar navbar-default'>"+
"<div class='container'>"+
"<div class='row'>"+
"<div class='col-md-8'><ul class='nav navbar-nav'>" +
"<li><a href='index.html'>Home</a></li>" +
"<li id='openGlobaldata' class='dropdown'><a href='globaldata.html' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Universal Summary<span class='caret'></span></a>" +
"<ul class='dropdown-menu'>"+
"<li id='loadPFS'><a href='globaldata.html#PFS'>Perfect Forward Secrecy Support</a></li>"+
"<li id='loadDHE'><a href='globaldata.html#DHE'>Diffie Hellman Keygroups</a></li>"+
"<li id='loadECDHE'><a href='globaldata.html#ECDHE'>Elliptic Curve Diffie Hellman</a></li>"+
"<li id='loadCiphers'><a href='globaldata.html#Ciphers'>Cipher Suites</a></li>"+
"<li id='loadMAC'><a href='globaldata.html#MAC'>MAC Distribution</a></li>"+
"<li role='separator' class='divider'></li>"+
"<li id='loadlogjam'><a href='globaldata.html#logjam'>Logjam Attack</a></li>"+
"</ul>"+
"</li>"+
"<li><a href='filtering.html'>Detailed Filter</a></li>" +
"<li><a href='worldmap.html'>Worldmap</a></li>" +
"<li><a href='analyze-me.html'>Analyse Me</a></li>" +
"</ul></div>"+
"<div class='col-md-4 '>Last Scan: DD.MM.YYYY</div>"+
"</div>"+
"</div>"+
"</nav>";



// for footer menu
var n = new Date();
var d = n.getFullYear(); // dynamic Date
document.getElementById("footer").innerHTML =
"<div class='container'>"+
" &copy; "+d+" TLS Crawler ist "+
" ein Projekt der HfT Stuttgart. "+
" &#124;<a href='url'> Kontakt</a> "+
" &#124;<a href='url'> Impressum</a> "+
" &#124;<a href='#subscribtion' id='sub' data-toggle='modal'> Subscribe </a> "+
"</div>";

// open Subscribe Modal and this modal will open the subscriber count modal on subscribtion.php file after the use press on save button
document.getElementById("subscribe").innerHTML =
    "<form method='post' action='subscribe.php'>"+
    "<div class='container'>"+
    "<div class='modal fade' id='subscribtion' role='dialog'>"+
    "   <div class='modal-dialog'>"+
    "       <div class='modal-content'>"+
    "           <div class='modal-header'>"+
    "               <button type='button' class='close' data-dismiss='modal'>&times;</button>"+
    "               <h4 class='modal-title'><b>Subscribe for e-mail:</b></h4>"+
    "           </div>"+
    "           <div class='modal-body'>"+
    "               <div class='form-group'>"+
    "                   <label for='name'>Name & Surname:</label>"+
    "                   <input type='text' class='form-control' name='name' id='name' placeholder='Your Name'>"+
    "               </div>"+
    "               <div class='input-group input-group-lg'>"+
    "                   <span class='input-group-addon' id='sizing-addon1'>@</span>"+
    "                   <input type='email' class='form-control' name='email' placeholder='Email' aria-describedby='sizing-addon1'>"+
    "               </div><br><hr>"+
    "               <div>"+
    "                   <table>" +
    "                       <tr>" +
    "                           <td>" +
    "                               <h5>Subscribe:</h5>" +
    "                           </td>" +
    "                           <td>" +
    "                               <div class='onoffswitch'>" +
    "                                   <input type='checkbox' name='onoffswitch' class='onoffswitch-checkbox' id='myonoffswitch'>" +
    "                                   <label class='onoffswitch-label' for='myonoffswitch'>" +
    "                                       <span class='onoffswitch-inner'></span>" +
    "                                       <span class='onoffswitch-switch'></span>" +
    "                                   </label>" +
    "                               </div>" +
    "                           </td>" +
    "                       </tr>" +
    "                   </table>" +
    "               </div>"+
    "           </div>"+
    "       <div class='modal-footer'>" +
    "       <table>" +
    "       <tbody>" +
    "       <tr>" +
    "           <td>" +
    "               <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>"+
    "               <button type='submit' class='btn btn-success' data-toggle='modal' data-target='#subModal' id='save' disabled>Save</button>" +
    "           </td>" +
    "       </tr>" +
    "       </tbody>" +
    "       </table>"+
    "       </div>"+
    "   </div>"+
    "</div>"+
    "</div>"+
    "</form>";<!--End of Modal-Window-->

// disabling/enable the save button
$("#myonoffswitch").on("click", function()
{
    var toggle = $("#save").prop("disabled");

    $("#save").prop("disabled", !toggle );
});
// end Subscribe part
