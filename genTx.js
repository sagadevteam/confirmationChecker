const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var users = web3.eth.accounts;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
} 

for (let i = 0; i < 50; i++) {
	var _from = users[0];
	var _to = users[getRandomInt(users.length)];
	var _value = getRandomInt(100);
	web3.personal.unlockAccount(_from, "");
	console.log("address: ", _to,", value:", _value);
	web3.eth.sendTransaction({"from": _from, "to": _to, "value": _value, "gasPrice": 0});
}
