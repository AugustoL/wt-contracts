const WTHotelInterface = artifacts.require('Hotel_Interface.sol');

const {
  isZeroAddress,
  isZeroUint,
  isZeroString,
  isZeroBytes32,
} = require('./misc');

/**
 * Async method that creates a new empty Hotel.
 * @param  {Instance} wtIndex            WTIndex contract instance
 * @param  {Address} hotelAccount        address of the hotel's account
 * @return {Instance} Hotel
 * @example
 *   const wtHotel = await createHotel(accounts[2]);
 *   wtHotel.callHotel(..etc..)
 */
async function createHotel (wtIndex, hotelAccount) {
  await wtIndex.registerHotel('WT Hotel', 'WT Test Hotel', { from: hotelAccount });
  let wtHotelAddress = await wtIndex.getHotelsByManager(hotelAccount);
  let wtHotel = await WTHotelInterface.at(wtHotelAddress[0]);

  return wtHotel;
}

/**
 * Async function which gets all info associated with hotel, its unit types and units. Zero
 * elements in the solidity arrays are filtered out and data types are converted from
 * their solidity form to JS, i.e. bytes32 --> utf8.
 * @param  {Instance} wtHotel Hotel contract instance
 * @return {Object}   data
 */
async function getHotelInfo (wtHotel) {
  // Hotel Info
  const url = await wtHotel.url();
  const customIdHash = await wtHotel.customIdHash();
  const manager = await wtHotel.manager();
  const created = await wtHotel.created();

  return {
    url: isZeroString(url) ? null : url,
    customIdHash: isZeroBytes32(customIdHash) ? null : customIdHash,
    manager: isZeroAddress(manager) ? null : manager,
    created: isZeroUint(created) ? null : parseInt(created),
  };
}

module.exports = {
  createHotel: createHotel,
  getHotelInfo: getHotelInfo,
};
