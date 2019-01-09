const WTAirlineIndex = artifacts.require('WTAirlineIndex');


module.exports = function (deployer, network, accounts) {
  if (network == 'mainnet' || network == 'ropsten') {
    console.log('Network:', network);
    console.log('Accounts:', accounts);

    const lifTokenAddress = (network == 'mainnet')
      ? '0xeb9951021698b42e4399f9cbb6267aa35f82d59d'
      : '0xb6e225194a1c892770c43d4b529841c99b3da1d7';

    return deployer.deploy(WTAirlineIndex).then(function (WTAirlineIndexContract) {
      console.log('WTAirlineIndex address:', WTAirlineIndexContract.address);
      return WTAirlineIndexContract.setLifToken(lifTokenAddress);
    }).then(function (tx) {
        console.log('LifToken set on tx:', tx.tx);
        console.log('LifToken address set to:', lifTokenAddress);
    });
  }
};
