const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var users = web3.eth.accounts;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
} 

var genTxNum = [];

for (let i = 0; i < users.length-1; i++) {
	genTxNum.push(getRandomInt(50));
}

var blk = web3.eth.getBlock('latest');

console.log("From Block: ", blk.number);
for (let i = 1; i < users.length; i++) {
	console.log(users[i], ":", genTxNum[i-1], "tx gen");
	for (let j = 0; j < genTxNum[i-1]; j++) {
		var _from = users[0];
		var _to = users[i];
		var _value = getRandomInt(100);
		web3.eth.sendTransaction({"from": _from, "to": _to, "value": _value, "gasPrice": 0});
	}
}
