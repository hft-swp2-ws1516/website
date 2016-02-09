/*jslint browser: true*/
'use strict';


/* 
 * Retrieves the response text of an HTTP request.
 * 
 * @returns {HttpClient}
 */

var HttpClient = function () {
    this.get = function (url, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                callback(httpRequest.responseText);
            }
        };
        httpRequest.open("GET", url, true);
        httpRequest.send(null);
    };
};

/*
 * Data structures for storing aggregation results.
 */

var httpResponse;
var months = [];
var totalHosts = [];
var monthBody = [];
var hostsAccepting = [];
var hostsPreferring = [];

var hostsAcceptingSSL2 = [];
var hostsPreferringSSL2 = [];
var hostsAcceptingSSL3 = [];
var hostsPreferringSSL3 = [];
var hostsAcceptingTLS1 = [];
var hostsPreferringTLS1 = [];
var hostsAcceptingTLS11 = [];
var hostsPreferringTLS11 = [];
var hostsAcceptingTLS12 = [];
var hostsPreferringTLS12 = [];

var totalCiphersAccepting = [];
var totalCiphersPreferring = [];

var labelsToRemember = [];
var graphsToRemember = [];



/*
 * Used as the callback function to be passed as a parameter to the function encapsulated
 * by the HttpClient object above in order to store the response of an HTTP request.
 * 
 * @param {type} response - The HTTP response that is to be saved.
 * @returns {undefined}
 */

function setHttpResponse(response) {
    httpResponse = response;
}


/*
 * After having removed special characters from the input field, this function puts
 * strings given by the user for the different text boxes available on the "Detailed Filter"
 * page in the correct order and finally displays the user's entries as the currently
 * selected cipher suite to search for.
 * 
 * @returns {undefined}
 */

function displayFilter() {

    removeSpecialChars(document.getElementById("filterKeyExAndAuth"));
    removeSpecialChars(document.getElementById("filterCipher"));
    removeSpecialChars(document.getElementById("filterKeyLen"));
    removeSpecialChars(document.getElementById("filterMsgAuth"));

    var keyExAndAuth = document.getElementById("filterKeyExAndAuth").value;
    var bulkCipher = document.getElementById("filterCipher").value;
    var keyLen = document.getElementById("filterKeyLen").value;
    var msgAuth = document.getElementById("filterMsgAuth").value;

    if (keyExAndAuth !== "" || bulkCipher !== "" || keyLen !== "" || msgAuth !== "") {
        if (keyExAndAuth !== "") {
            keyExAndAuth += "-";
        }
        if (keyLen === "" && bulkCipher !== "") {
            bulkCipher += "-";
        } else if (keyLen !== "" && (bulkCipher === "AES-CBC" || bulkCipher === "AES-CCM" || bulkCipher === "AES-GCM")) {
            var left = bulkCipher.split("-")[0];
            var right = bulkCipher.split("-")[1];
            bulkCipher = left;
            keyLen += "-" + right + "-";
        } else if (keyLen !== "") {
            keyLen += "-";
        }

        var cipherString = [keyExAndAuth, bulkCipher, keyLen, msgAuth].join("");
        if (document.getElementById("matchingKindAsPart").checked) {
            cipherString = cipherString.replace(/-/g, ' ');
        }

        cipherString = cipherString.replace(/[^\w\s||.||-]/gi, '');
        document.getElementById("displayFilterSelection").innerHTML = cipherString;

    } else {

        document.getElementById("displayFilterSelection").innerHTML = "[none]";

    }
}


/*
 * Removes special characters from a given textbox.
 * 
 * @param {type} textbox - Textbox whose input the special characters are to be
 * removed from.
 * @returns {undefined}
 */

function removeSpecialChars(textbox) {

    if (textbox === document.getElementById("filterKeyLen")) {
        textbox.value = textbox.value.replace(/[^\d]/g, '');
    } else {
        textbox.value = textbox.value.replace(/[^\w\s||.||-]/gi, '');
    }

}


/*
 * Displays a warning message if a user has applied a filter while in "match as part
 * of a larger cipher string" operation mode. If a filter is applied using the
 * "match literally" mode, the function hides the warning message.
 * 
 * @returns {undefined}
 */

function displayWarning() {

    if (document.getElementById("matchingKindAsPart").checked) {
        document.getElementById("warningMessage").style.cssText = "text-align: center; display: block; padding-top: 30px";
    } else {
        document.getElementById("warningMessage").style.cssText = "text-align: center; display: none";
    }

}


/*
 * If a user hits the "Show Graphs" button in order to display remembered graphs
 * but there are no graphs to display yet, this function makes the according warning
 * message visible. If, on the other hand, a user makes the application remember a 
 * graph, the message is hidden.
 * 
 * @param {type} makeVisibile - True if the warning message is to be shown, false otherwise.
 * 
 * @returns {undefined}
 */

function displayWarningNoGraphs(makeVisibile) {
    if (makeVisibile) {
        document.getElementById("warningMessageNoGraphs").style.cssText = "text-align: center; display: block; padding-top: 30px";
    } else {
        document.getElementById("warningMessageNoGraphs").style.cssText = "display: none";
    }
}


/*
 * Shows descriptions for every graph currently displayed. A description consists 
 * of the selected Top-Level Domain (if given), the protocol (if given), filter settings
 * regarding the actual cipher suite, as well as information concerning the operation
 * mode used to create the graph (cipher suite matched literally or as part of a 
 * larger cipher string), and if the hosts that were counted accepted or preferred
 * the given cipher suite.
 *  
 * @returns {undefined}
 */

function displayDescriptions() {

    var tld = "";
    var protocol = "";

    if (document.getElementById("filterTLD").value !== "") {
        tld = document.getElementById("filterTLD").value;
        tld = tld.concat(", ");
    }
    if (document.getElementById("filterProtocol").value !== "") {
        protocol = document.getElementById("filterProtocol").value;
        protocol = protocol.concat(", ");
    }

    var cipherString = document.getElementById("displayFilterSelection").innerHTML;

    if (document.getElementById("matchingKindLiteral").checked) {
        cipherString = cipherString.concat(" (matched literally)");
    } else {
        cipherString = cipherString.concat(" (matched as part of a larger cipher string)");
    }

    var description = tld.concat(protocol).concat(cipherString);
    if (document.getElementById("general").innerHTML !== "") {
        document.getElementById("descriptionGeneral").innerHTML = description;
        document.getElementById("descriptionGeneral").style.cssText = "display: block";
    }
    if (document.getElementById("lastMonth_General").innerHTML !== "") {
        document.getElementById("descriptionLastMonth_General").innerHTML = description.concat(" - Percentage View");
        document.getElementById("descriptionLastMonth_General").style.cssText = "display: block";
    }
    if (document.getElementById("noCipherSuites_Accepted").innerHTML !== "") {
        document.getElementById("descriptionNoCipherSuites_Accepted").innerHTML = description.concat(" - Accepted");
        document.getElementById("descriptionNoCipherSuites_Accepted").style.cssText = "display: block";
    }
    if (document.getElementById("lastMonth_Accepted").innerHTML !== "") {
        document.getElementById("descriptionLastMonth_Accepted").innerHTML = description.concat(" - Percentage View - Accepted");
        document.getElementById("descriptionLastMonth_Accepted").style.cssText = "display: block";
    }
    if (document.getElementById("noCipherSuites_Preferred").innerHTML !== "") {
        document.getElementById("descriptionNoCipherSuites_Preferred").innerHTML = description.concat(" - Preferred");
        document.getElementById("descriptionNoCipherSuites_Preferred").style.cssText = "display: block";
    }
    if (document.getElementById("lastMonth_Preferred").innerHTML !== "") {
        document.getElementById("descriptionLastMonth_Preferred").innerHTML = description.concat(" - Percentage View - Preferred");
        document.getElementById("descriptionLastMonth_Preferred").style.cssText = "display: block";
    }

}


/*
 * Hides all graph descriptions.
 * 
 * @returns {undefined}
 */

function hideDescriptions() {

    document.getElementById("descriptionGeneral").style.cssText = "display: none";
    document.getElementById("descriptionLastMonth_General").style.cssText = "display: none";
    document.getElementById("descriptionNoCipherSuites_Accepted").style.cssText = "display: none";
    document.getElementById("descriptionLastMonth_Accepted").style.cssText = "display: none";
    document.getElementById("descriptionNoCipherSuites_Preferred").style.cssText = "display: none";
    document.getElementById("descriptionLastMonth_Preferred").style.cssText = "display: none";

}


/*
 * Function immediately called as soon as a user hits the "Apply Filter" button 
 * and thus one of the main functions of the filtering process as it controls a number
 * of other functions clearing results, displaying or hiding elements, enabling or 
 * disabling buttons, and, most importantly, executing the process of parsing
 * the database's HTTP response and carrying out data aggregations based on the former.
 * 
 * @returns {parseResponse.filterDataAnonym$1} - An object consisting of arrays containing
 * the result of filtering and aggregation steps carried out by the "parseResponse()" function.
 * On the "filterciphers.html" page, the results are directly used to generate graphs which
 * are then displayed to the user.
 */

function applyFilters() {

    resetResults();
    resetGraphs();

    var url = "https://hotcat.de:1337/api/v0/ciphers/summary";
    var tldSelection = document.getElementById("filterTLD").value;

    if (tldSelection !== "") {
        tldSelection = tldSelection.replace('.', '');
        url += "?tld=" + tldSelection;
    }

    var protocol = document.getElementById("filterProtocol").value;
    var cipherString = document.getElementById("displayFilterSelection").innerHTML;
    var httpClient = new HttpClient();

    if (httpResponse === undefined || httpResponse === null) {
        httpClient.get(url, setHttpResponse);
    }

    displayWarning();
    enableButtons();

    return parseResponse(httpResponse, protocol, cipherString);

}


/*
 * Another main function called by the "applyFilters()" method above. "parseResponse()"
 * is, as the name suggests, responsible for parsing the HTTP response of the database's 
 * communication end point acquired during execution of the "applyFilters()" function.
 * According to the user's input not only concerning the cipher suite itself, but 
 * possibly also considering a specified time interval that prevents data out of the
 * interval from being evaluated in the first place, "parseResponse()" aggregates host
 * counts for each month present in the HTTP response while also taking into consideration
 * the currently selected execution mode ("match literally" or "match as part of a larger
 * cipher string").
 * 
 * @param {type} response - The HTTP response delivered by the database's end point.
 * @param {type} protocol - Protocol originally selected by the user. May be null.
 * @param {type} cipherString - The cipher suite provided by the user. May be null.
 * 
 * @returns {parseResponse.filterDataAnonym$1} - An object consisting of all possible
 * result arrays. Depending on the user's selections, arrays returned may be empty. 
 */

function parseResponse(response, protocol, cipherString) {

    months.push('x');
    totalHosts.push('Total Number of Hosts');

    if (response === undefined || response === null) {
        return null;
    }

    var matchLiterally = false;
    if (document.getElementById("matchingKindLiteral").checked) {
        cipherString = "\"" + cipherString + "\"";
        matchLiterally = true;
    }

    var startDate;
    var endDate;

    if (document.getElementById("startDate").value !== "") {
        startDate = new Date(getInternalDate(document.getElementById("startDate").value));
    }
    if (document.getElementById("endDate").value !== "") {
        endDate = new Date(getInternalDate(document.getElementById("endDate").value));
    }

    /*
     * Pushes all such months to the "months" array that lie within the time interval
     * specified by the user. If neither a start date nor an end date was specified, 
     * all months present in the HTTP response are processed.
     * 
     */
    var allMonths = response.match(/month.:.(\d*).(\d*)/g);
    var inInterval = false;
    var startIndex = 1;
    var endIndex = allMonths.length;
    for (var i = 0; i < allMonths.length; i++) {
        var month = allMonths[i];
        var primitiveMonthCandidate = month.split(":")[1].replace('"', '');
        var monthCandidate = new Date(getInternalDate(primitiveMonthCandidate));
        if ((startDate !== undefined && Date.parse(startDate) <= Date.parse(monthCandidate)) || startDate === undefined) {
            if (!inInterval) {
                startIndex = i + 1;
            }
            inInterval = true;
            months.push(primitiveMonthCandidate);
        }
        if (endDate !== undefined && Date.parse(monthCandidate) >= Date.parse(endDate) && inInterval) {
            endIndex = i + 1;
            break;
        }
    }
    inInterval = false;

    /*
     * Pushes the number of total hosts to the "totalHosts" aray according the the time
     * interval possibly specified; again if no time span is given, entries for each
     * and every month are pushed to the array.
     * 
     */
    var allTotalHosts = response.match(/totalHosts.:.(\d*)/g);
    for (var i = 0; i < allTotalHosts.length; i++) {
        var number = allTotalHosts[i].split(":")[1];
        if ((startDate !== undefined && startIndex <= i + 1) || startDate === undefined) {
            if (!inInterval) {
                inInterval = true;
            }
            totalHosts.push(number);
        }
        if (endDate !== undefined && i + 1 === endIndex && inInterval) {
            break;
        }
    }

    /*
     * Initiates the actual process of data filtering by calling "insertEntry()"
     * if and only if the set of entries ("allOuterEntries") belongs to a month that
     * lies within the boundaries of a possibly specified time span (no time span
     * given leads to all sets of entries being considered).
     * 
     */
    inInterval = false;
    var manualProtocolAggregation = protocol === "" ? true : false;
    initResultArrays(months.length, matchLiterally, manualProtocolAggregation);
    var monthSkipped = true;

    var loops = 0;
    var allOuterEntries = response.match(/\[[^\[\]]*\]/g);
    for (var i = 0; i < allOuterEntries.length; i++) {
        var outer = allOuterEntries[i];
        if (startDate !== undefined && startIndex <= i + 1 || startDate === undefined) {
            if (!inInterval) {
                inInterval = true;
                monthSkipped = false;
            }
            insertEntry(outer, manualProtocolAggregation, matchLiterally, protocol, cipherString, loops);
        }
        if (endDate !== undefined && i + 1 === endIndex && inInterval) {
            break;
        }
        if (!monthSkipped) {
            loops++;
        }
    }

    for (var i = 1; i < months.length; i++) {
        var tmp = months[i].replace('_', '-');
        months[i] = tmp + "-01";
    }

    setHttpResponse(null);

    filterResultArrays();

    return {
        months: months,
        totalHosts: totalHosts,
        manualProtocolAggregation: manualProtocolAggregation,
        hostsAccepting: hostsAccepting,
        hostsPreferring: hostsPreferring,
        hostsAcceptingSSL2: hostsAcceptingSSL2,
        hostsPreferringSSL2: hostsPreferringSSL2,
        hostsAcceptingSSL3: hostsAcceptingSSL3,
        hostsPreferringSSL3: hostsPreferringSSL3,
        hostsAcceptingTLS1: hostsAcceptingTLS1,
        hostsPreferringTLS1: hostsPreferringTLS1,
        hostsAcceptingTLS11: hostsAcceptingTLS11,
        hostsPreferringTLS11: hostsPreferringTLS11,
        hostsAcceptingTLS12: hostsAcceptingTLS12,
        hostsPreferringTLS12: hostsPreferringTLS12,
        totalCiphersAccepting: totalCiphersAccepting,
        totalCiphersPreferring: totalCiphersPreferring
    };

}


/*
 * Function responsible for inserting entries into result arrays by calling further
 * delegate functions if certain conditions are evaluated to be true. The function
 * distinguishes four cases in total that exactly represent the selections a user
 * is provided with, namely (1) the user provided a protocol and (1.1) wants the 
 * specified cipher suite to be matched literally or (1.2) to be matched as part 
 * of a larger cipher string. On the other hand, (2) if no protocol was given, both
 * execution modes have to be considered separately again similar to case (1), namely 
 * (2.1) and (2.2). The conditions that have to be true for an entry in order to 
 * actually be pushed to a result array are as follows: For case (1.1), both the
 * protocol and the cipher string must match the entry in question, whereas in 
 * case (1.2) the protocol and the several parts of the cipher string must match.
 * In case the user has not specified a protocol (2), the two operation modes are 
 * represented similarly ((2.1), (2.2)).
 * 
 * @param {type} outer - Cipher suite entries for one entire month.
 * @param {type} manualProtocolAggregation - True if a user has not specified a protocol,
 * false otherwise.
 * @param {type} matchLiterally - True if the user wants the cipher suite he provided
 * to be matched literally, false otherwise.
 * @param {type} protocol - The protocol a user has provided. May be null.
 * @param {type} cipherString - The cipher suite a user has provided. May be null.
 * @param {type} loops - Number of times the function was already called, providing for
 * index synchronisation within the result arrays.
 * 
 * @returns {undefined}
 */

function insertEntry(outer, manualProtocolAggregation, matchLiterally, protocol, cipherString, loops) {

    loops++;
    outer.match(/{(.*?)}/g).forEach(function (inner) {
        if (!manualProtocolAggregation) {
            /*
             * 1
             */
            if (matchLiterally) {
                /*
                 * 1.1
                 */
                if (inner.match("\"" + protocol + "\"") !== null && inner.match(cipherString) !== null) {
                    writeToHosts(loops, inner);
                }
            } else {
                /*
                 * 1.2
                 */
                writeToTotalCiphers(loops, inner);
                if (inner.match("\"" + protocol + "\"") !== null && testIfPartsMatch(inner, cipherString)) {
                    writeToHosts(loops, inner);
                }
            }
        } else {
            /*
             * 2
             */
            if (!matchLiterally) {
                /*
                 * 2.2
                 */
                writeToTotalCiphers(loops, inner);
            }
            if (inner.match(cipherString) !== null || (!matchLiterally && testIfPartsMatch(inner, cipherString))) {
                /*
                 * 2.1 || 2.2
                 */
                if (inner.match(/.protocol.:.([A-Z || v || \. || \d]*)/g) !== null) {
                    writeToHostsByProtocol(loops, inner);
                    writeToHosts(loops, inner);
                }
            }
        }
    });

}


/*
 * Transforms a given date from the format provided by the HTTP response into
 * JavaScript date format so that it can be used as a parameter to the "Date.parse()"
 * function.
 * 
 * @param {type} date - Date that is to be transformed.
 * 
 * @returns {undefined}
 */

function getInternalDate(date) {

    var tmpMonth;
    var tmpYear;

    if (date.indexOf("_") > -1) {
        tmpMonth = date.split("_")[1];
        tmpYear = date.split("_")[0];
    } else {
        tmpMonth = date.split("-")[0];
        tmpYear = date.split("-")[1];
    }

    return tmpYear.concat("-").concat(tmpMonth);
}


/*
 * Populates the result arrays with a short description of the data that will be written
 * to the former later in the process as well as with zeros based on the number of months
 * that is to be considered. The graph library used in "filterciphers.html" 
 * will use the descriptions to label the data that gets saved along with them.
 * 
 * @param {type} months - The number of months to be considered.
 * @param {type} matchLiterally - Indicates the current operation mode of the application
 * ("match literally" or "match as part of a larger cipher string").
 * @param {type} manualProtocolAggregation - True if a user has not specified a protocol,
 * false otherwise.
 * 
 * @returns {undefined}
 */

function initResultArrays(months, matchLiterally, manualProtocolAggregation) {

    for (var i = 0; i < months; i++) {
        hostsAccepting.push(0);
        hostsPreferring.push(0);
        hostsAcceptingSSL2.push(0);
        hostsPreferringSSL2.push(0);
        hostsAcceptingSSL3.push(0);
        hostsPreferringSSL3.push(0);
        hostsAcceptingTLS1.push(0);
        hostsPreferringTLS1.push(0);
        hostsAcceptingTLS11.push(0);
        hostsPreferringTLS11.push(0);
        hostsAcceptingTLS12.push(0);
        hostsPreferringTLS12.push(0);
        totalCiphersAccepting.push(0);
        totalCiphersPreferring.push(0);
    }

    hostsAccepting[0] = matchLiterally ? 'Hosts Accepting' :
            (manualProtocolAggregation ? 'Matching: Cipher Suites Accepted (All Protocols)' : 'Cipher Suites Accepted');
    hostsPreferring[0] = matchLiterally ? 'Hosts Preferring' :
            (manualProtocolAggregation ? 'Matching: Cipher Suites Preferred (All Protocols)' : 'Cipher Suites Preferred');
    hostsPreferringSSL2[0] = matchLiterally ? 'Hosts Preferring (SSLv2)' : 'Preferred (SSLv2)';
    hostsAcceptingSSL2[0] = matchLiterally ? 'Hosts Accepting (SSLv2)' : 'Accepted (SSLv2)';
    hostsPreferringSSL3[0] = matchLiterally ? 'Hosts Preferring (SSLv3)' : 'Preferred (SSLv3)';
    hostsAcceptingSSL3[0] = matchLiterally ? 'Hosts Accepting (SSLv3)' : 'Accepted (SSLv3)';
    hostsPreferringTLS1[0] = matchLiterally ? 'Hosts Preferring (TLSv1.0)' : 'Preferred (TLSv1.0)';
    hostsAcceptingTLS1[0] = matchLiterally ? 'Hosts Accepting (TLSv1.0)' : 'Accepted (TLSv1.0)';
    hostsPreferringTLS11[0] = matchLiterally ? 'Hosts Preferring (TLSv1.1)' : 'Preferred (TLSv1.1)';
    hostsAcceptingTLS11[0] = matchLiterally ? 'Hosts Accepting (TLSv1.1)' : 'Accepted (TLSv1.1)';
    hostsPreferringTLS12[0] = matchLiterally ? 'Hosts Preferring (TLSv1.2)' : 'Preferred (TLSv1.2)';
    hostsAcceptingTLS12[0] = matchLiterally ? 'Hosts Accepting (TLSv1.2)' : 'Accepted (TLSv1.2)';
    totalCiphersAccepting[0] = "Total: Cipher Suites Accepted";
    totalCiphersPreferring[0] = "Total: Cipher Suites Preferred";

}


/*
 * Considers every result array and clears it to be an empty array if it only 
 * contains zeros.
 * 
 * @returns {undefined}
 */

function filterResultArrays() {

    var hasNonZeroElements = false;

    for (var i = 1; i < hostsAccepting.length; i++) {
        if (hostsAccepting[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsAccepting = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsPreferring.length; i++) {
        if (hostsPreferring[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsPreferring = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsAcceptingSSL2.length; i++) {
        if (hostsAcceptingSSL2[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsAcceptingSSL2 = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsPreferringSSL2.length; i++) {
        if (hostsPreferringSSL2[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsPreferringSSL2 = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsAcceptingSSL3.length; i++) {
        if (hostsAcceptingSSL3[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsAcceptingSSL3 = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsPreferringSSL3.length; i++) {
        if (hostsPreferringSSL3[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsPreferringSSL3 = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsAcceptingTLS1.length; i++) {
        if (hostsAcceptingTLS1[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsAcceptingTLS1 = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsPreferringTLS1.length; i++) {
        if (hostsPreferringTLS1[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsPreferringTLS1 = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsAcceptingTLS11.length; i++) {
        if (hostsAcceptingTLS11[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsAcceptingTLS11 = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsPreferringTLS11.length; i++) {
        if (hostsPreferringTLS11[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsPreferringTLS11 = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsAcceptingTLS12.length; i++) {
        if (hostsAcceptingTLS12[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsAcceptingTLS12 = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < hostsPreferringTLS12.length; i++) {
        if (hostsPreferringTLS12[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        hostsPreferringTLS12 = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < totalCiphersAccepting.length; i++) {
        if (totalCiphersAccepting[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        totalCiphersAccepting = [];
    } else {
        hasNonZeroElements = false;
    }

    for (var i = 1; i < totalCiphersPreferring.length; i++) {
        if (totalCiphersPreferring[i] !== 0) {
            hasNonZeroElements = true;
            break;
        }
    }
    if (!hasNonZeroElements) {
        totalCiphersPreferring = [];
    }

}


/*
 * Determines if a certain cipher suite entry contains all parts of the cipher suite
 * specified by the user. This function is used as soon as a user-specified filter is
 * to be applied in the application's "match as part of a larger cipher string" 
 * operation mode. If the several parts of the user-provided cipher suite are contained
 * in the questionable month entry, its number of hosts can be considered in the final
 * result displayed to the user.
 * 
 * @param {type} match - A match within the current month.
 * @param {type} cipherString - The user-provided cipher suite.
 * 
 * @returns {Boolean} True if "match" contains all parts of the user-provided cipher suite,
 * false otherwise.
 */
function testIfPartsMatch(match, cipherString) {
    match = ("" + match.match(/cipher.:.(.*,)/g) + "").split(":")[1];
    var cipherParts = cipherString.split(" ");
    for (var i = 0; i < cipherParts.length; i++) {
        if (match.match(cipherParts[i]) === null) {
            return false;
        }
    }
    return true;
}


/*
 * Writes the host count of a certain match to "totalCiphersPreferring" (in case the
 * status of the cipher suite on the host was "preferred") or "totalCiphersAccepting"
 * (in case the status of the cipher suite on the host was "accepted").
 * 
 * @param {type} currentMonth - Current month considered, thus the index of the result array
 * the host count is written to.
 * @param {type} match - The month's match containing the host count.
 * 
 * @returns {undefined}
 */
function writeToTotalCiphers(currentMonth, match) {
    var count = parseInt(("" + match.match(/.count.:(\d*)/g) + "").split(":")[1]);
    if (match.indexOf("preferred") > -1) {
        totalCiphersPreferring[currentMonth] += count;
    } else {
        totalCiphersAccepting[currentMonth] += count;
    }

}


/*
 * Writes the host count of a certain match to "hostsPreferring" (in case the
 * status of the cipher suite on the host was "preferred") or "hostsAccepting"
 * (in case the status of the cipher suite on the host was "accepted").
 * 
 * @param {type} currentMonth - Current month considered, thus the index of the result array
 * the host count is written to.
 * @param {type} match - The month's match containing the host count.
 * 
 * @returns {undefined}
 */
function writeToHosts(currentMonth, match) {
    var count = parseInt(("" + match.match(/.count.:(\d*)/g) + "").split(":")[1]);
    if (match.indexOf("preferred") > -1) {
        hostsPreferring[currentMonth] += count;
    } else {
        hostsAccepting[currentMonth] += count;
    }
}


/*
 * Writes the host count of a certain match to result arrays according to the protocol
 * contained in "match" and according to the cipher suite's status on the host (either
 * "accepted" or "prefererred").
 * 
 * @param {type} currentMonth - Current month considered, thus the index of the result array
 * the host count is written to.
 * @param {type} match - The month's match containing the host count as well as the protocol.
 * 
 * @returns {undefined}
 */

function writeToHostsByProtocol(currentMonth, match) {
    var count = parseInt(("" + match.match(/.count.:(\d*)/g) + "").split(":")[1]);
    var protocol = ("" + match.match(/.protocol.:.([A-Z || v || \. || \d]*)/g) + "").split(":")[1].replace('"', '');
    switch (protocol) {
        case "SSLv2":
            if (match.indexOf("preferred") > -1) {
                hostsPreferringSSL2[currentMonth] += count;
            } else {
                hostsAcceptingSSL2[currentMonth] += count;
            }
            break;
        case "SSLv3":
            if (match.indexOf("preferred") > -1) {
                hostsPreferringSSL3[currentMonth] += count;
            } else {
                hostsAcceptingSSL3[currentMonth] += count;
            }
            break;
        case "TLSv1.0":
            if (match.indexOf("preferred") > -1) {
                hostsPreferringTLS1[currentMonth] += count;
            } else {
                hostsAcceptingTLS1[currentMonth] += count;
            }
            break;
        case "TLSv1.1":
            if (match.indexOf("preferred") > -1) {
                hostsPreferringTLS11[currentMonth] += count;
            } else {
                hostsAcceptingTLS11[currentMonth] += count;
            }
            break;
        case "TLSv1.2":
            if (match.indexOf("preferred") > -1) {
                hostsPreferringTLS12[currentMonth] += count;
            } else {
                hostsAcceptingTLS12[currentMonth] += count;
            }
            break;
        default:
            //Well, shit.
    }

}


/*
 * Function called as soon as one of the "Remember Graph" buttons is pushed. It inserts
 * the graph itself as well as its description text in the according arrays, hides the
 * warning that was previously displayed in case a user hit the "Show Graphs" button while
 * there was no graphs available, and finally disables the button for the graph that was
 * just saved to the "graphsToRemember" array so that the same graph cannot be inserted
 * more than one time.
 *         
 * @param {type} labelText - Description text shown along with the graph.
 * @param {type} graph - The graph to be remembered.
 * @param {type} button - "Remember Graph" button to be disabled.
 * 
 * @returns {undefined} 
 */

function rememberGraph(labelText, graph, button) {
    labelsToRemember.push(labelText);
    graphsToRemember.push(graph);
    displayWarningNoGraphs(false);
    button.disabled = true;
}


/*
 * Returns all previously saved graphs along with their descriptions.
 * 
 * @returns {getRememberedElements.filterDataAnonym$2} - Previously remembered graphs
 * as well as their descriptions.
 */

function getRememberedElements() {
    return {
        labels: labelsToRemember,
        graphs: graphsToRemember
    };
}


/*
 * Empties both the array of saved descriptions as well as the array of saved graphs, 
 * thus making the application "forget" all graphs.
 *  
 * @returns {undefined} 
 */

function forgetGraphs() {
    labelsToRemember = [];
    graphsToRemember = [];
    enableButtons();
}


/*
 * Hides or shows elements in conjunction with displaying or hiding a subpage in form of
 * an HTML "iframe" element containing all remembered graphs along with their descriptions.
 * 
 * @param {type} makeVisible - True if the contents of "graphcomparison.html" are to be hidden,
 * making the elements of "filterciphers.html" visible again, false if the contrary case 
 * is desired.
 * 
 * @returns {undefined} 
 */

function manageElementVisibility(makeVisible) {
    if (makeVisible) {
        document.getElementById("detailedFilterColumn").style.cssText = "display: block";
        document.getElementById("nav01").style.cssText = "display: block";
        document.getElementById("filterBoxPanel").style.cssText = "display: block";
        document.getElementById("graphComparisonButtonPanel").style.cssText = "display: block";
        document.getElementById("footer").style.cssText = "display: block";
        document.getElementById("detailedFilterBody").style.cssText = "background-color: #ffffff";
        document.getElementById("displayGraphComparison").style.cssText = "display: none; z-index: -100";
    } else {
        document.getElementById("detailedFilterColumn").style.cssText = "display: none";
        document.getElementById("nav01").style.cssText = "display: none";
        document.getElementById("filterBoxPanel").style.cssText = "display: none";
        document.getElementById("graphComparisonButtonPanel").style.cssText = "display: none";
        document.getElementById("footer").style.cssText = "display: none";
        document.getElementById("detailedFilterBody").style.cssText = "background-color: #a0a0a0";
        document.getElementById("displayGraphComparison").style.cssText = "display: block;";
    }
}


/*
 * Resets all arrays containing any data related to filtering and aggregating results 
 * provided by the database's HTTP response.
 * 
 * @returns {undefined} 
 */

function resetResults() {

    months = [];
    totalHosts = [];
    hostsAccepting = [];
    hostsPreferring = [];

    hostsAcceptingSSL2 = [];
    hostsPreferringSSL2 = [];
    hostsAcceptingSSL3 = [];
    hostsPreferringSSL3 = [];
    hostsAcceptingTLS1 = [];
    hostsPreferringTLS1 = [];
    hostsAcceptingTLS11 = [];
    hostsPreferringTLS11 = [];
    hostsAcceptingTLS12 = [];
    hostsPreferringTLS12 = [];

    totalCiphersAccepting = [];
    totalCiphersPreferring = [];

}


/*
 * Used for resetting any filter settings and reverting the page's status to when
 * a user opened it for the first time.
 * 
 * @returns {undefined} 
 */

function resetFilters() {

    document.getElementById("displayFilterSelection").innerHTML = "[none]";

    resetGraphs();
    enableButtons();
    document.getElementById("matchingKindLiteral").checked = true;
    document.getElementById("matchingKindAsPart").checked = false;
    displayWarning();

}


/*
 * Resets all graphs possibly displayed to the user (meaning that afterwards a blank
 * white page is shown where the graphs were previously displayed).
 * 
 * @returns {undefined} 
 */

function resetGraphs() {

    document.getElementById("general").innerHTML = "";
    document.getElementById("lastMonth_General").innerHTML = "";
    document.getElementById("noCipherSuites_Accepted").innerHTML = "";
    document.getElementById("lastMonth_Accepted").innerHTML = "";
    document.getElementById("noCipherSuites_Preferred").innerHTML = "";
    document.getElementById("lastMonth_Preferred").innerHTML = "";

    hideRememberButtons();
    hideDescriptions();

}


/*
 * Hides the "Remember Graph" button for each graph.
 * 
 * @returns {undefined} 
 */

function hideRememberButtons() {
    document.getElementById("rememberGeneral").style.cssText = "display: none";
    document.getElementById("rememberLastMonth_General").style.cssText = "display: none";
    document.getElementById("rememberNoCipherSuites_Accepted").style.cssText = "display: none";
    document.getElementById("rememberLastMonth_Accepted").style.cssText = "display: none";
    document.getElementById("rememberNoCipherSuites_Preferred").style.cssText = "display: none";
    document.getElementById("rememberLastMonth_Preferred").style.cssText = "display: none";
}


/*
 * Enables the "Remember Graph" button for each graph.
 *  
 * @returns {undefined} 
 */

function enableButtons() {
    document.getElementById("rememberGeneral").disabled = false;
    document.getElementById("rememberLastMonth_General").disabled = false;
    document.getElementById("rememberNoCipherSuites_Accepted").disabled = false;
    document.getElementById("rememberLastMonth_Accepted").disabled = false;
    document.getElementById("rememberNoCipherSuites_Preferred").disabled = false;
    document.getElementById("rememberLastMonth_Preferred").disabled = false;
}


