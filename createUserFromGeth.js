const Web3 = require('web3');
const mysql = require('mysql');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var users = web3.eth.accounts;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "saga"
});

var addrExistInDb = (addr) => {
  return new Promise((resolve, reject) => {
  	var sql = `SELECT * FROM users WHERE eth_addr = ${addr}`;
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
        // error handle
      } else {
        var value = ((result.length == 0) ? false : true);
        resolve(value);
      }
    });
  });
}

var createUserInDb = (addr) => {
	return new Promise ((resolve, reject) => {
		var sql = `INSERT INTO users (email, password, eth_addr, eth_value, saga_point) VALUES ('${addr}@saga.com', '', '${addr}', 0, 0)`;
		con.query(sql, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}


var main = async () => {
  try {
  	await con.connect();
  	users.forEach(async (element) => {
  		var exist = await addrExistInDb(element);
  		console.log(element, "is exist:", exist);
  		if (!exist) {
  			var create = false;
  			create = await createUserInDb(element);
  			console.log(element, "insert into db");
  		}
  	});
  } catch (e) {
    console.log(e);
  }
}

main();
