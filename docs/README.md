# WT Smart Contracts

The core of the Winding Tree platform are this smart contracts written in solidity language and deployed on the Etherum public blockchain.

This contracts are used to index only the necessary information so it is easily accessible by any member of the network, using blockchain as a database and record every change of all Winding Tree contracts in our DB.

## The Contracts

### Contract Registry

This contract will list and provide each important contract of the platform, saving his name, address and version and it will be only accessible by the WT founding team.

### WT Index

This contract will index and list every hotel and airline of the platform, it will index hotels by geological location, country, city and name. And it will index all airlines by their name and flight routes.

### WT Keys Registry

On WT the users will be available to send value and data using Líf tokens. The users can send data beetwen each other without spending Líf and only paying the mining fee of the Etehreum network. They can register a public key on the WT-Keys-Registry that will be used by another users to send encrypted data between them.
In short terms: This contract will allow the sending of encrypted data between users.

### Indexed

The Indexed smart contract is an extension of the Ownable contract from zeppelin-solidity that also sets an index address. One contract that is indexed can require calls to go through the index contract and that calls should be sent by the owner of the destination contract. This allows us to delegate the ownership of the hotels and airlines contracts and keep records of all changes on them outside the blockchain.

### Parent

A contract that can contain childs contracts registered by address. The contract provides a childs private variable with add/remove child methods and a modifier to request only child contracts as msg.sender on functions.

### PrivateCall

The PrivateCall smart contract allows to have pending transactions on smart contracts, with data stored, that would be encrypted/decrypted using the WT Key Registry. To obtain the encrypted data the receiver will need to decode the transaction data using the abi decoder. By using the WTKey library it is easy to decrypt the data and check the integrity. If the data is correct it is possible to continue the call and execute the publicCall the user sent at the beginning.

Steps when user Augusto wants to make a booking on a Flight published by WTAir:

1. Augusto looks for the WTAir public key on WTKeysRegistry
2. Augusto encrypts the data using multiple key encryption (adding WTAir as owner of the data too) and sign it
3. Augusto wants to call the method booking() on one of the routes of WTAir, so he builds the data to execute that call
4. Augusto creates the pending transaction on the WTAir route by sending his public data to execute the booking() and his personal data encrypted
5. WTAir receive the transactions, looks for Augusto's public key on WTKeysRegistry and decrypts the data using WTAir's private key and verify with Augusto's public key
6. All the data that Augusto sent is correct, WTAir allow the execution of the booking call sending a continueCall() transaction

## Platform

![WT Platform](https://lh6.googleusercontent.com/MZyX0oP3VdsUXoYqKe4FNkuD5WnN2dTYQzmXvAX5MfGZgfRx0EbpS8zTTJS5s_DeTeLAZ8Dccj9LX1s=w1920-h918)

### Hotels

WT Index -> Hotel -> UnitType -> Units

#### Hotel

Every Hotel registered on Winding Tree will be on a Hotel contract, this contract has the hotel information, address, location, and a list of all the differnet types of accomodations the hotel provides, these are called Unit Types, for example a BASIC_ROOM, CABIN, PREMIUM_ROOM, etc. The hotel will provide a certain amount of its UnitTypes for rent.

#### Hotel Contract Owner interface

```
contract Hotel_Owner_Interface is Indexed {

  // Main information
  string public name;
  string public description;
  uint public created;

  // Address and Location
  string public lineOne;
  string public lineTwo;
  string public zip;
  string public country;
  uint public timezone;
  uint public latitude;
  uint public longitude;

  // Owner methods
  function editInfo(string _name, string _description) troughIndex() onlyOwner();
  function editAddress(string _lineOne, string _lineTwo, string _zip, string _country) troughIndex() onlyOwner() ;
  function editLocation(uint _timezone, uint _longitude, uint _latitude) troughIndex() onlyOwner();
  function addUnitType(address addr, bytes32 unitType) troughIndex() onlyOwner();
  function removeUnitType(bytes32 unitType, uint index) troughIndex() onlyOwner();
  function changeUnitType(bytes32 unitType, address newAddr) troughIndex() onlyOwner();
  function addImage(string url) troughIndex() onlyOwner();
  function removeImage(uint index) troughIndex() onlyOwner();
  function callUnitType(bytes32 unitType, bytes data) troughIndex() onlyOwner();

  // Public constant methods
  function getUnitType(bytes32 unitType) constant returns (address);
  function getUnitTypeNames() constant returns (bytes32[]);

}
```

#### Hotel Contract Public Interface

```
contract Hotel_Public_Interface {

  // Main information
  string public name;
  string public description;
  uint public created;

  // Address and Location
  string public lineOne;
  string public lineTwo;
  string public zip;
  string public country;
  uint public timezone;
  uint public latitude;
  uint public longitude;

  // Public constant methods
  function getUnitType(bytes32 unitType) constant returns (address);
  function getUnitTypeNames() constant returns (bytes32[]);
  function getImage(uint i) constant returns (string);
  function getImagesLength() constant returns (uint);

}
```

#### Hotel Unit Type

Each hotel unit type will have a quantity of their type, description, amenities, minimun and maximun amount of guests, price, and the avaliability of each Unit for rent. The users will make the bookings and reservations directly to this contract, which also supports PrivateCalls.

#### UnitType Contract Owner interface

```
contract UnitType_Owner_Interface is Ownable {

  bool public active;
  bytes32 public unitType;
  uint public totalUnits;

  event Book(address from, uint unitIndex, uint fromDay, uint daysAmount);

  // Owner methods
  function addUnit() onlyOwner();
  function edit(string description, uint minGuests, uint maxGuests, string price) onlyOwner();
  function active(bool _active) onlyOwner();
  function unitActive(uint unitIndex, bool _active) onlyOwner();
  function setPrice(string price, uint unitIndex, uint fromDay, uint daysAmount) onlyOwner();
  function addAmenity(uint amenity) onlyOwner();
  function removeAmenity( uint amenity) onlyOwner();
  function addImage(string url) onlyOwner();
  function removeImage(uint imageIndex) onlyOwner();
  function removeUnit(uint unitIndex) onlyOwner();

  // Public methods
  function getInfo() constant returns(string, uint, uint, string, bool);
  function getUnit(uint unitIndex) constant returns(bool);
  function getAmenities() constant returns(uint[]);
  function getReservation( uint unitIndex, uint day ) constant returns(string, address);
  function getImage(uint i) constant returns (string);
  function getImagesLength() constant returns (uint);

}
```

#### UnitType Contract Public Interface

```
contract UnitType_Public_Interface is PrivateCall {

  bool public active;
  bytes32 public unitType;
  uint public totalUnits;

  event Book(address from, uint unitIndex, uint fromDay, uint daysAmount);

  // Methods from private call
  function book( address from, uint unitIndex, uint fromDay, uint daysAmount ) fromSelf();

  // Public methods
  function getInfo() constant returns(string, uint, uint, string, bool);
  function getUnit(uint unitIndex) constant returns(bool);
  function getAmenities() constant returns(uint[]);
  function getReservation( uint unitIndex, uint day ) constant returns(string, address);
  function getImage(uint i) constant returns (string);
  function getImagesLength() constant returns (uint);

}
```
### Airlines

WT Platform -> Airline -> Route -> Flights

#### Airline

Every airline that is registered on WT will have an Airline smart contract where they will save their name, legal address, country, and website. From here they can create new routes, if they have a flight plan from Madrid to Barcelona they can create a route between MAD->BCN and BCN->MAD.

#### Air Route

This smart contract will be owned by airlines, they would be able to upload all their flight plan for the route. The users will be making the bookings on this contracts using the PrivateCall strategy.
