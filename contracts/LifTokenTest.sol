pragma solidity >0.4.18;

import "./LifToken.sol";

contract LifTokenTest is LifToken {
  constructor(address addr, uint256 initialBalance) public {
      totalSupply_ = totalSupply_.add(initialBalance);
      balances[addr] = balances[addr].add(initialBalance);
      mintingFinished = true;
  }
}
