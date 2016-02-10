'use strict';
var globalJson;
var globalThead;
var globalInnerKeys;
var asc = true;

/* 
 * Draws sortable Table from json object.
 * @param theadArray - Array with keys for the json object
 * @param json - json object 
 * @param theadArray - Name of Table headings
 * @returns void
 */

function drawTable(theadArray, json, innerArrayKeys) {
  // Global Variables for sorting and drawing the chart again
  globalJson = json;
  globalThead = theadArray;
  globalInnerKeys = innerArrayKeys;

  // Create Table Heading first
  var html = '';
  html += "<table class='table'><thead id='headings'><tr>";
  for (var heading in theadArray) {
    html += "<th onclick='sortTable(this)' id='" + theadArray[heading] + "'>" + theadArray[heading] + "</th>";
  }
  html += "</tr></thead><tbody>";
  // for  the tbody iterate over the json, and get the value of the keys in the theadArray
  for (var e in json) {
    html += "<tr>";
    for (heading in theadArray) {

      var value = json[e][theadArray[heading]];
      // If a value is an array, then create an inner table within the td tag
      if (Array.isArray(value)) {
        html += "<td>" + "<table class='table'>";
        html += "<tr>";
        //Heading for innerTable
        for (var innerKey in innerArrayKeys) {
          html += "<th>" + innerArrayKeys[innerKey] + "</th>";
        }
        html += "</tr>";
        for (var innerArrayIndex in value) {
          html += "<tr>";
          for (innerKey in innerArrayKeys) {
            html += "<td>" + value[innerArrayIndex][innerArrayKeys[innerKey]] + "</td>";
          }
          html += "</tr>";
        }
        html += "</table></td>";
      } else {
        html += "<td>" + value + "</td>";
      }
    }
    html += "</tr>";
  }
  html += "</tbody></table>";

  $('#table-data').html(html);
}

/* 
 * Sort alternating table by given element(table heading/key) and draws the Table again
 * @param element - the compare element
 * @returns void -
 */

function sortTable(element) {
  var id = element.id;
  //var asc = element.getAttribute('asc'); // switch the order, true if not set
  asc = asc ? false : true;
  sortResults(globalJson, id, asc);
  drawTable(globalThead, globalJson, globalInnerKeys);
}


/* 
 * Get Timespan from Datepicker or Timeslider, depending which of them is visible
 * @returns array with first element 1st datetime in ms and second 2nd datetime in ms
 */


function getTimespan() {
  var timespan = [];
  // Check which of the datepickers are visible
  if ($('#timeslider').is(":visible")) {
    timespan = dateSlider.noUiSlider.get();
  } else {
    var time1 = new Date($('#filterDateStart').datepicker('getDate').getTime());
    var time2 = new Date($('#filterDateEnd').datepicker('getDate').getTime());

    timespan[0] = (new Date(time1.getFullYear(), time1.getMonth())).getTime();
    timespan[1] = (new Date(time2.getFullYear(), time2.getMonth())).getTime();
    //alert("Datepicker: Time1:"+ timespan[0] + "Time2:" + timespan[1]);
  }

  return timespan;
}



/* 
 *  Merge double entries of Ciphersuites from different TLS Versions in the ciphers/summary response JSON 
 * @param json - the json object to work in
 * @param tlsVersion - the TLS Version (1.2,1.1 or 1.0) 
 * @param totalHosts - Number of totals hosts for calculating the percentage
 * @returns summarized array
 */

function mergeDoubleEntrys(json, tlsVersion, totalHosts) {
  var summarized = [];
  for (var i = 0; i < json.length; i++) {
    var doubleEntry = false;
    // get a object from the summary
    var obj = json[i];
    // if TLS version is given
    if (tlsVersion) {
      if (obj.protocol === tlsVersion) {
        obj.percent = parseFloat(((obj.count / totalHosts) * 100).toFixed(2));
        summarized.push(obj);
      }
    } else {

      // iterate over summarized array and check for double entry
      for (var j = 0; j < summarized.length; j++) {
        // if entry found, add increase the count number of the first entry
        if (obj.cipher === summarized[j].cipher) {
          doubleEntry = true;
          summarized[j].count += obj.count;
        }
      }
      // if no double entry found, push the obj normally to the summarized arra
      if (!doubleEntry) {

        summarized.push(obj);
      }
      doubleEntry = false;

    }


  }

  return summarized;
}


/* 
 *   Compare function for sorting Array of JSONs 
 * @param arr - the json object to work in
 * @param prop - the prop which is sorted by
 * @param {bool} asc - sort ascending or descending
 * @returns comparator
 */

function sortResults(arr, prop, asc) {
  arr = arr.sort(function(a, b) {
    if (asc) {
      return (a[prop] > b[prop]);
    } else {
      return (b[prop] > a[prop]);
    }
  });
}


/* 
 * Date is stored in databse in specifig way (2015_12 e.g)
 * @param date - {date} the date
 * @returns formatted date
 */

function formatDate2(date) {
  var string = date.getFullYear() + "_" + (date.getMonth() + 1);
  return string;
}


/* 
 * Filter response from API by given timespan.
 * @param response - the response json
 * @param start - start date
 * @param end - end date
 * @returns filtered json
 */


function filterResponseByTimespan(response, start, end) {
  var filtered = [];
  var date = new Date(start.getFullYear(), start.getMonth());
  var end = new Date(end.getFullYear(), end.getMonth());
  while (date.getTime() <= end.getTime()) {
    for (var i = 0; i < response.length; i++) {
      if (response[i].month === formatDate2(date) || response[i]._id === formatDate2(date)) {
        filtered.push(response[i]);
        break;
      }
    }
    // if value is 12, then the first month of the next year will be set
    date.setMonth(date.getMonth() + 1);
  }
  return filtered;
}

/* 
 * Get the Index of the Latest Element in the response JSON.
 * @param response - the response json
 * @returns Index of latest Element in the response JSON
 */

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


// Bootstrap Datepicker - The End Time

$('#filterDateEnd').datepicker({
  format: "yyyy_mm",
  startView: 1,
  minViewMode: 1,
  autoclose: true,
  //setDate: new Date(2015,11),
  startDate: new Date(2015, 10),
  endDate: new Date(),
});

// default end date, this syntax is weird but it worked
$('#filterDateEnd').datepicker('setDate', new Date(new Date().getFullYear(), new Date().getMonth()));


// Boostrap Datepicker - Start time
$('#filterDateStart').datepicker({
  format: "yyyy_mm",
  viewMode: "months",
  minViewMode: "months",
  autoclose: true,
  startDate: new Date(2015, 10),
  endDate: new Date(),
}).on('changeDate', function(e) {
  var month = e.date.getMonth();
  var year = e.date.getFullYear();
  var startDate = new Date(year, month);
  $('#filterDateEnd').datepicker('setStartDate', startDate);
  //$('#filterDateEnd').datepicker('setDate',  startDate);
});


// set default Beginn date
$('#filterDateStart').datepicker('setDate', new Date(2015, 10));