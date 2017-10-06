pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

 /**
   @title PrivateCall, a contract to execute calls with private data

   A contract that can receive requests to execute calls on itself.
   Every request can store encrypted data as a parameter, which can later be
   retrieved and decoded via web3.
   Requests may or may not require approval from the owner before execution.

   Inherits from OpenZeppelin's `Ownable`
 */
contract PrivateCall is Ownable {

  // The calls requested to be executed indexed by `sha3(data)`
  mapping(bytes32 => CallPending) public callsPending;

  // If the contract will require the owner's confirmation to execute the call
  bool public waitConfirmation;

  modifier fromSelf(){
    require(msg.sender == address(this));
    _;
  }

  struct CallPending {
    bytes callData;
    address sender;
    bool approved;
    bool success;
  }

  /**
     @dev Event triggered when a call is requested
  **/
  event CallStarted(address from, bytes32 dataHash);

  /**
     @dev Event triggered when a call is finished
  **/
  event CallFinish(address from, bytes32 dataHash);

  /**
     @dev Constructor. Creates the `PrivateCall` contract with
     `waitConfirmation` set to false
   */
  function PrivateCall(){
    waitConfirmation = false;
  }

  /**
     @dev `changeConfirmation` allows the owner of the contract to switch the
     `waitConfirmation` value

     @param _waitConfirmation The new `waitConfirmation` value
   */
  function changeConfirmation(bool _waitConfirmation) onlyOwner() {
    waitConfirmation = _waitConfirmation;
  }

  /**
     @dev `beginCall` requests the execution of a call by the contract

     @param publicCallData The call data to be executed
     @param privateData The extra, encrypted data stored as a parameter
     returns true if the call was requested succesfully
   */
  function beginCall(bytes publicCallData, bytes privateData) returns (bool) {

    bytes32 msgDataHash = sha3(msg.data);

    if (callsPending[msgDataHash].sender == address(0)) {
      callsPending[msgDataHash] = CallPending(
        publicCallData,
        tx.origin,
        !waitConfirmation,
        false
      );
      CallStarted( tx.origin, msgDataHash);
      if (!waitConfirmation){
        if (this.call(callsPending[msgDataHash].callData))
          callsPending[msgDataHash].success = true;
        CallFinish(callsPending[msgDataHash].sender, msgDataHash);
        return true;
      } else {
        return true;
      }
    } else {
      return false;
    }

  }

  /**
     @dev `continueCall` allows the owner to approve the execution of a call

     @param msgDataHash The hash of the call to be executed
   */
  function continueCall(bytes32 msgDataHash) onlyOwner() {

    require(callsPending[msgDataHash].sender != address(0));

    callsPending[msgDataHash].approved = true;

    if (this.call(callsPending[msgDataHash].callData))
      callsPending[msgDataHash].success = true;

    CallFinish(callsPending[msgDataHash].sender, msgDataHash);

  }

}
