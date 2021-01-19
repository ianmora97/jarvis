var sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("../databases/passafe.db");
var myArgs = process.argv.slice(2);

var CryptoJS = require("crypto-js");
// Encrypt
function encrypt(pass, masterkey) {
    var ciphertext = CryptoJS.AES.encrypt(pass, masterkey).toString();
    return ciphertext;
}

function configMaster() {
    var pass = encrypt(myArgs[0],'keyDecryptForAllPasswords1234!');
    db.run(
        "INSERT INTO masterkey(name,password) VALUES('main',?)",
        [pass],
        (err) => {
            if (err) {
                console.log(err.message);
            }
    console.log('Inserted:',myArgs);
        }
    );
}
configMaster();