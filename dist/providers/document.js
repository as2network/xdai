'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _web = require('./web3');

var _web2 = _interopRequireDefault(_web);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var contract_abi = require('../contract.json');
var web3 = new _web2.default();
web3.init();

var Document = {};

Document.createOrUpdate = function (referenceId, params) {
  return new Promise(function (resolve, reject) {
    var web3Obj = web3.getWeb3Object();

    var contract = new web3Obj.eth.Contract(contract_abi, _config2.default.contract_address);
    var data = null;
    if (referenceId) {
      data = contract.methods.updateDocument(referenceId, params.hash, params.description).encodeABI();
    } else {
      data = contract.methods.createDocument(params.hash, params.description).encodeABI();
    }

    var tx_options = {
      gas: web3.toHex("2100000"),
      gasPrice: web3.toHex("3000000000"),
      to: _config2.default.contract_address,
      data: data
    };

    web3.getTransactionCount().then(function (count) {
      tx_options['nonce'] = web3.toHex(count);
      web3.signTransaction(tx_options).then(function (signedTx) {
        web3.getWeb3Object().eth.sendSignedTransaction(signedTx).then(function (reciept) {
          var txid = reciept.transactionHash;
          reciept = web3Obj.eth.abi.decodeLog([{
            "indexed": true,
            "name": "referenceId",
            "type": "bytes32"
          }, {
            "indexed": true,
            "name": "documentId",
            "type": "uint256"
          }, {
            "indexed": true,
            "name": "versionId",
            "type": "uint256"
          }, {
            "indexed": false,
            "name": "hash",
            "type": "string"
          }], reciept.logs[0].data, reciept.logs[0].topics.slice(1));
          resolve({
            referenceId: reciept.referenceId,
            documentId: reciept.documentId,
            versionId: reciept.versionId,
            transactionId: txid
          });
        }).catch(function (error) {
          reject(error);
        });
      }).catch(function (error) {
        reject(error);
      });
    }).catch(function (error) {
      reject(error);
    });
  });
};

Document.getByTransaction = function (transactionID) {
  return new Promise(function (resolve, reject) {
    var web3Obj = web3.getWeb3Object();
    var contract = new web3Obj.eth.Contract(contract_abi, _config2.default.contract_address);

    var tx_options = {
      to: _config2.default.contract_address
    };

    tx_options.data = contract.methods.getByReferenceId(transactionID).encodeABI();

    web3Obj.eth.call(tx_options).then(function (resp) {
      resp = web3Obj.eth.abi.decodeParameters(['string', 'string'], resp);
      resolve({
        hash: resp['0'],
        description: resp['1']
      });
    }).catch(function (error) {
      reject(error);
    });
  });
};

Document.getAllByTransaction = function (transactionID) {
  return new Promise(function (resolve, reject) {
    var web3Obj = web3.getWeb3Object();
    var contract = new web3Obj.eth.Contract(contract_abi, _config2.default.contract_address);

    var tx_options = {
      to: _config2.default.contract_address
    };

    tx_options.data = contract.methods.getAllByReferenceId(transactionID).encodeABI();

    web3Obj.eth.call(tx_options).then(function (resp) {
      resp = web3.decodeArrayOfStrings(resp);
      resolve(resp);
    }).catch(function (error) {
      reject(error);
    });
  });
};

Document.getByHash = function (hash) {
  return new Promise(function (resolve, reject) {
    var web3Obj = web3.getWeb3Object();
    var contract = new web3Obj.eth.Contract(contract_abi, _config2.default.contract_address);

    var tx_options = {
      to: _config2.default.contract_address
    };

    tx_options.data = contract.methods.getAllByHash(hash).encodeABI();

    web3Obj.eth.call(tx_options).then(function (resp) {
      resp = web3.decodeArrayOfStrings(resp);
      resolve(resp);
    }).catch(function (error) {
      reject(error);
    });
  });
};

Document.isHashExists = function (hash) {
  return new Promise(function (resolve, reject) {
    var web3Obj = web3.getWeb3Object();
    var contract = new web3Obj.eth.Contract(contract_abi, _config2.default.contract_address);

    var tx_options = {
      to: _config2.default.contract_address
    };

    tx_options.data = contract.methods['hashExists'](hash).encodeABI();

    web3Obj.eth.call(tx_options).then(function (resp) {
      var flag = web3Obj.utils.hexToNumber(resp);
      resolve(flag);
    }).catch(function (error) {
      reject(error);
    });
  });
};

Document.isReferenceExists = function (referenceId) {
  return new Promise(function (resolve, reject) {
    var web3Obj = web3.getWeb3Object();
    var contract = new web3Obj.eth.Contract(contract_abi, _config2.default.contract_address);

    var tx_options = {
      to: _config2.default.contract_address
    };

    tx_options.data = contract.methods['isReferenceExists'](referenceId).encodeABI();

    web3Obj.eth.call(tx_options).then(function (resp) {
      var flag = web3Obj.utils.hexToNumber(resp);
      resolve(flag);
    }).catch(function (error) {
      reject(error);
    });
  });
};

exports.default = Document;
module.exports = exports['default'];
//# sourceMappingURL=document.js.map
