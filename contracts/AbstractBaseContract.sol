pragma solidity ^0.4.25;


/**
 * @title AbstractBaseContract
 * @dev The basic abstract contract that every contract in the WT platform should implement.
 * The version and contract type are used to identify the correct interface
 * for each WT contract.
 */
contract AbstractBaseContract {

    // The hex-encoded version, follows the semantic standard MAJOR.MINOR.PATCH-EXTENSION
    // It should always match the version in package.json.
    bytes32 public version;

    // The hex-encoded type of the contract, in all lowercase letters without any spaces.
    // It has to be defined in each contract that uses this interface.
    bytes32 public contractType;
}
