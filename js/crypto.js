var CryptoJS = require("crypto-js");
// Encrypt
function encrypt(pass, masterkey) {
    var ciphertext = CryptoJS.AES.encrypt(pass, masterkey).toString();
    return ciphertext;
}
// Decrypt
function decrypt(pass, masterkey) {
    var bytes  = CryptoJS.AES.decrypt(pass, masterkey);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}