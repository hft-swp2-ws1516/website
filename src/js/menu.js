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
" &#124;<a href='url'> Subscribe </a> "+
"</div>";





