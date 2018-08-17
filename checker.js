const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const address = "0xb0aa80e9f5f8052ab2af46071ad3258e3fe807e9";

let balance = web3.eth.getBalance(address);

console.log(balance)

const filter = web3.eth.filter('latest');
filter.watch((err, res) => {
  if (err) {
    console.log(`Watch error: ${err}`);
  } else {
    // Update balance
    web3.eth.getBalance(address, (err, bal) => {
      if (err) {
        console.log(`getBalance error: ${err}`);
      } else {
        balance = bal;
        console.log(`Balance [${address}]: ${web3.fromWei(balance, "ether")}`);
      }
    });
  }
});