

function manageFilterSelection() {

    var keyExAndAuthList = document.getElementById("keyExAuth");
    var cipherList = document.getElementById("cipher");
    var cipherSelection = document.getElementById("filterCipher").value;
    var keyLenList = document.getElementById("keyLen");
    var msgAuthList = document.getElementById("msgAuth").options;
    var protocolSelection = document.getElementById("filterProtocol").value;

    keyExAndAuthList.innerHTML = getKeyAndAuth(protocolSelection);
    cipherList.innerHTML = getCiphers(protocolSelection);
    keyLenList.innerHTML = getKeyLengths(cipherSelection);

}

function resetFilters() {

    document.getElementById("keyExAuth").innerHTML = getKeyAndAuth("all");
    document.getElementById("cipher").innerHTML = getCiphers("all");
    document.getElementById("keyLen").innerHTML = getKeyLengths("all");
    var msgAuthList = document.getElementById("msgAuth");


}

function getKeyAndAuth(protocolSelection) {

    if (protocolSelection === "SSL 2.0") {
        return "<option value=\"RSA\">";
    } else if (protocolSelection === "SSL 3.0") {
        return "<option value=\"RSA\">\n\
                      <option value=\"DH_RSA\">\n\
                      <option value=\"DHE_RSA\">\n\
                      <option value=\"DH_DSS\">\n\
                      <option value=\"DHE_DSS\">";
    } else if (protocolSelection === "TLS 1.0" || protocolSelection === "TLS 1.1" || protocolSelection === "TLS 1.2") {
        return "<option value=\"RSA\">\n\
                     <option value=\"DH_RSA\">\n\
                     <option value=\"DHE_RSA\">\n\
                     <option value=\"ECDH_RSA\">\n\
                     <option value=\"ECDHE_RSA\">\n\
                     <option value=\"DH_DSS\">\n\
                     <option value=\"DHE_DSS\">\n\
                     <option value=\"ECDH_ECDSA\">\n\
                     <option value=\"ECDHE_ECDSA\">\n\
                     <option value=\"PSK\">\n\
                     <option value=\"PSK_RSA\">\n\
                     <option value=\"DHE_PSK\">\n\
                     <option value=\"ECDHE_PSK\">\n\
                     <option value=\"SRP\">\n\
                     <option value=\"SRP_DSS\">\n\
                     <option value=\"SRP_RSA\">\n\
                     <option value=\"KERBEROS\">\n\
                     <option value=\"DH_ANON\">\n\
                     <option value=\"ECDH_ANON\">\n\
                     <option value=\"GOST\">";
    } else {
        return "<option value=\"RSA\">\n\
                     <option value=\"DH_RSA\">\n\
                     <option value=\"DHE_RSA\">\n\
                     <option value=\"ECDH_RSA\">\n\
                     <option value=\"ECDHE_RSA\">\n\
                     <option value=\"DH_DSS\">\n\
                     <option value=\"DHE_DSS\">\n\
                     <option value=\"ECDH_ECDSA\">\n\
                     <option value=\"ECDHE_ECDSA\">\n\
                     <option value=\"PSK\">\n\
                     <option value=\"PSK_RSA\">\n\
                     <option value=\"DHE_PSK\">\n\
                     <option value=\"ECDHE_PSK\">\n\
                     <option value=\"SRP\">\n\
                     <option value=\"SRP_DSS\">\n\
                     <option value=\"SRP_RSA\">\n\
                     <option value=\"KERBEROS\">\n\
                     <option value=\"DH_ANON\">\n\
                     <option value=\"ECDH_ANON\">\n\
                     <option value=\"GOST\">";
    }
}

function getCiphers(protocolSelection) {

    if (protocolSelection === "SSL 2.0") {
        return "<option value=\"3DES_EDE_CBC\">\n\
                        <option value=\"IDEA_CBC\">\n\
                        <option value=\"DES_CBC\">\n\
                        <option value=\"RC2_CBC\">\n\
                        <option value=\"RC4\">";
    } else if (protocolSelection === "SSL 3.0") {
        return "<option value=\"3DES_EDE_CBC\">\n\
                        <option value=\"IDEA_CBC\">\n\
                        <option value=\"DES_CBC\">\n\
                        <option value=\"RC2_CBC\">\n\
                        <option value=\"RC4\">\n\
                        <option value=\"none\">";
    } else if (protocolSelection === "TLS 1.0") {
        return "<option value=\"AES_CBC\">\n\
                                <option value=\"CAMELLIA_CBC\">\n\
                                <option value=\"ARIA_CBC\">\n\
                                <option value=\"SEED_CBC\">\n\
                                <option value=\"3DES_EDE_CBC\">\n\
                                <option value=\"GOST_28147-89_CNT\">\n\
                                <option value=\"IDEA_CBC\">\n\
                                <option value=\"DES_CBC\">\n\
                                <option value=\"RC2_CBC\">\n\
                                <option value=\"RC4\">\n\
                                <option value=\"none\">";
    } else if (protocolSelection === "TLS 1.1") {
        return "<option value=\"AES_CBC\">\n\
                                <option value=\"CAMELLIA_CBC\">\n\
                                <option value=\"ARIA_CBC\">\n\
                                <option value=\"SEED_CBC\">\n\
                                <option value=\"3DES_EDE_CBC\">\n\
                                <option value=\"GOST_28147-89_CNT\">\n\
                                <option value=\"IDEA_CBC\">\n\
                                <option value=\"DES_CBC\">\n\
                                <option value=\"RC4\">\n\
                                <option value=\"none\">";
    } else if (protocolSelection === "TLS 1.2") {
        return "<option value=\"AES_GCM\">\n\
                                <option value=\"AES_CCM\">\n\
                                <option value=\"AES_CBC\">\n\
                                <option value=\"CAMELLIA_GCM\">\n\
                                <option value=\"CAMELLIA_CBC\">\n\
                                <option value=\"ARIA_GCM\">\n\
                                <option value=\"ARIA_CBC\">\n\
                                <option value=\"SEED_CBC\">\n\
                                <option value=\"3DES_EDE_CBC\">\n\
                                <option value=\"GOST_28147-89_CNT\">\n\
                                <option value=\"ChaCha_20-POLY1305\">\n\
                                <option value=\"RC4\">\n\
                                <option value=\"none\">";
    } else {
        return "<option value=\"AES_GCM\">\n\
                                <option value=\"AES_CCM\">\n\
                                <option value=\"AES_CBC\">\n\
                                <option value=\"CAMELLIA_GCM\">\n\
                                <option value=\"CAMELLIA_CBC\">\n\
                                <option value=\"ARIA_GCM\">\n\
                                <option value=\"ARIA_CBC\">\n\
                                <option value=\"SEED_CBC\">\n\
                                <option value=\"3DES_EDE_CBC\">\n\
                                <option value=\"GOST_28147-89_CNT\">\n\
                                <option value=\"IDEA_CBC\">\n\
                                <option value=\"DES_CBC\">\n\
                                <option value=\"RC2_CBC\">\n\
                                <option value=\"ChaCha_20-POLY1305\">\n\
                                <option value=\"RC4\">\n\
                                <option value=\"none\">";
    }

}

function getKeyLengths(protocolSelection, cipherSelection) {

    if (cipherSelection === "AES_GCM" || cipherSelection === "AES_CCM" || cipherSelection === "AES_CBC"
            || cipherSelection === "CAMELLIA_GCM" || cipherSelection === "CAMELLIA_CBC"
            || cipherSelection === "ARIA_GCM" || cipherSelection === "ARIA_CBC") {
        return "<option value=\"128\">\n\
                <option value=\"256\">";
    } else if (cipherSelection === "SEED_CBC" || cipherSelection === "IDEA_CBC") {
        return "<option value=\"128\">";
    } else if (cipherSelection === "3DES_EDE_CBC") {
        return "<option value=\"112\">";
    } else if (cipherSelection === "GOST_28147-89_CNT") {
        return "<option value=\"256\">";
    } else if (cipherSelection === "DES_CBC") {
        return "<option value=\"40\">\n\
                <option value=\"56\">";
    } else if (cipherSelection === "RC2_CBC") {
        return "<option value=\"40\">";
    }else if(cipherSelection === "ChaCha_20-POLY1305"){
        return "<option value=\"256\">";
    }

}