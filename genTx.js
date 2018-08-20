const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var users = web3.eth.accounts;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
} 

for (let i = 0; i < 1000; i++) {
	var _from = users[getRandomInt(users.length)];
	var _to = users[getRandomInt(users.length)];
	var _max = web3.eth.getBalance(_from);
	_max = (_max >= 100) ? 100  : _max;
	var _value = getRandomInt(_max);
	web3.personal.unlockAccount(_from, "");
	console.log(_from,"==>", _to,", value:", _value);
	web3.eth.sendTransaction({"from": _from, "to": _to, "value": _value, "gasPrice": 0});
}