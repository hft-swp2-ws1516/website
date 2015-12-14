
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

var totalCiphers = [];


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
            cipherString = cipherString.replace('-', ' ');
        }


        document.getElementById("displayFilterSelection").innerHTML = cipherString;
    }
}

function resetFilters() {

    document.getElementById("keyExAuth").innerHTML = getKeyAndAuth("all");
    document.getElementById("cipher").innerHTML = getCiphers("all");
    document.getElementById("keyLen").innerHTML = getKeyLengths("all");
    document.getElementById("msgAuth").innerHTML = getMsgAuth("all");

    document.getElementById("displayFilterSelection").innerHTML = "[none]";

    document.getElementById("filteredChartGeneral").innerHTML = "";
    document.getElementById("filteredChartLastMonth").innerHTML = "";
}


function applyFilters() {

    resetResults();
    document.getElementById("filteredChartGeneral").innerHTML = "";
    document.getElementById("filteredChartLastMonth").innerHTML = "";

    var url = "http://h2511680.stratoserver.net:1337/api/v0/ciphers/summary";
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
    totalHosts.push('Total Number of Hosts');
    hostsAccepting.push('Hosts Accepting');
    hostsPreferring.push('Hosts Preferring');

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
    monthBody = response.match(/\[[^\[\]]*\]/g);
    monthBody.forEach(function (outer) {
        outer.match(/{(.*?)}/g).forEach(function (inner) {
            if (!manualProtocolAggregation) {
                if (matchLiterally) {
                    if (inner.match("\"" + protocol + "\"") !== null && inner.match(cipherString) !== null) {
                        count = ("" + inner.match(/.count.:(\d*)/g) + "").split(":")[1];
                        if (inner.indexOf("preferred") > -1) {
                            hostsPreferring.push(parseInt(count));
                        } else {
                            hostsAccepting.push(parseInt(count));
                        }
                    }
                } else {
                    count = ("" + inner.match(/.count.:(\d*)/g) + "").split(":")[1];
                    writeToTotalCiphers(loops + 1, count);
                    if (inner.match("\"" + protocol + "\"") !== null && testIfPartsMatch(inner, cipherString)) {
                        count = ("" + inner.match(/.count.:(\d*)/g) + "").split(":")[1];
                        writeToHosts(loops + 1, inner, count);
                    }
                }
            } else {
                if (!matchLiterally) {
                    count = ("" + inner.match(/.count.:(\d*)/g) + "").split(":")[1];
                    writeToTotalCiphers(loops + 1, count);
                }
                if (inner.match(cipherString) !== null || (!matchLiterally && testIfPartsMatch(inner, cipherString))) {
                    protocol = ("" + inner.match(/.protocol.:.([A-Z || v || \. || \d]*)/g) + "").split(":")[1].replace('"', '');
                    count = ("" + inner.match(/.count.:(\d*)/g) + "").split(":")[1];
                    writeToHostsByProtocol(loops + 1, protocol, inner, count);
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
        totalCiphers: totalCiphers
    };

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

function writeToTotalCiphers(currentMonth, count) {
    count = parseInt(count);
    if (totalCiphers.length === 0) {
        totalCiphers.push("Total Number of Cipher Suites");
    }
    if (totalCiphers.length < 2 || totalCiphers.length === currentMonth) {
        totalCiphers.push(count);
    } else {
        totalCiphers[currentMonth] += count;
    }
}

function writeToHosts(currentMonth, match, count) {
    count = parseInt(count);
    if (match.indexOf("preferred") > -1) {
        if (hostsPreferring.length < 2 || hostsPreferring.length === currentMonth) {
            hostsPreferring.push(count);
        } else {
            hostsPreferring[currentMonth] += count;
        }
    } else {
        if (hostsAccepting.length < 2 || hostsAccepting.length === currentMonth) {
            hostsAccepting.push(count);
        } else {
            hostsAccepting[currentMonth] += count;
        }
    }
}

function writeToHostsByProtocol(currentMonth, protocol, match, count) {
    count = parseInt(count);
    switch (protocol) {
        case "SSLv2":
            if (hostsPreferringSSL2.length === 0) {
                hostsPreferringSSL2.push("Hosts Preferring (SSLv2)");
            }
            if (hostsAcceptingSSL2.length === 0) {
                hostsAcceptingSSL2.push("Hosts Accepting (SSLv2)");
            }
            if (match.indexOf("preferred") > -1) {
                if (hostsPreferringSSL2.length < 2 || hostsPreferringSSL2.length === currentMonth) {
                    hostsPreferringSSL2.push(count);
                } else {
                    hostsPreferringSSL2[currentMonth] += count;
                }
            } else {
                if (hostsAcceptingSSL2.length < 2 || hostsAcceptingSSL2.length === currentMonth) {
                    hostsAcceptingSSL2.push(count);
                } else {
                    hostsAcceptingSSL2[currentMonth] += count;
                }
            }
            break;
        case "SSLv3":
            if (hostsPreferringSSL3.length === 0) {
                hostsPreferringSSL3.push("Hosts Preferring (SSLv3)");
            }
            if (hostsAcceptingSSL3.length === 0) {
                hostsAcceptingSSL3.push("Hosts Accepting (SSLv3)");
            }
            if (match.indexOf("preferred") > -1) {
                if (hostsPreferringSSL3.length < 2 || hostsPreferringSSL3.length === currentMonth) {
                    hostsPreferringSSL3.push(count);
                } else {
                    hostsPreferringSSL3[currentMonth] += count;
                }
            } else {
                if (hostsAcceptingSSL3.length < 2 || hostsAcceptingSSL3.length === currentMonth) {
                    hostsAcceptingSSL3.push(count);
                } else {
                    hostsAcceptingSSL3[currentMonth] += count;
                }
            }
            break;
        case "TLSv1.0":
            if (hostsPreferringTLS1.length === 0) {
                hostsPreferringTLS1.push("Hosts Preferring (TLSv1.0)");
            }
            if (hostsAcceptingTLS1.length === 0) {
                hostsAcceptingTLS1.push("Hosts Accepting (TLSv1.0)");
            }
            if (match.indexOf("preferred") > -1) {
                if (hostsPreferringTLS1.length < 2 || hostsPreferringTLS1.length === currentMonth) {
                    hostsPreferringTLS1.push(count);
                } else {
                    hostsPreferringTLS1[currentMonth] += count;
                }
            } else {
                if (hostsAcceptingTLS1.length < 2 || hostsAcceptingTLS1.length === currentMonth) {
                    hostsAcceptingTLS1.push(count);
                } else {
                    hostsAcceptingTLS1[currentMonth] += count;
                }
            }
            break;
        case "TLSv1.1":
            if (hostsPreferringTLS11.length === 0) {
                hostsPreferringTLS11.push("Hosts Preferring (TLSv1.1)");
            }
            if (hostsAcceptingTLS11.length === 0) {
                hostsAcceptingTLS11.push("Hosts Accepting (TLSv1.1)");
            }
            if (match.indexOf("preferred") > -1) {
                if (hostsPreferringTLS11.length < 2 || hostsPreferringTLS11.length === currentMonth) {
                    hostsPreferringTLS11.push(count);
                } else {
                    hostsPreferringTLS11[currentMonth] += count;
                }
            } else {
                if (hostsAcceptingTLS11.length < 2 || hostsAcceptingTLS11.length === currentMonth) {
                    hostsAcceptingTLS11.push(count);
                } else {
                    hostsAcceptingTLS11[currentMonth] += count;
                }
            }
            break;
        case "TLSv1.2":
            if (hostsPreferringTLS12.length === 0) {
                hostsPreferringTLS12.push("Hosts Preferring (TLSv1.2)");
            }
            if (hostsAcceptingTLS12.length === 0) {
                hostsAcceptingTLS12.push("Hosts Accepting (TLSv1.2)");
            }
            if (match.indexOf("preferred") > -1) {
                if (hostsPreferringTLS12.length < 2 || hostsPreferringTLS12.length === currentMonth) {
                    hostsPreferringTLS12.push(count);
                } else {
                    hostsPreferringTLS12[currentMonth] += count;
                }
            } else {
                if (hostsAcceptingTLS12.length < 2 || hostsAcceptingTLS12.length === currentMonth) {
                    hostsAcceptingTLS12.push(count);
                } else {
                    hostsAcceptingTLS12[currentMonth] += count;
                }
            }
            break;
        default:
            //Well, shit.
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
    
    totalCiphers = [];

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
