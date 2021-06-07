import { Buffer } from 'buffer';
import tx from 'ethereumjs-tx';
import Web3 from 'web3';
import config from '../config/config'

class Web3Provider {
  web3;
  initialized;
  
  constructor() {
    
  }

  init() {
    return new Promise((resolve, reject) => {
      // Do not initialize web3 on each init call
      if (this.initialized) {
        return resolve(true);
      }

      this.web3 = new Web3(config.provider_url);
      this.setDefaultAccount(config.address);
      this.initialized = true;
      resolve(true);
    });
  }

  getWeb3Object() {
    return this.web3;
  }

  signTransaction(rawTx){
    return new Promise((resolve, reject) => {
      let privateKey = new Buffer(config.private_key.substr(2), 'hex');
      let transaction = new tx(rawTx);
      transaction.sign(privateKey);
      let serializedTx = transaction.serialize();
      serializedTx = '0x' + serializedTx.toString('hex')
      resolve(serializedTx);
    })
  }

  call (address, fn, args, resp) {
    return new Promise((resolve, reject) => {
      let txOptions = this.generateCall(address, fn, args, resp);
      this.web3.eth.call(txOptions).then(data => {
        console.log(data);
        // data = this.decodeArrayOfStrings(data);
        // data = this.web3.eth.abi.decodeParameters(resp, data);
        // Decode data where you need it and how you need it
        resolve(data);
      })
      .catch(error => {
        reject(error);
      })
    });
  }

  getTransactionCount(address = ''){
    address = address || this.getDefaultAccount();
    return new Promise((resolve, reject) => {
      this
        .web3.eth.getTransactionCount(address)
        .then((count) => {
          resolve(count.toString());
        })
        .catch((err) => {
          reject(err)
        })
    });
  }

  toHex(number) {
    return this.web3.utils.toHex(number)
  }

  generateCall (address, contract, fn, args, resp) {
    let txOptions = {
      to: address
    };

    txOptions.data = contract.methods[fn](args).encodeABI()
    return txOptions;
  }

  setDefaultAccount(address) {
    this.web3.eth.defaultAccount = address;
  }

  getDefaultAccount () {
    return this.web3.eth.defaultAccount;
  }

  decodeArrayOfStrings(hexResp) {
    const INDEX_OF_LENGTH = 1; // Total size of array is in second chunk with index starting from 0
    const chunkSize = 32;
    let binary = hexResp.substr(2); // Remove leading 0x substring
    let arr = binary.match(/.{1,64}/g); // Divide response data in chunks of 64
    let list = [];
    if (arr && arr.length >= INDEX_OF_LENGTH) {
      let length = this.web3.utils.hexToNumber(`0x${arr[INDEX_OF_LENGTH]}`); // Get total elements in string array

      if (!length) {
        return list;
      }

      const arrayStartIndex = INDEX_OF_LENGTH + 1;
      arr = arr.slice(arrayStartIndex);
      // Actual strign array with offsets starts from next chunk
      // Get subset of array offsets
      // After length of array, offset of each element is stored in next chunks. This offset excludes first 2 chunks
      // which stores chunk size and array length
      let datasetOffsets = arr.slice(0, length);
      datasetOffsets.forEach((dataOffset, index) => {
        // Each element's offset is in hex. Convert it into number and divide by 32 (chunk size)
        const stringStartIndex = this.web3.utils.hexToNumber(`0x${dataOffset}`) / chunkSize;
        // String length is variable and stored in stringStartIndex + arrayStartIndex
        const lengthOfString = this.web3.utils.hexToNumber(`0x${arr[stringStartIndex]}`);
        // Get numberOfChunks this string is divided into. Each string is variable length and can span multiple chunks
        const numberOfChunks = Math.ceil(lengthOfString / chunkSize);
        // Get all chunks of the string from original array
        const subArray = arr.slice(stringStartIndex + 1, stringStartIndex + 1 + numberOfChunks);
        // Join all chunks of string and convert to Utf8
        const string = this.web3.utils.hexToUtf8(`0x${subArray.join('')}`);
        list.push(string);
      });

      return list;
    }
  }
}

export default Web3Provider;
