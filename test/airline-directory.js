const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const AirlineDirectory = Contracts.getFromLocal('AirlineDirectory');
const AirlineDirectoryUpgradeabilityTest = Contracts.getFromLocal('AirlineDirectoryUpgradeabilityTest');
// eaiser interaction with truffle-contract
const Organization = artifacts.require('Organization');
const AirlineDirectoryInterface = artifacts.require('AirlineDirectoryInterface');
const OrganizationUpgradeabilityTest = artifacts.require('OrganizationUpgradeabilityTest');

contract('AirlineDirectory', (accounts) => {
  const airlineDirectoryOwner = accounts[1];
  const proxyOwner = accounts[2];
  const airlineAccount = accounts[3];
  const tokenAddress = accounts[5];

  let airlineDirectoryProxy;
  let airlineDirectory;
  let project;

  // Deploy new airlineDirectory but use AirlineDirectoryInterface for contract interaction
  beforeEach(async () => {
    project = await TestHelper();
    airlineDirectoryProxy = await project.createProxy(AirlineDirectory, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [airlineDirectoryOwner, tokenAddress, project.app.address],
    });
    airlineDirectory = await AirlineDirectoryInterface.at(airlineDirectoryProxy.address);
  });

  describe('upgradeability', () => {
    it('should upgrade AirlineDirectory and have new functions in Index and Airline contracts', async () => {
      // add old organization
      await airlineDirectory.createAndAddAirline('dataUri', { from: airlineAccount });
      // upgrade directory
      const upgradedDirectory = await AirlineDirectoryUpgradeabilityTest.new({ from: airlineDirectoryOwner });
      await project.proxyAdmin.upgradeProxy(airlineDirectoryProxy.address, upgradedDirectory.address, AirlineDirectoryUpgradeabilityTest);
      const newDirectory = await AirlineDirectoryUpgradeabilityTest.at(airlineDirectoryProxy.address);
      // add new organization
      await newDirectory.methods.createAndAddAirline('dataUri2').send({ from: airlineAccount });
      const allAirlines = help.filterZeroAddresses(await newDirectory.methods.getAirlines().call());
      // test values
      assert.isDefined(await newDirectory.methods.airlines(1).call());
      assert.isDefined(await newDirectory.methods.airlines(2).call());
      assert.isFalse(help.isZeroAddress(allAirlines[0]));
      assert.isFalse(help.isZeroAddress(allAirlines[1]));
      assert.equal(await newDirectory.methods.airlinesIndex(allAirlines[0]).call(), 1);
      assert.equal(await newDirectory.methods.airlinesIndex(allAirlines[1]).call(), 2);
      assert.equal(await (await Organization.at(allAirlines[0])).dataUri(), 'dataUri');
      assert.equal(await (await Organization.at(allAirlines[1])).dataUri(), 'dataUri2');
      assert.equal(await (await OrganizationUpgradeabilityTest.at(allAirlines[1])).newFunction(), 100);
      assert.equal(await newDirectory.methods.newFunction().call(), 100);
    });
  });

  describe('createAirline', () => {
    it('should create airline', async () => {
      const address = await airlineDirectory.createAirline.call('dataUri', { from: airlineAccount });
      const receipt = await airlineDirectory.createAirline('dataUri', { from: airlineAccount });
      assert.equal(receipt.logs.length, 2);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], airlineAccount);
      assert.equal(receipt.logs[1].event, 'OrganizationCreated');
      assert.equal(receipt.logs[1].args.organization, address);
    });
  });

  describe('addAirline', () => {
    it('should add airline', async () => {
      const address = await airlineDirectory.createAirline.call('dataUri', { from: airlineAccount });
      await airlineDirectory.createAirline('dataUri', { from: airlineAccount });
      const receipt = await airlineDirectory.addAirline(address, { from: airlineAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationAdded');
      assert.equal(receipt.logs[0].args.organization, address);
      assert.equal(receipt.logs[0].args.index, 1);
    });
  });

  describe('createAndAddAirline', () => {
    it('should create and add airline', async () => {
      const address = await airlineDirectory.createAndAddAirline.call('dataUri', { from: airlineAccount });
      const receipt = await airlineDirectory.createAndAddAirline('dataUri', { from: airlineAccount });
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], airlineAccount);
      assert.equal(receipt.logs[1].event, 'OrganizationCreated');
      assert.equal(receipt.logs[1].args.organization, address);
      assert.equal(receipt.logs[2].event, 'OrganizationAdded');
      assert.equal(receipt.logs[2].args.organization, address);
      assert.equal(receipt.logs[2].args.index, 1);
    });
  });

  describe('removeAirline', () => {
    it('should remove an airline', async () => {
      const address = await airlineDirectory.createAndAddAirline.call('dataUri', { from: airlineAccount });
      await airlineDirectory.createAndAddAirline('dataUri', { from: airlineAccount });
      const receipt = await airlineDirectory.removeAirline(address, { from: airlineAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRemoved');
      assert.equal(receipt.logs[0].args[0], address);
    });
  });

  describe('getAirlinesLength', () => {
    it('should count airlines properly', async () => {
      // We start with empty address on the zero airlineDirectory
      let length = await airlineDirectory.getAirlinesLength();
      // length is a bignumber
      assert.equal(length.toNumber(), 1);
      const address = await airlineDirectory.createAndAddAirline.call('aaa', { from: airlineAccount });
      await airlineDirectory.createAndAddAirline('aaa', { from: airlineAccount });
      await airlineDirectory.createAndAddAirline('bbb', { from: airlineAccount });
      length = await airlineDirectory.getAirlinesLength();
      assert.equal(length.toNumber(), 3);
      await airlineDirectory.removeAirline(address, { from: airlineAccount });
      length = await airlineDirectory.getAirlinesLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getAirlines', () => {
    it('should return airlines properly', async () => {
      let airlines = await airlineDirectory.getAirlines();
      assert.equal(help.filterZeroAddresses(airlines).length, 0);
      const address = await airlineDirectory.createAndAddAirline.call('aaa', { from: airlineAccount });
      await airlineDirectory.createAndAddAirline('aaa', { from: airlineAccount });
      await airlineDirectory.createAndAddAirline('bbb', { from: airlineAccount });
      airlines = await airlineDirectory.getAirlines();
      assert.equal(help.filterZeroAddresses(airlines).length, 2);
      await airlineDirectory.removeAirline(address, { from: airlineAccount });
      airlines = await airlineDirectory.getAirlines();
      assert.equal(help.filterZeroAddresses(airlines).length, 1);
    });
  });
});
