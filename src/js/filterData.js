/*
 var HttpClient = function () {
 this.get = function (url, callback, protocol, cipherString) {
 var httpRequest = new XMLHttpRequest();
 httpRequest.onreadystatechange = function () {
 if (httpRequest.readyState === 4 && httpRequest.status === 200) {
 callback(httpRequest.responseText, protocol, cipherString);
 }
 };
 httpRequest.open("GET", url, true);
 httpRequest.send(null);
 };
 };
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

var httpResponse;
var months = [];
var totalHosts = [];
var monthBody = [];
var hostsAccepting = [];
var hostsPreferring = [];

function setHttpResponse(response) {
    console.log("Called by: " + arguments.callee.caller.toString());
    if (response === null) {
        console.log("Response was set to null!");
    } else {
        console.log("Response was set!");
    }

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


        document.getElementById("displayFilterSelection").innerHTML =
                [keyExAndAuth, bulkCipher, keyLen, msgAuth].join("");
    }
}

function resetFilters() {

    document.getElementById("keyExAuth").innerHTML = getKeyAndAuth("all");
    document.getElementById("cipher").innerHTML = getCiphers("all");
    document.getElementById("keyLen").innerHTML = getKeyLengths("all");
    document.getElementById("msgAuth").innerHTML = getMsgAuth("all");

    document.getElementById("displayFilterSelection").innerHTML = "[none]";
}


function applyFilters() {

    resetResults();

    var url = "http://tls.thejetlag.de:1337/api/v0/ciphers/summary";
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

    return parseResponse(httpResponse, protocol, cipherString);



}

function parseResponse(response, protocol, cipherString) {

    months.push('x');
    totalHosts.push('Total Hosts');
    hostsAccepting.push('Hosts Accepting');
    hostsPreferring.push('Hosts Preferring');

    if (response === undefined || response === null) {
        console.log("Invalid response!");
        return null;
    }

    response.match(/month.:.(\d*).(\d*)/g).forEach(function (month) {
        months.push(month.split(":")[1].replace('"', ''));
    });

    response.match(/totalHosts.:.(\d*)/g).forEach(function (number) {
        totalHosts.push(number.split(":")[1]);
    });

    var loops = 0;
    monthBody = response.match(/\[[^\[\]]*\]/g);
    monthBody.forEach(function (outer) {
        outer.match(/{(.*?)}/g).forEach(function (inner) {
            if (protocol !== "") {
                if (inner.match(protocol) !== null && inner.match("\"" + cipherString + "\"") !== null) {
                    var count = ("" + inner.match(/.count.:(\d*)/g) + "").split(":")[1];
                    if (inner.indexOf("preferred") > -1) {
                        hostsPreferring.push(parseInt(count));
                    } else {
                        hostsAccepting.push(parseInt(count));
                    }
                }
            } else {
                if (inner.match("\"" + cipherString + "\"") !== null) {
                    var count = ("" + inner.match(/.count.:(\d*)/g) + "").split(":")[1];
                    writeToHosts(loops + 1, inner, count);
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

    return {
        months: months,
        totalHosts: totalHosts,
        hostsAccepting: hostsAccepting,
        hostsPreferring: hostsPreferring
    };

}

function writeToHosts(currentMonth, match, count) {
    if (match.indexOf("preferred") > -1) {
        if (hostsPreferring.length < 2 || hostsPreferring.length === currentMonth) {
            hostsPreferring.push(parseInt(count));
        } else {
            hostsPreferring[currentMonth] += parseInt(count);
        }
    } else {
        if (hostsAccepting.length < 2 || hostsAccepting.length === currentMonth) {
            hostsAccepting.push(parseInt(count));
        } else {
            hostsAccepting[currentMonth] += parseInt(count);
        }
    }
}

function resetResults() {

    months = [];
    totalHosts = [];
    hostsAccepting = [];
    hostsPreferring = [];

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
        if (protocolSelection === "TLS 1.1") {
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