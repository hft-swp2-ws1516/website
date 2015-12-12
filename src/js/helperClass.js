function formatDate2(date) {
	var string = date.getFullYear() + "_" + (date.getMonth() + 1);
	return string;
}

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