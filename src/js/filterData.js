

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
        } else {
            if (keyLen !== "") {
                keyLen += "-";
            }
        }

        document.getElementById("displayFilterSelection").innerHTML = "Current cipher string to search for:<br>\n\
        " + [keyExAndAuth, bulkCipher, keyLen, msgAuth].join("");
    }
}

function resetFilters() {

    document.getElementById("keyExAuth").innerHTML = getKeyAndAuth("all");
    document.getElementById("cipher").innerHTML = getCiphers("all");
    document.getElementById("keyLen").innerHTML = getKeyLengths("all");
    document.getElementById("msgAuth").innerHTML = getMsgAuth("all");

    document.getElementById("displayFilterSelection").innerHTML = "";
}

function getKeyAndAuth(protocolSelection) {

    if (protocolSelection === "SSL 2.0") {
        return "<option value=\"RSA\"></option>";
    } else if (protocolSelection === "SSL 3.0") {
        return "<option value=\"RSA\">\n\
                      <option value=\"DH-RSA\"></option>\n\
                      <option value=\"DHE-RSA\"></option>\n\
                      <option value=\"DH-DSS\"></option>\n\
                      <option value=\"DHE-DSS\"></option>";
    } else if (protocolSelection === "TLS 1.0" || protocolSelection === "TLS 1.1"
            || protocolSelection === "TLS 1.2") {
        return "<option value=\"RSA\"></option>\n\
                     <option value=\"DH-RSA\"></option>\n\
                     <option value=\"DHE-RSA\"></option>\n\
                     <option value=\"ECDH-RSA\"></option>\n\
                     <option value=\"ECDHE-RSA\"></option>\n\
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
        return "<option value=\"RSA\"></option>\n\
                     <option value=\"DH-RSA\"></option>\n\
                     <option value=\"DHE-RSA\"></option>\n\
                     <option value=\"ECDH-RSA\"></option>\n\
                     <option value=\"ECDHE-RSA\"></option>\n\
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

    if (protocolSelection === "SSL 2.0") {
        return "<option value=\"DES-CBC3\"></option>\n\
                        <option value=\"IDEA-CBC\"></option>\n\
                        <option value=\"DES-CBC\"></option>\n\
                        <option value=\"RC2-CBC\"></option>\n\
                        <option value=\"RC4\"></option>";
    } else if (protocolSelection === "SSL 3.0") {
        return "<option value=\"DES-CBC3\">\n\
                        <option value=\"IDEA-CBC\"></option>\n\
                        <option value=\"DES-CBC\"></option>\n\
                        <option value=\"RC2-CBC\"></option>\n\
                        <option value=\"RC4\"></option>\n\
                        <option value=\"none\"></option>";
    } else if (protocolSelection === "TLS 1.0") {
        return "<option value=\"AES-CBC\">\n\
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
    } else if (protocolSelection === "TLS 1.1") {
        return "<option value=\"AES-CBC\">\n\
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
    } else if (protocolSelection === "TLS 1.2") {
        return "<option value=\"AES-GCM\">\n\
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
        return "<option value=\"AES-GCM\">\n\
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

    if (cipherSelection === "AES-GCM" || cipherSelection === "AES-CCM" || cipherSelection === "AES-CBC"
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
        if (protocolSelection === "TLS 1.1" || protocolSelection === "TLS 1.2") {
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

    if (protocolSelection === "SSL 2.0") {
        return "<option value=\"MD5\">";
    } else if (protocolSelection === "SSL 3.0" || protocolSelection === "TLS 1.0"
            || protocolSelection === "TLS 1.1") {
        return "<option value=\"MD5\">\n\
                <option value=\"SHA1\">\n\
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