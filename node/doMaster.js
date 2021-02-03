var sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./databases/passafe.db");
var myArgs = process.argv.slice(2);

var CryptoJS = require("crypto-js");
function encrypt(pass, masterkey) {
    var ciphertext = CryptoJS.AES.encrypt(pass, masterkey).toString();
    return ciphertext;
}

function configMaster(p) {
    db.serialize(()=>{
        var sql = `INSERT INTO masterkey(name,password) VALUES('main','${encrypt(p,'keyDecryptForAllPasswords1234!')}')`;
        db.run('DELETE FROM MASTERKEY').run(sql);
        console.log('MASTERKEY CREATED')
    })
}

function main() {
    let arg = myArgs[0].split('=');
    switch (arg[0]) {
        case 'help':
            console.log(`smk    Wipe and Create Tables`)
            console.log(`help   See commands`)
            break;
        case 'smk':
            console.log('Running...')
            setTimeout(() => {
                configMaster(arg[1]);
                console.log('DONE')
            }, 1000);
            return 0;
            break;
        default:
            console.log('Command not recognized')
            console.log(`help   See commands`)
            break;
    }
}
main();