const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const OtaDirectory = Contracts.getFromLocal('OtaDirectory');
const OtaDirectoryUpgradeabilityTest = Contracts.getFromLocal('OtaDirectoryUpgradeabilityTest');
// eaiser interaction with truffle-contract
const Organization = artifacts.require('Organization');
const OtaDirectoryInterface = artifacts.require('OtaDirectoryInterface');
const OrganizationUpgradeabilityTest = artifacts.require('OrganizationUpgradeabilityTest');

contract('OtaDirectory', (accounts) => {
  const otaDirectoryOwner = accounts[1];
  const proxyOwner = accounts[2];
  const otaAccount = accounts[3];
  const tokenAddress = accounts[5];

  let otaDirectoryProxy;
  let otaDirectory;
  let project;

  // Deploy new otaDirectory but use OtaDirectoryInterface for contract interaction
  beforeEach(async () => {
    project = await TestHelper();
    otaDirectoryProxy = await project.createProxy(OtaDirectory, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [otaDirectoryOwner, tokenAddress, project.app.address],
    });
    otaDirectory = await OtaDirectoryInterface.at(otaDirectoryProxy.address);
  });

  describe('upgradeability', () => {
    it('should upgrade OtaDirectory and have new functions in Index and Ota contracts', async () => {
      // add old organization
      await otaDirectory.createAndAddOta('dataUri', { from: otaAccount });
      // upgrade directory
      const upgradedDirectory = await OtaDirectoryUpgradeabilityTest.new({ from: otaDirectoryOwner });
      await project.proxyAdmin.upgradeProxy(otaDirectoryProxy.address, upgradedDirectory.address, OtaDirectoryUpgradeabilityTest);
      const newDirectory = await OtaDirectoryUpgradeabilityTest.at(otaDirectoryProxy.address);
      // add new organization
      await newDirectory.methods.createAndAddOta('dataUri2').send({ from: otaAccount });
      const allOtas = help.filterZeroAddresses(await newDirectory.methods.getOtas().call());
      // test values
      assert.isDefined(await newDirectory.methods.otas(1).call());
      assert.isDefined(await newDirectory.methods.otas(2).call());
      assert.isFalse(help.isZeroAddress(allOtas[0]));
      assert.isFalse(help.isZeroAddress(allOtas[1]));
      assert.equal(await newDirectory.methods.otasIndex(allOtas[0]).call(), 1);
      assert.equal(await newDirectory.methods.otasIndex(allOtas[1]).call(), 2);
      assert.equal(await (await Organization.at(allOtas[0])).dataUri(), 'dataUri');
      assert.equal(await (await Organization.at(allOtas[1])).dataUri(), 'dataUri2');
      assert.equal(await (await OrganizationUpgradeabilityTest.at(allOtas[1])).newFunction(), 100);
      assert.equal(await newDirectory.methods.newFunction().call(), 100);
    });
  });

  describe('createOta', () => {
    it('should create ota', async () => {
      const address = await otaDirectory.createOta.call('dataUri', { from: otaAccount });
      const receipt = await otaDirectory.createOta('dataUri', { from: otaAccount });
      assert.equal(receipt.logs.length, 2);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], otaAccount);
      assert.equal(receipt.logs[1].event, 'OrganizationCreated');
      assert.equal(receipt.logs[1].args.organization, address);
    });
  });

  describe('addOta', () => {
    it('should add ota', async () => {
      const address = await otaDirectory.createOta.call('dataUri', { from: otaAccount });
      await otaDirectory.createOta('dataUri', { from: otaAccount });
      const receipt = await otaDirectory.addOta(address, { from: otaAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationAdded');
      assert.equal(receipt.logs[0].args.organization, address);
      assert.equal(receipt.logs[0].args.index, 1);
    });
  });

  describe('createAndAddOta', () => {
    it('should create and add ota', async () => {
      const address = await otaDirectory.createAndAddOta.call('dataUri', { from: otaAccount });
      const receipt = await otaDirectory.createAndAddOta('dataUri', { from: otaAccount });
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], otaAccount);
      assert.equal(receipt.logs[1].event, 'OrganizationCreated');
      assert.equal(receipt.logs[1].args.organization, address);
      assert.equal(receipt.logs[2].event, 'OrganizationAdded');
      assert.equal(receipt.logs[2].args.organization, address);
      assert.equal(receipt.logs[2].args.index, 1);
    });
  });

  describe('removeOta', () => {
    it('should remove an ota', async () => {
      const address = await otaDirectory.createAndAddOta.call('dataUri', { from: otaAccount });
      await otaDirectory.createAndAddOta('dataUri', { from: otaAccount });
      const receipt = await otaDirectory.removeOta(address, { from: otaAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRemoved');
      assert.equal(receipt.logs[0].args[0], address);
    });
  });

  describe('getOtasLength', () => {
    it('should count otas properly', async () => {
      // We start with empty address on the zero otaDirectory
      let length = await otaDirectory.getOtasLength();
      // length is a bignumber
      assert.equal(length.toNumber(), 1);
      const address = await otaDirectory.createAndAddOta.call('aaa', { from: otaAccount });
      await otaDirectory.createAndAddOta('aaa', { from: otaAccount });
      await otaDirectory.createAndAddOta('bbb', { from: otaAccount });
      length = await otaDirectory.getOtasLength();
      assert.equal(length.toNumber(), 3);
      await otaDirectory.removeOta(address, { from: otaAccount });
      length = await otaDirectory.getOtasLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getOtas', () => {
    it('should return otas properly', async () => {
      let otas = await otaDirectory.getOtas();
      assert.equal(help.filterZeroAddresses(otas).length, 0);
      const address = await otaDirectory.createAndAddOta.call('aaa', { from: otaAccount });
      await otaDirectory.createAndAddOta('aaa', { from: otaAccount });
      await otaDirectory.createAndAddOta('bbb', { from: otaAccount });
      otas = await otaDirectory.getOtas();
      assert.equal(help.filterZeroAddresses(otas).length, 2);
      await otaDirectory.removeOta(address, { from: otaAccount });
      otas = await otaDirectory.getOtas();
      assert.equal(help.filterZeroAddresses(otas).length, 1);
    });
  });
});
