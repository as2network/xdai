'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _buffer = require('buffer');

var _ethereumjsTx = require('ethereumjs-tx');

var _ethereumjsTx2 = _interopRequireDefault(_ethereumjsTx);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Web3Provider = function () {
  function Web3Provider() {
    _classCallCheck(this, Web3Provider);
  }

  _createClass(Web3Provider, [{
    key: 'init',
    value: function init() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        // Do not initialize web3 on each init call
        if (_this.initialized) {
          return resolve(true);
        }

        _this.web3 = new _web2.default(_config2.default.provider_url);
        _this.setDefaultAccount(_config2.default.address);
        _this.initialized = true;
        resolve(true);
      });
    }
  }, {
    key: 'getWeb3Object',
    value: function getWeb3Object() {
      return this.web3;
    }
  }, {
    key: 'signTransaction',
    value: function signTransaction(rawTx) {
      return new Promise(function (resolve, reject) {
        var privateKey = new _buffer.Buffer(_config2.default.private_key.substr(2), 'hex');
        var transaction = new _ethereumjsTx2.default(rawTx);
        transaction.sign(privateKey);
        var serializedTx = transaction.serialize();
        serializedTx = '0x' + serializedTx.toString('hex');
        resolve(serializedTx);
      });
    }
  }, {
    key: 'call',
    value: function call(address, fn, args, resp) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var txOptions = _this2.generateCall(address, fn, args, resp);
        _this2.web3.eth.call(txOptions).then(function (data) {
          console.log(data);
          // data = this.decodeArrayOfStrings(data);
          // data = this.web3.eth.abi.decodeParameters(resp, data);
          // Decode data where you need it and how you need it
          resolve(data);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'getTransactionCount',
    value: function getTransactionCount() {
      var _this3 = this;

      var address = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      address = address || this.getDefaultAccount();
      return new Promise(function (resolve, reject) {
        _this3.web3.eth.getTransactionCount(address).then(function (count) {
          resolve(count.toString());
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'toHex',
    value: function toHex(number) {
      return this.web3.utils.toHex(number);
    }
  }, {
    key: 'generateCall',
    value: function generateCall(address, contract, fn, args, resp) {
      var txOptions = {
        to: address
      };

      txOptions.data = contract.methods[fn](args).encodeABI();
      return txOptions;
    }
  }, {
    key: 'setDefaultAccount',
    value: function setDefaultAccount(address) {
      this.web3.eth.defaultAccount = address;
    }
  }, {
    key: 'getDefaultAccount',
    value: function getDefaultAccount() {
      return this.web3.eth.defaultAccount;
    }
  }, {
    key: 'decodeArrayOfStrings',
    value: function decodeArrayOfStrings(hexResp) {
      var _this4 = this;

      var INDEX_OF_LENGTH = 1; // Total size of array is in second chunk with index starting from 0
      var chunkSize = 32;
      var binary = hexResp.substr(2); // Remove leading 0x substring
      var arr = binary.match(/.{1,64}/g); // Divide response data in chunks of 64
      var list = [];
      if (arr && arr.length >= INDEX_OF_LENGTH) {
        var length = this.web3.utils.hexToNumber('0x' + arr[INDEX_OF_LENGTH]); // Get total elements in string array

        if (!length) {
          return list;
        }

        var arrayStartIndex = INDEX_OF_LENGTH + 1;
        arr = arr.slice(arrayStartIndex);
        // Actual strign array with offsets starts from next chunk
        // Get subset of array offsets
        // After length of array, offset of each element is stored in next chunks. This offset excludes first 2 chunks
        // which stores chunk size and array length
        var datasetOffsets = arr.slice(0, length);
        datasetOffsets.forEach(function (dataOffset, index) {
          // Each element's offset is in hex. Convert it into number and divide by 32 (chunk size)
          var stringStartIndex = _this4.web3.utils.hexToNumber('0x' + dataOffset) / chunkSize;
          // String length is variable and stored in stringStartIndex + arrayStartIndex
          var lengthOfString = _this4.web3.utils.hexToNumber('0x' + arr[stringStartIndex]);
          // Get numberOfChunks this string is divided into. Each string is variable length and can span multiple chunks
          var numberOfChunks = Math.ceil(lengthOfString / chunkSize);
          // Get all chunks of the string from original array
          var subArray = arr.slice(stringStartIndex + 1, stringStartIndex + 1 + numberOfChunks);
          // Join all chunks of string and convert to Utf8
          var string = _this4.web3.utils.hexToUtf8('0x' + subArray.join(''));
          list.push(string);
        });

        return list;
      }
    }
  }]);

  return Web3Provider;
}();

exports.default = Web3Provider;
module.exports = exports['default'];
//# sourceMappingURL=web3.js.map
