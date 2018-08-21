const Web3 = require('web3');
const mysql = require('mysql');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var blockHeightOnChain = 0;
var processedBlock = 0;
var checkProcessedBlocklock = true;
var userAddressList = [];

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "saga"
});

var createProcessedBlock = (blkNum) => {
  return new Promise((resolve, reject) => {
    var sql = `INSERT INTO processed_block (block_height) VALUES (${blkNum})`;
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

var updateProcessedBlock = (blkNum) => {
  return new Promise((resolve, reject) => {
    var sql = `UPDATE processed_block SET block_height = ${blkNum} WHERE id = 1`;
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

var getProcessedBlock = () => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM processed_block WHERE id = 1", (err, result) => {
      if (err) {
        reject(err);
        // error handle
      } else {
        var value = ((result.length == 0) ? -1 : result[0].block_height);
        resolve(value);
      }
    });
  });
}

var getUsersAddress = () => {
  return new Promise((resolve, reject) => {
    con.query("SELECT eth_addr FROM users", (err, result) => {
      if (err) {
        reject(err);
      } else {
        result.forEach((element) => {
          userAddressList.push(element.eth_addr);
        });
        resolve(true);
      }
    });
  });
}

function getBlockHeightOnChain() {
  blk = web3.eth.getBlock("latest");
  blockHeightOnChain = blk.number;
  console.log("Block Height on Chain: ", blockHeightOnChain);
}

async function checkProcessedBlock() {
  console.log("ProcessedBlock: ", processedBlock);
  if (processedBlock < blockHeightOnChain && checkProcessedBlocklock) {
    checkProcessedBlocklock = false;
    for (let i = processedBlock + 1 ; i <= blockHeightOnChain ; i++) {
      var update = false;
      while (!update) {
        try {
          txhash = web3.eth.getBlock(i).transactions
          txhash.forEach((element) => {
            tx = web3.eth.getTransaction(element);
            if (userAddressList.includes(tx.to)) {
              console.log("blk", i, "to", tx.to, "value", tx.value);
            }
          })
          update = await updateProcessedBlock(i);
          processedBlock = i;
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
  checkProcessedBlocklock = true;
}

var main = async () => {
  try {
    await con.connect();
    getBlockHeightOnChain();
    var done = false;
    while(!done) {
      done = await getUsersAddress();
    }
    setInterval(getBlockHeightOnChain, 15000);
    processedBlock = await getProcessedBlock();
    if (processedBlock == -1) {
      let blk = web3.eth.getBlock("latest");
      var create = false;
      while (!create) {
        create = await createProcessedBlock(blk.number);
      }
    }
    setInterval(checkProcessedBlock, 1000);
  } catch (e) {
    console.log(e);
  }
}


main()
