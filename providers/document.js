import Web3Provider from './web3';
import config from '../config/config'

var contract_abi = require('../contract.json');
var web3 = new Web3Provider();
web3.init();

const Document = {}

Document.createOrUpdate = function (referenceId, params) {
  return new Promise((resolve, reject) => {
    let web3Obj = web3.getWeb3Object();

    let contract = new web3Obj.eth.Contract(contract_abi, config.contract_address);
    let data = null
    if (referenceId) {
      data = contract.methods.updateDocument(referenceId, params.hash, params.description).encodeABI()
    } else {
      data = contract.methods.createDocument(params.hash, params.description).encodeABI()
    }

    let tx_options = {
      gas: web3.toHex("2100000"),
      gasPrice: web3.toHex("3000000000"),
      to: config.contract_address,
      data: data
    }

    web3.getTransactionCount().then(count => { 
      tx_options['nonce'] = web3.toHex(count)
      web3.signTransaction(tx_options).then(signedTx => {
        web3.getWeb3Object().eth.sendSignedTransaction(signedTx)
        .then((reciept) => {
          const txid = reciept.transactionHash;
          reciept = web3Obj.eth.abi.decodeLog([{
                "indexed": true,
                "name": "referenceId",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "name": "documentId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "versionId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "hash",
                "type": "string"
            }], reciept.logs[0].data, reciept.logs[0].topics.slice(1))
          resolve({
            referenceId: reciept.referenceId,
            documentId: reciept.documentId,
            versionId: reciept.versionId,
            transactionId: txid
          })
        })
        .catch(error => {
          reject(error);  
        })
      })
      .catch(error => {
        reject(error);  
      });
    })
    .catch(error => {
      reject(error);  
    });
  })
}

Document.getByTransaction = function (transactionID) {
  return new Promise((resolve, reject) => {
    let web3Obj = web3.getWeb3Object();
    let contract = new web3Obj.eth.Contract(contract_abi, config.contract_address);
    
    let tx_options = {
      to: config.contract_address
    };

    tx_options.data = contract.methods.getByReferenceId(transactionID).encodeABI()

    web3Obj.eth.call(tx_options).then(resp => {
      resp = web3Obj.eth.abi.decodeParameters(['string', 'string'], resp);
      resolve({
        hash: resp['0'],
        description: resp['1']
      })
    })
    .catch(error => {
      reject(error);  
    });
  })
}

Document.getAllByTransaction = function (transactionID) {
  return new Promise((resolve, reject) => {
    let web3Obj = web3.getWeb3Object();
    let contract = new web3Obj.eth.Contract(contract_abi, config.contract_address);
    
    let tx_options = {
      to: config.contract_address
    };

    tx_options.data = contract.methods.getAllByReferenceId(transactionID).encodeABI()

    web3Obj.eth.call(tx_options).then(resp => {
      resp = web3.decodeArrayOfStrings(resp)
      resolve(resp)
    })
    .catch(error => {
      reject(error);  
    });
  })
}

Document.getByHash = function (hash) {
  return new Promise((resolve, reject) => {
    let web3Obj = web3.getWeb3Object();
    let contract = new web3Obj.eth.Contract(contract_abi, config.contract_address);
    
    let tx_options = {
      to: config.contract_address
    };

    tx_options.data = contract.methods.getAllByHash(hash).encodeABI()

    web3Obj.eth.call(tx_options).then(resp => {
      resp = web3.decodeArrayOfStrings(resp)
      resolve(resp)
    })
    .catch(error => {
      reject(error);  
    });
  })
}

Document.isHashExists = function (hash) {
  return new Promise((resolve, reject) => {
    let web3Obj = web3.getWeb3Object();
    let contract = new web3Obj.eth.Contract(contract_abi, config.contract_address);
    
    let tx_options = {
      to: config.contract_address
    };

    tx_options.data = contract.methods['hashExists'](hash).encodeABI()

    web3Obj.eth.call(tx_options).then(resp => {
      let flag = web3Obj.utils.hexToNumber(resp);
      resolve(flag);
    })
    .catch(error => {
      reject(error);  
    });
  })
}

Document.isReferenceExists = function (referenceId) {
  return new Promise((resolve, reject) => {
    let web3Obj = web3.getWeb3Object();
    let contract = new web3Obj.eth.Contract(contract_abi, config.contract_address);
    
    let tx_options = {
      to: config.contract_address
    };

    tx_options.data = contract.methods['isReferenceExists'](referenceId).encodeABI()

    web3Obj.eth.call(tx_options).then(resp => {
      let flag = web3Obj.utils.hexToNumber(resp);
      resolve(flag);
    })
    .catch(error => {
      reject(error);  
    });
  })
}

export default Document;