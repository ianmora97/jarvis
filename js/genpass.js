let v1 = "abcdefghijklmnopqrstuvwxyz";
let v2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let v3 = "1234567890";
let v4 = "!@#$%^&*()+<>"; 

async function generatePassword (vec) {
	let pass = "";
	for (let x = 0; x < 5; x++) {
		for(let y = 0; y < 5; y++){
			let r = getRandomInt(0,vec.length);
	        pass += vec[r].charAt(Math.floor(Math.random() * vec[r].length));
		}
		pass += '-';
    }
    return pass.slice(0, pass.length-1);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
