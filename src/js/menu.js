/**
 * Created by ermaldo on 25.11.15.
 */


// for new menu items just add thuse below by adding or acting as shown
document.getElementById("nav01").innerHTML =
"<div class='container'>"+
"<div class='row'>"+
"<div class='col-md-4'><ul class='nav navbar-nav'>" +
"<li><a href='index.html'>Home</a></li>" +
"<li><a href='globaldata.html'>Global</a></li>" +
"<li><a href='analyze-me.html'>Analyze Me</a></li>" +
"</ul></div>"+
"<div class='col-md-4 col-md-offset-4'>Last Scan: DD.MM.YYYY</div>"+

"</div>"+
"</div>";



// for footer menu
var n = new Date();
var d = n.getFullYear(); // dynamic Date
document.getElementById("footer").innerHTML =
"<div class='container'>"+
" &copy; "+d+" TLS Crawler ist "+
" ein Projekt der HfT Stuttgart. "+
" &#124;<a href='url'> Kontakt</a> "+
" &#124;<a href='url'> Impressum</a> "+
" &#124;<a href='#subscription' data-toggle='modal'> Subscribe </a> "+
"</div>";

// open Subscribe Modal
document.getElementById("subscribe").innerHTML =
    "<div class='container'>"+
    "<div class='modal fade' id='subscription' role='dialog'>"+
    "   <div class='modal-dialog'>"+
    "       <div class='modal-content'>"+
    "           <div class='modal-header'>"+
    "               <button type='button' class='close' data-dismiss='modal'>&times;</button>"+
    "               <h4 class='modal-title'><b>Subscribe for get e-mailed</b></h4>"+
    "           </div>"+
    "           <div class='modal-body'>"+
    "               <div class='form-group'>"+
    "                   <label for='name'>Your Name:</label>"+
    "                   <input type='email' class='form-control' id='name' placeholder='Your Name'>"+
    "               </div>"+
    "               <div class='input-group input-group-lg'>"+
    "                   <span class='input-group-addon' id='sizing-addon1'>@</span>"+
    "                   <input type='text' class='form-control' placeholder='Email' aria-describedby='sizing-addon1'>"+
    "               </div><br><hr>"+
    "               <div>"+
    "                   <input id='agree' name='radio' type='radio' class='radio'>"+
    "                   <label for='agree'>I hereby agree to receive e-mails!</label>"+
    "               </div>"+
    "           </div>"+
    "       <div class='modal-footer'>"+
    "           <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>"+
    "           <button type='button' class='btn btn-success'>Save</button>"+
    "       </div>"+
    "   </div>"+
    "</div>"+
    "</div>";<!--End of Modal-Window-->
