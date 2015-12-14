/* Get Timespan from Datepicker or Timeslider, depending which of them is visible
   return : array with first element 1st datetime in ms and second 2nd datetime in ms
   */

   function getTimespan(){
    timespan = [];
    // Check which of the datepickers are visible
    if ($('#timeslider').is(":visible") ) {
      timespan = dateSlider.noUiSlider.get();
    }
    else{
      var time1 =  new Date($('#filterDateStart').datepicker('getDate').getTime());
      var time2 = new Date($('#filterDateEnd').datepicker('getDate').getTime());

      timespan[0] = (new Date(time1.getFullYear(), time1.getMonth())).getTime();
      timespan[1] =  (new Date(time2.getFullYear(), time2.getMonth())).getTime();
      //alert("Datepicker: Time1:"+ timespan[0] + "Time2:" + timespan[1]);
    }

    return timespan;
  }


/* Merge double Entry of Ciphersuites from different TLS Versions in the ciphers/summary response JSON 
   returns summarized array
   */

   function mergeDoubleEntrys(json){
     var summarized = [];
     for (var i = 0; i < json.length; i++) {
      var doubleEntry = false;
      // get a object from the summary
      var obj = json[i];
      // iterate over summarized array and check for double entry
      for (var j = 0; j < summarized.length; j++) {
      // if entry found, add increase the count number of the first entry
      if (obj['cipher'] == summarized[j].cipher ) {
        doubleEntry = true;
        summarized[j].count += obj['count'];
      };
    };
       // if no double entry found, push the obj normally to the summarized arra
       if (!doubleEntry) {
        summarized.push(obj);
      };
      doubleEntry = false;
    };

    return summarized;
  }


 // Compare function for sorting Array of JSONs 
 function sortResults(arr, prop, asc) {
  arr = arr.sort(function(a, b) {
    if (asc) return (a[prop] > b[prop]);
    else return (b[prop] > a[prop]);
  });
}

function formatDate2(date) {
	var string = date.getFullYear() + "_" + (date.getMonth() + 1);
	return string;
};

function filterResponseByTimespan(response, start, end) {
	var filtered = [];
	var date = new Date(start.getFullYear(), start.getMonth());
	var end = new Date(end.getFullYear(), end.getMonth());
	while (date.getTime() <= end.getTime()) {
		for (var i = 0; i < response.length; i++) {
			if (response[i].month == formatDate2(date)) {
				filtered.push(response[i]);
				break;
			}
			;
		}
		;
        // if value is 12, then the first month of the next year will be set
        date.setMonth(date.getMonth() + 1);
    }
    ;
    return filtered;
}

function getLatestElementIndex(response)
{
	var latestElement = 0;
	for (var i = 0; i < response.length; i++) {
		var split = response[i].month.split('_');
		var comparedate = new Date(split[0], split[1] - 1);
		for (var j = i + 1; j < response.length; j++) {
			var split2 = response[j].month.split('_');
			if (comparedate.getTime() < new Date(split2[0], split2[1] - 1).getTime())
			{
				latestElement = j;
			}
			;
		}
		;
	}
	;
	return latestElement;
}