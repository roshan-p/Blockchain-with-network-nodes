const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];

function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    this.createNewBlock(100,'0','0') // create genesis block
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, //number that come from proof of work method
        hash: hash,
        previousBlockHash: previousBlockHash
    };
    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount,sender,recipient){
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient
    };
    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index']+1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBLockData, nonce){
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBLockData);
    const hash = sha256(dataAsString);
    return hash;

}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBLockData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash,currentBLockData,nonce);
    while(hash.substring(0,4) !== '0000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash,currentBLockData,nonce);
        console.log(hash);
    }
    return nonce;
}
module.exports = Blockchain;