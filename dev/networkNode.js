const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain')
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

//create new transcation in the blockchain
app.post('/transaction', function (req, res) {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previcousBlockHash = lastBlock['hash'];
    const currentblockData = {
        transaction: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }

    const nonce = bitcoin.proofOfWork(previcousBlockHash, currentblockData);
    const blockHash = bitcoin.hashBlock(previcousBlockHash, currentblockData, nonce);

    bitcoin.createNewTransaction(12.5, "00", nodeAddress)

    const newBlock = bitcoin.createNewBlock(nonce, previcousBlockHash, blockHash);

    res.json({
        note: 'New block successfully mined',
        block: newBlock,
    })
});

// register a node and broadcast it to entire network
app.post('/register-add-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    // if newNodeUrl not exist in current array
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];
    // register new node to other node
    bitcoin.networkNodes.forEach(newNodeUrl => {
        const requestOptions = {
            uri: newNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true,
        };
        //async request
        regNodesPromises.push(rp(requestOptions));
    });
    Promise.all(regNodesPromises)
        // register other node to new node
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
                json: true
            };
            return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({ note: 'New node succsessfully registered to the newtork' })
        })
});

// register a node with the network
app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node succsessfully registered with node.' })

});

// register a multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    })
    res.json({note:'Bluk registration successsful.'})
});

app.listen(port, function () {
    console.log(`Listening on port ${port}...`)
});