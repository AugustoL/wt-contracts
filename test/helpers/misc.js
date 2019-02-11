const web3utils = require('web3-utils');
const _ = require('lodash');
const ethJsUtil = require('ethereumjs-util');
const web3 = new Web3('ws://localhost:8546');

const zeroAddress = '0x0000000000000000000000000000000000000000';

module.exports = {
  zeroAddress: zeroAddress,

  isZeroAddress: function (val) {
    return val === zeroAddress;
  },

  isZeroString: function (val) {
    return !(val.length);
  },

  isZeroUint: function (val) {
    return parseInt(val) === 0;
  },

  isInvalidOpcodeEx: function (e) {
    if (
      e.message.search('invalid opcode') >= 0 || // ethereumjs-testrpc at least <= 4
      e.message.search('revert') >= 0 // ganache-cli at least 6+
    ) {
      return true;
    } else {
      console.error(e);
      return false;
    }
  },

  bytes32ToString: function (hex) {
    return web3utils.hexToUtf8(hex);
  },

  stringToBytes32: function (text) {
    return web3utils.utf8ToHex(text);
  },

  // Sample implementation for later re-use
  determineAddress: function (sender, nonce) {
    return web3utils.toChecksumAddress(
      ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
        sender,
        nonce
      )
      ));
  },

  /**
   * Traverses a solidity array and returns an array of all its non-zero elements
   * @param {Function} getAtIndex reference to a getter method (e.g. getImage)
   * @param {Number}   length solidity array's length
   * @param {Function} zeroComparator e.g isZeroAddress
   * @return {Promise} Array
   */
  jsArrayFromSolidityArray: async function (getAtIndex, length, zeroComparator) {
    const arr = [];

    for (let i = 0; i < length; i++) {
      let item = await getAtIndex(i);
      arr.push(item);
    };

    return (zeroComparator !== undefined)
      ? arr.filter(item => !zeroComparator(item))
      : arr;
  },

  filterZeroAddresses: function (listOfAddresses) {
    return _.filter(listOfAddresses, (a) => a !== zeroAddress);
  },

  promisify: function (inner) {
    return new Promise((resolve, reject) => {
      inner((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
};
