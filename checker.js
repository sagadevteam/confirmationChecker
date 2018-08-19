const Web3 = require('web3');
const mysql = require('mysql');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "saga"
});

var createProcessedBlock = (blk) => {
  return new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) {
        reject(err);
      } else {
        var sql = `INSERT INTO processed_block (block_height) VALUES (${blk})`;
        con.query(sql, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      }
    });
  });
}

var updateProcessedBlock = (blk) => {
  return new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) {
        reject(err);
      } else {
        var sql = `UPDATE processed_block SET block_height = ${blk} WHERE id = 1`;
        con.query(sql, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      }
    });
  });
}

var getProcessedBlock = () => {
  return new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) {
        reject(err);
        // error handle
      } else {
        con.query("SELECT * FROM processed_block WHERE id = 1", (err, result) => {
          if (err) {
            reject(err);
            // error handle
          } else {
            var value = ((result.length == 0) ? 0 : result[0].block_height);
            resolve(value);
          }
        });
      }
    });
  });
}

var main = async () => {
  try {
    var processedBlock = await getProcessedBlock();
    if (processedBlock == 0) {
      let blk = web3.eth.getBlock("latest")
      var create = false;
      while (!create) {
        create = createProcessedBlock(blk.number);
      }
    }
    console.log("ProcessedBlock: ", processedBlock);
  } catch (e) {
    console.log(e);
  }
}

//let blk = web3.eth.getBlock("latest")

//console.log(blk.number)
/*
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
*/

main()
