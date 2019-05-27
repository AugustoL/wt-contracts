const assert = require('chai').assert;
const help = require('./helpers/index.js');

const Organization = artifacts.require('Organization');
const TestSegmentDirectory = artifacts.require('TestSegmentDirectory');
const SegmentDirectory = artifacts.require('SegmentDirectory');

contract('TestSegmentDirectory', (accounts) => {
  const segmentDirectoryOwner = accounts[1];
  const foodTruckAccount = accounts[3];
  const nonOwnerAccount = accounts[4];
  const tokenAddress = accounts[5];

  let testSegmentDirectory;
  let segmentDirectory;

  beforeEach(async () => {
    testSegmentDirectory = await TestSegmentDirectory.new();
    await testSegmentDirectory.initialize(segmentDirectoryOwner, tokenAddress);
    segmentDirectory = await SegmentDirectory.at(testSegmentDirectory.address);
  });

  describe('initialize', () => {
    it('should set liftoken', async () => {
      assert.equal(await segmentDirectory.LifToken(), tokenAddress);
    });
  });

  describe('transferOwnership', async () => {
    it('should transfer ownership', async () => {
      await segmentDirectory.transferOwnership(nonOwnerAccount, { from: segmentDirectoryOwner });
      // We cannot access _owner directly, it is not public
      try {
        await segmentDirectory.setLifToken(tokenAddress, { from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
      await segmentDirectory.transferOwnership(segmentDirectoryOwner, { from: nonOwnerAccount });
    });

    it('should not transfer ownership when initiated from a non-owner', async () => {
      try {
        await segmentDirectory.transferOwnership(tokenAddress, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not transfer ownership to zero address', async () => {
      try {
        await segmentDirectory.transferOwnership(help.zeroAddress, { from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('setLifToken', () => {
    it('should set the LifToken address', async () => {
      await segmentDirectory.setLifToken(tokenAddress, { from: segmentDirectoryOwner });
      const setValue = await segmentDirectory.LifToken();
      assert.equal(setValue, tokenAddress);
    });

    it('should throw if non-owner sets the LifToken address', async () => {
      try {
        await segmentDirectory.setLifToken(tokenAddress, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('getOrganizationsLength', () => {
    it('should count foodTrucks properly', async () => {
      // length is a bignumber
      let length = await segmentDirectory.getOrganizationsLength();
      // We start with empty address on the zero segmentDirectory
      assert.equal(length.toNumber(), 1);
      await testSegmentDirectory.createAndRegisterFoodTruck('aaa', { from: foodTruckAccount });
      length = await segmentDirectory.getOrganizationsLength();
      assert.equal(length.toNumber(), 2);
      const receipt = await testSegmentDirectory.createAndRegisterFoodTruck('bbb', { from: foodTruckAccount });
      length = await testSegmentDirectory.getOrganizationsLength();
      assert.equal(length.toNumber(), 3);
      const expectedFoodTruckAddress = receipt.logs[0].address;
      await testSegmentDirectory.deregisterFoodTruck(expectedFoodTruckAddress, { from: foodTruckAccount });
      length = await testSegmentDirectory.getOrganizationsLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getOrganizations', () => {
    it('should return foodTrucks properly', async () => {
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 0);
      const receipt = await testSegmentDirectory.createAndRegisterFoodTruck('aaa', { from: foodTruckAccount });
      const expectedFoodTruckAddress = receipt.logs[0].address;
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 1);
      await testSegmentDirectory.createAndRegisterFoodTruck('bbb', { from: foodTruckAccount });
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 2);
      await testSegmentDirectory.deregisterFoodTruck(expectedFoodTruckAddress, { from: foodTruckAccount });
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 1);
    });
  });

  describe('getOrganizationsByManager', () => {
    it('should return empty list for a manager without foodTrucks', async () => {
      const orgList = await segmentDirectory.getOrganizationsByManager(foodTruckAccount);
      assert.equal(orgList.length, 0);
    });

    it('should return list of foodTrucks for existing manager', async () => {
      await testSegmentDirectory.createAndRegisterFoodTruck('bbb', { from: foodTruckAccount });
      const orgList = await segmentDirectory.getOrganizationsByManager(foodTruckAccount);
      assert.equal(orgList.length, 1);
    });

    it('should return empty list for a non-existing manager', async () => {
      const orgList = await segmentDirectory.getOrganizationsByManager(nonOwnerAccount);
      assert.equal(orgList.length, 0);
    });
  });

  describe('createFoodTruck', () => {
    it('should create an Organization contract', async () => {
      // First emulate the transaction, then actually run it
      const address = await testSegmentDirectory.createFoodTruck.call('dataUri', { from: foodTruckAccount });
      const receipt = await testSegmentDirectory.createFoodTruck('dataUri', { from: foodTruckAccount });
      const organization = await Organization.at(address);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.manager, foodTruckAccount);
      assert.equal(info.dataUri, 'dataUri');
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], testSegmentDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], testSegmentDirectory.address);
      assert.equal(receipt.logs[1].args[1], foodTruckAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args[0], address);
    });

    it('should not register the organization into any mapping', async () => {
      await testSegmentDirectory.createFoodTruck('dataUri', { from: foodTruckAccount });
      const orgList = await segmentDirectory.getOrganizationsByManager(foodTruckAccount);
      assert.equal(orgList.length, 0);
    });

    it('should not create an organization with empty dataUri', async () => {
      try {
        await testSegmentDirectory.createFoodTruck('', { from: foodTruckAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('registerFoodTruck', () => {
    let organization;
    beforeEach(async () => {
      organization = await Organization.new('dataUri', { from: foodTruckAccount });
    });

    it('should add the organization to the registry', async () => {
      const receipt = await testSegmentDirectory.registerFoodTruck(organization.address, { from: foodTruckAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[0].args[0], organization.address);
      assert.equal(receipt.logs[0].args.managerIndex, 0);
      assert.equal(receipt.logs[0].args.allIndex, 1);

      const allFoodTrucks = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const foodTrucksByManager = await segmentDirectory.getOrganizationsByManager(foodTruckAccount);
      const actualIndexPos = await segmentDirectory.organizationsIndex(allFoodTrucks[0]);
      const foodTruck = allFoodTrucks[0];
      const foodTruckByManager = foodTrucksByManager[0];
      assert.isDefined(foodTruck);
      assert.isDefined(foodTruckByManager);
      assert.isFalse(help.isZeroAddress(foodTruck));
      assert.isFalse(help.isZeroAddress(foodTruckByManager));
      assert.equal(actualIndexPos, 1);
      assert.equal(foodTruck, foodTrucksByManager);
    });
  });

  describe('createAndRegisterFoodTruck', () => {
    it('should create and add the organization to the registry', async () => {
      const address = await testSegmentDirectory.createAndRegisterFoodTruck.call('dataUri', { from: foodTruckAccount });
      const receipt = await testSegmentDirectory.createAndRegisterFoodTruck('dataUri', { from: foodTruckAccount });
      const organization = await Organization.at(address);
      assert.equal(receipt.logs.length, 4);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], testSegmentDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], testSegmentDirectory.address);
      assert.equal(receipt.logs[1].args[1], foodTruckAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args[0], address);
      assert.equal(receipt.logs[3].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[3].args[0], organization.address);
      assert.equal(receipt.logs[3].args.managerIndex, 0);
      assert.equal(receipt.logs[3].args.allIndex, 1);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.manager, foodTruckAccount);
      assert.equal(info.dataUri, 'dataUri');
      const allFoodTrucks = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const foodTrucksByManager = await segmentDirectory.getOrganizationsByManager(foodTruckAccount);
      const actualIndexPos = await segmentDirectory.organizationsIndex(allFoodTrucks[0]);
      const foodTruck = allFoodTrucks[0];
      const foodTruckByManager = foodTrucksByManager[0];
      assert.isDefined(foodTruck);
      assert.isDefined(foodTruckByManager);
      assert.isFalse(help.isZeroAddress(foodTruck));
      assert.isFalse(help.isZeroAddress(foodTruckByManager));
      assert.equal(actualIndexPos, 1);
      assert.equal(foodTruck, foodTrucksByManager);
    });
  });

  describe('deregisterFoodTruck', () => {
    let organization;
    beforeEach(async () => {
      const receipt = await testSegmentDirectory.createAndRegisterFoodTruck('aaa', { from: foodTruckAccount });
      organization = await Organization.at(receipt.logs[2].args[0]);
    });

    it('should remove organization from the directory', async () => {
      await testSegmentDirectory.deregisterFoodTruck(organization.address, { from: foodTruckAccount });
      const allFoodTrucks = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      assert.equal(allFoodTrucks.length, 0);
      const foodTrucksByManager = await segmentDirectory.getOrganizationsByManager(foodTruckAccount);
      const foodTruck = allFoodTrucks[0];
      const foodTruckByManager = foodTrucksByManager[0];
      assert.isUndefined(foodTruck);
      assert.isDefined(foodTruckByManager);
      assert.isTrue(help.isZeroAddress(foodTruckByManager));
    });

    it('should not destroy the organization contract', async () => {
      await testSegmentDirectory.deregisterFoodTruck(organization.address, { from: foodTruckAccount });
      const code = await help.promisify(cb => web3.eth.getCode(organization.address, cb));
      assert.isAtLeast(code.length, 4);
    });

    it('should throw if organization is not registered', async () => {
      try {
        await testSegmentDirectory.deregisterFoodTruck(nonOwnerAccount, { from: foodTruckAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is on zero address', async () => {
      try {
        await testSegmentDirectory.deregisterFoodTruck(help.zeroAddress, { from: foodTruckAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization non-owner initiates the deregistering', async () => {
      try {
        await testSegmentDirectory.deregisterFoodTruck(organization.address, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});
