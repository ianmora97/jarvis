var crypto = require("crypto-js");
 
// Encrypt
var ciphertext = crypto.AES.encrypt('my message', 'secret key 123').toString();
 
// Decrypt
var bytes  = crypto.AES.decrypt(ciphertext, 'secret key 123');
var originalText = bytes.toString(crypto.enc.Utf8);
 
console.log(originalText); // 'my message'