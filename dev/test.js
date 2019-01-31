const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

// bitcoin.createNewBlock(2389, 'JSOI3kNPO2', 'LKLOL40D9DJL');
// bitcoin.createNewBlock(1189, 'LKN13kNIKL', 'PODMS29DJ1');
// bitcoin.createNewBlock(3489, 'KKN13kKL21', 'KJ1JK40D9DJ9');
// bitcoin.createNewTransaction(100,'ALEX3DH9FU99J','JEAN91UDODSUD0');
// bitcoin.createNewBlock(3489, 'KKN13kKL21', 'KJ1JK40D9DJ9');

const previousBlockHash = 'ALEX3DH9FU99J';
const currentBlockData = [
    {
        amount: 10,
        sender: '3O4K3OW230IOWD',
        recipient: 'L2K1L2KL12KL2K',
    },
    {
        amount: 30,
        sender: 'FJKSI8JSSKDSDD',
        recipient: 'SDMJ3JDSKDSD2323',
    },
    {
        amount: 140,
        sender: 'WLOJON5OI3J54N',
        recipient: 'ODML3OWJD8FLFDJ',
    },
];
const nonce = 103779;

//console.log(bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce));
console.log(bitcoin.proofOfWork(previousBlockHash,currentBlockData));
