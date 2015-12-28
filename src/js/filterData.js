
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

var graphsToRemember = [];


function setHttpResponse(response) {
    httpResponse = response;
}


function initFilters() {

    var protocol = document.getElementById("filterProtocol").value;
    var keyExAndAuth = document.getElementById("filterKeyExAndAuth").value;
    var bulkCipher = document.getElementById("filterCipher").value;
    var keyLen = document.getElementById("filterKeyLen").value;
    var msgAuth = document.getElementById("filterMsgAuth").value;

    if (protocol === "" && keyExAndAuth === "" && bulkCipher === "" && keyLen === ""
            && msgAuth === "") {
        document.getElementById("keyExAuth").innerHTML = getKeyAndAuth("all");
        document.getElementById("cipher").innerHTML = getCiphers("all");
        document.getElementById("keyLen").innerHTML = getKeyLengths("all", "all");
        document.getElementById("msgAuth").innerHTML = getMsgAuth("all");
        document.getElementById("displayFilterSelection").innerHTML = "[none]";
    }


}

function manageFilterSelection() {

    var cipherSelection = document.getElementById("filterCipher").value;
    var protocolSelection = document.getElementById("filterProtocol").value;

    document.getElementById("keyExAuth").innerHTML = getKeyAndAuth(protocolSelection);
    document.getElementById("cipher").innerHTML = getCiphers(protocolSelection);
    document.getElementById("keyLen").innerHTML = getKeyLengths(protocolSelection, cipherSelection);
    document.getElementById("msgAuth").innerHTML = getMsgAuth(protocolSelection);

    displayFilter();

}

function displayFilter() {

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


        document.getElementById("displayFilterSelection").innerHTML = cipherString;
    }
}

function displayWarning() {

    if (document.getElementById("matchingKindAsPart").checked) {
        document.getElementById("warningMessage").style = "text-align: center; display: block; padding-top: 30px";
    } else {
        document.getElementById("warningMessage").style = "text-align: center; display: none";
    }

}

function displayWarningNoGraphs(makeVisibile){
    if(makeVisibile){
        document.getElementById("warningMessageNoGraphs").style = "text-align: center; display: block; padding-top: 30px";
    }else{
        document.getElementById("warningMessageNoGraphs").style.display = "none";
    }
}


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

    response.match(/month.:.(\d*).(\d*)/g).forEach(function (month) {
        months.push(month.split(":")[1].replace('"', ''));
    });

    response.match(/totalHosts.:.(\d*)/g).forEach(function (number) {
        totalHosts.push(number.split(":")[1]);
    });



    var count = 0;
    var loops = 0;
    var manualProtocolAggregation = protocol === "" ? true : false;

    initResultArrays(months.length, matchLiterally, manualProtocolAggregation);
    monthBody = response.match(/\[[^\[\]]*\]/g);
    monthBody.forEach(function (outer) {
        outer.match(/{(.*?)}/g).forEach(function (inner) {
            if (!manualProtocolAggregation) {
                if (matchLiterally) {
                    if (inner.match("\"" + protocol + "\"") !== null && inner.match(cipherString) !== null) {
                        writeToHosts(loops, inner, matchLiterally);
                    }
                } else {
                    writeToTotalCiphers(loops, inner);
                    if (inner.match("\"" + protocol + "\"") !== null && testIfPartsMatch(inner, cipherString)) {
                        writeToHosts(loops, inner, matchLiterally);
                    }
                }
            } else {
                if (!matchLiterally) {
                    writeToTotalCiphers(loops, inner);
                }
                if (inner.match(cipherString) !== null || (!matchLiterally && testIfPartsMatch(inner, cipherString))) {
                    if (inner.match(/.protocol.:.([A-Z || v || \. || \d]*)/g) !== null) {
                        writeToHostsByProtocol(loops, inner);
                        writeToHosts(loops, inner, matchLiterally);
                    }
                }
            }
        });
        loops++;
    });

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

function writeToTotalCiphers(currentMonth, match) {
    currentMonth = parseInt(currentMonth);
    currentMonth++;
    count = parseInt(("" + match.match(/.count.:(\d*)/g) + "").split(":")[1]);
    if (match.indexOf("preferred") > -1) {
        totalCiphersPreferring[currentMonth] += count;
    } else {
        totalCiphersAccepting[currentMonth] += count;
    }

}

function writeToHosts(currentMonth, match, matchLiterally) {
    currentMonth = parseInt(currentMonth);
    currentMonth++;
    count = parseInt(("" + match.match(/.count.:(\d*)/g) + "").split(":")[1]);
    if (match.indexOf("preferred") > -1) {
        hostsPreferring[currentMonth] += count;
    } else {
        hostsAccepting[currentMonth] += count;
    }
}

function writeToHostsByProtocol(currentMonth, match) {
    currentMonth = parseInt(currentMonth);
    currentMonth++;
    count = parseInt(("" + match.match(/.count.:(\d*)/g) + "").split(":")[1]);
    protocol = ("" + match.match(/.protocol.:.([A-Z || v || \. || \d]*)/g) + "").split(":")[1].replace('"', '');
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


function rememberGraph(graph, button) {
    graphsToRemember.push(graph);
    displayWarningNoGraphs(false);
    button.disabled = true;
}

function getRememberedGraphs() {
    return graphsToRemember;
}

function forgetGraphs(){
    graphsToRemember = [];
    enableButtons();
}

function manageElementVisibility(makeVisible) {
    if (makeVisible) {
        document.getElementById("detailedFilterColumn").style.display = "block";
        document.getElementById("nav01").style.display = "block";
        document.getElementById("filterBoxPanel").style.display = "block";
        document.getElementById("graphComparisonButtonPanel").style.display = "block";
        document.getElementById("footer").style.display = "block";
        document.getElementById("detailedFilterBody").style = "background-color: #ffffff";
        document.getElementById("displayGraphComparison").style = "display: none; z-index: -100";
    } else {
        document.getElementById("detailedFilterColumn").style.display = "none";
        document.getElementById("nav01").style.display = "none";
        document.getElementById("filterBoxPanel").style.display = "none";
        document.getElementById("graphComparisonButtonPanel").style.display = "none";
        document.getElementById("footer").style.display = "none";
        document.getElementById("detailedFilterBody").style = "background-color: #a0a0a0";
        document.getElementById("displayGraphComparison").style = "display: block;";
    }
}



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

function resetFilters() {

    document.getElementById("keyExAuth").innerHTML = getKeyAndAuth("all");
    document.getElementById("cipher").innerHTML = getCiphers("all");
    document.getElementById("keyLen").innerHTML = getKeyLengths("all");
    document.getElementById("msgAuth").innerHTML = getMsgAuth("all");

    document.getElementById("displayFilterSelection").innerHTML = "[none]";

    resetGraphs();
    enableButtons();

}

function resetGraphs() {

    document.getElementById("general").innerHTML = "";
    document.getElementById("lastMonth_General").innerHTML = "";
    document.getElementById("noCipherSuites_Accepted").innerHTML = "";
    document.getElementById("lastMonth_Accepted").innerHTML = "";
    document.getElementById("noCipherSuites_Preferred").innerHTML = "";
    document.getElementById("lastMonth_Preferred").innerHTML = "";

    resetButtons();

}

function resetButtons() {
    document.getElementById("rememberGeneral").style.display = "none";
    document.getElementById("rememberLastMonth_General").style.display = "none";
    document.getElementById("rememberNoCipherSuites_Accepted").style.display = "none";
    document.getElementById("rememberLastMonth_Accepted").style.display = "none";
    document.getElementById("rememberNoCipherSuites_Preferred").style.display = "none";
    document.getElementById("rememberLastMonth_Preferred").style.display = "none";
}

function enableButtons(){
    document.getElementById("rememberGeneral").disabled = false;
    document.getElementById("rememberLastMonth_General").disabled = false;
    document.getElementById("rememberNoCipherSuites_Accepted").disabled = false;
    document.getElementById("rememberLastMonth_Accepted").disabled = false;
    document.getElementById("rememberNoCipherSuites_Preferred").disabled = false;
    document.getElementById("rememberLastMonth_Preferred").disabled = false;
}

function getKeyAndAuth(protocolSelection) {

    if (protocolSelection === "SSLv2") {
        return "<option value=\"EXP\"></option>\n\
                <option value=\"RSA\"></option>";
    } else if (protocolSelection === "SSLv3") {
        return "<option value=\"EXP\"></option>\n\
                      <option value=\"RSA\"></option>\n\
                      <option value=\"DH-DSS\"></option>\n\
                      <option value=\"DH-RSA\"></option>\n\
                      <option value=\"DHE-DSS\"></option>\n\
                      <option value=\"DHE-RSA\"></option>\n\
                      <option value=\"DH-anon\"></option>\n\
                      <option value=\"DH-anon-EXP\"></option>\n\
                      <option value=\"ECDHE-RSA\"></option>";
    } else if (protocolSelection === "TLSv1.0" || protocolSelection === "TLSv1.1"
            || protocolSelection === "TLSv1.2") {
        return "<option value=\"AECDH\"></option>\n\
                    <option value=\"RSA\"></option>\n\
                     <option value=\"DH-RSA\"></option>\n\
                     <option value=\"DHE-RSA\"></option>\n\
                     <option value=\"ECDH-RSA\"></option>\n\
                     <option value=\"ECDHE-RSA\"></option>\n\
                     <option value=\"EDH-RSA\"></option>\n\
                     <option value=\"DH-DSS\"></option>\n\
                     <option value=\"DHE-DSS\"></option>\n\
                     <option value=\"ECDH-ECDSA\"></option>\n\
                     <option value=\"ECDHE-ECDSA\"></option>\n\
                     <option value=\"PSK\"></option>\n\
                     <option value=\"PSK-RSA\"></option>\n\
                     <option value=\"DHE-PSK\"></option>\n\
                     <option value=\"ECDHE-PSK\"></option>\n\
                     <option value=\"SRP\"></option>\n\
                     <option value=\"SRP-DSS\"></option>\n\
                     <option value=\"SRP-RSA\"></option>\n\
                     <option value=\"KERBEROS\"></option>\n\
                     <option value=\"DH-ANON\"></option>\n\
                     <option value=\"ECDH-ANON\"></option>\n\
                     <option value=\"GOST\"></option>";
    } else {
        return "<option value=\"AECDH\"></option>\n\
                     <option value=\"RSA\"></option>\n\
                     <option value=\"DH-RSA\"></option>\n\
                     <option value=\"DHE-RSA\"></option>\n\
                     <option value=\"ECDH-RSA\"></option>\n\
                     <option value=\"ECDHE-RSA\"></option>\n\
                     <option value=\"EDH-RSA\"></option>\n\
                     <option value=\"DH-DSS\"></option>\n\
                     <option value=\"DHE-DSS\"></option>\n\
                     <option value=\"ECDH-ECDSA\"></option>\n\
                     <option value=\"ECDHE-ECDSA\"></option>\n\
                     <option value=\"PSK\"></option>\n\
                     <option value=\"PSK-RSA\"></option>\n\
                     <option value=\"DHE-PSK\"></option>\n\
                     <option value=\"ECDHE-PSK\"></option>\n\
                     <option value=\"SRP\"></option>\n\
                     <option value=\"SRP-DSS\"></option>\n\
                     <option value=\"SRP-RSA\"></option>\n\
                     <option value=\"KERBEROS\"></option>\n\
                     <option value=\"DH-ANON\"></option>\n\
                     <option value=\"ECDH-ANON\"></option>\n\
                     <option value=\"GOST\"></option>";
    }
}

function getCiphers(protocolSelection) {

    if (protocolSelection === "SSLv2") {
        return "<option value=\"DES-CBC3\"></option>\n\
                        <option value=\"IDEA-CBC\"></option>\n\
                        <option value=\"DES-CBC\"></option>\n\
                        <option value=\"RC2-CBC\"></option>\n\
                        <option value=\"RC4\"></option>";
    } else if (protocolSelection === "SSLv3") {
        return "<option value=\"AES\"></option>\n\
                        <option value=\"DES-CBC3\"></option>\n\
                        <option value=\"IDEA-CBC\"></option>\n\
                        <option value=\"DES-CBC\"></option>\n\
                        <option value=\"RC2-CBC\"></option>\n\
                        <option value=\"RC4\"></option>\n\
                        <option value=\"none\"></option>";
    } else if (protocolSelection === "TLSv1.0") {
        return "<option value=\"AES\"></option>\n\
                                <option value=\"AES-CBC\">\n\
                                <option value=\"CAMELLIA-CBC\"></option>\n\
                                <option value=\"ARIA-CBC\"></option>\n\
                                <option value=\"SEED-CBC\"></option>\n\
                                <option value=\"DES-CBC3\"></option>\n\
                                <option value=\"GOST-28147-89-CNT\"></option>\n\
                                <option value=\"IDEA-CBC\"></option>\n\
                                <option value=\"DES-CBC\"></option>\n\
                                <option value=\"RC2-CBC\"></option>\n\
                                <option value=\"RC4\"></option>\n\
                                <option value=\"none\"></option>";
    } else if (protocolSelection === "TLSv1.1") {
        return "<option value=\"AES\"></option>\n\
                                <option value=\"AES-CBC\">\n\
                                <option value=\"CAMELLIA\"></option>\n\
                                <option value=\"CAMELLIA-CBC\"></option>\n\
                                <option value=\"ARIA-CBC\"></option>\n\
                                <option value=\"SEED-CBC\"></option>\n\
                                <option value=\"DES-CBC3\"></option>\n\
                                <option value=\"GOST-28147-89-CNT\"></option>\n\
                                <option value=\"IDEA-CBC\"></option>\n\
                                <option value=\"DES-CBC\"></option>\n\
                                <option value=\"RC4\"></option>\n\
                                <option value=\"none\"></option>";
    } else if (protocolSelection === "TLSv1.2") {
        return "<option value=\"AES\"></option>\n\
                                <option value=\"AES-GCM\"></option>\n\
                                <option value=\"AES-CCM\"></option>\n\
                                <option value=\"AES-CBC\"></option>\n\
                                <option value=\"CAMELLIA\"></option>\n\
                                <option value=\"CAMELLIA-GCM\"></option>\n\
                                <option value=\"CAMELLIA-CBC\"></option>\n\
                                <option value=\"ARIA-GCM\"></option>\n\
                                <option value=\"ARIA-CBC\"></option>\n\
                                <option value=\"SEED-CBC\"></option>\n\
                                <option value=\"DES-CBC3\"></option>\n\
                                <option value=\"GOST-28147-89-CNT\"></option>\n\
                                <option value=\"ChaCha-20-POLY1305\"></option>\n\
                                <option value=\"RC4\"></option>\n\
                                <option value=\"none\"></option>";
    } else {
        return "<option value=\"AES\"></option>\n\
                                <option value=\"AES-GCM\"></option>\n\
                                <option value=\"AES-CCM\"></option>\n\
                                <option value=\"AES-CBC\"></option>\n\
                                <option value=\"CAMELLIA\"></option>\n\
                                <option value=\"CAMELLIA-GCM\"></option>\n\
                                <option value=\"CAMELLIA-CBC\"></option>\n\
                                <option value=\"ARIA-GCM\"></option>\n\
                                <option value=\"ARIA-CBC\"></option>\n\
                                <option value=\"SEED-CBC\"></option>\n\
                                <option value=\"DES-CBC3\"></option>\n\
                                <option value=\"GOST-28147-89-CNT\"></option>\n\
                                <option value=\"IDEA-CBC\"></option>\n\
                                <option value=\"DES-CBC\"></option>\n\
                                <option value=\"RC2-CBC\"></option>\n\
                                <option value=\"ChaCha-20-POLY1305\"></option>\n\
                                <option value=\"RC4\"></option>\n\
                                <option value=\"none\"></option>";
    }
}

function getKeyLengths(protocolSelection, cipherSelection) {

    if (cipherSelection === "AES" || cipherSelection === "AES-GCM" || cipherSelection === "AES-CCM"
            || cipherSelection === "AES-CBC" || cipherSelection === "CAMELLIA"
            || cipherSelection === "CAMELLIA-GCM" || cipherSelection === "CAMELLIA-CBC"
            || cipherSelection === "ARIA-GCM" || cipherSelection === "ARIA-CBC") {
        return "<option value=\"128\">\n\
                <option value=\"256\">";
    } else if (cipherSelection === "SEED-CBC" || cipherSelection === "IDEA-CBC") {
        return "<option value=\"128\">";
    } else if (cipherSelection === "DES-CBC3") {
        return "<option value=\"112\">";
    } else if (cipherSelection === "GOST-28147-89-CNT") {
        return "<option value=\"256\">";
    } else if (cipherSelection === "DES-CBC") {
        if (protocolSelection === "TLSv1.1") {
            return "<option value=\"56\">";
        } else {
            return "<option value=\"40\">\n\
                <option value=\"56\">";
        }
    } else if (cipherSelection === "RC2-CBC") {
        return "<option value=\"40\">";
    } else if (cipherSelection === "ChaCha-20-POLY1305") {
        return "<option value=\"256\">";
    } else if (cipherSelection === "RC4") {
        if (protocolSelection === "TLSv1.1" || protocolSelection === "TLSv1.2") {
            return "<option value=\"128\">";
        } else {
            return "option value=\"40\">\n\
                    option value=\"128\">";
        }
    } else {
        return "<option value=\"40\">\n\
                <option value=\"56\">\n\
                <option value=\"112\">\n\
                <option value=\"128\">\n\
                <option value=\"256\">";
    }

}

function getMsgAuth(protocolSelection) {

    if (protocolSelection === "SSLv2") {
        return "<option value=\"MD5\">";
    } else if (protocolSelection === "SSLv3" || protocolSelection === "TLSv1.0"
            || protocolSelection === "TLSv1.1") {
        return "<option value=\"MD5\">\n\
                <option value=\"SHA\">\n\
                <option value=\"SHA1\">\n\
                <option value=\"GOST-28147-89-IMIT\">\n\
                <option value=\"GOST-R34.11-94\">";
    } else {
        return "<option value=\"MD5\">\n\
                <option value=\"SHA\">\n\
                <option value=\"SHA1\">\n\
                <option value=\"SHA256\">\n\
                <option value=\"SHA384\">\n\
                <option value=\"AEAD\">\n\
                <option value=\"GOST-28147-89-IMIT\">\n\
                <option value=\"GOST-R34.11-94\">";
    }

}
