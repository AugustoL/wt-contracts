const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

const LifTokenTest = artifacts.require('LifTokenTest');

contract('LifToken', (accounts) => {
  let token;

  // Create the token with initial balance
  beforeEach(async () => {
    token = await LifTokenTest.new(accounts[1], 100);
  });

  it('should have the right initial balance and total supply', async () => {
    assert.equal(await token.balanceOf(accounts[1]), 100);
    assert.equal(await token.totalSupply(), 100);
  });

  it('should transfer tokens correctly', async () => {
    await token.transfer(accounts[2], 10, { from: accounts[1] });
    assert.equal(await token.balanceOf(accounts[1]), 90);
    assert.equal(await token.balanceOf(accounts[2]), 10);
  });

  it('should approve tokens correctly', async () => {
    await token.approve(accounts[2], 10, { from: accounts[1] });
    assert.equal(await token.allowance(accounts[1], accounts[2]), 10);
  });

  it('should transfer approved tokens correctly', async () => {
    await token.approve(accounts[2], 10, { from: accounts[1] });
    await token.transferFrom(accounts[1], accounts[3], 10, { from: accounts[2] });
    assert.equal(await token.balanceOf(accounts[1]), 90);
    assert.equal(await token.balanceOf(accounts[3]), 10);
  });

  it('should increaseApproval tokens correctly', async () => {
    await token.increaseApproval(accounts[2], 10, { from: accounts[1] });
    assert.equal(await token.allowance(accounts[1], accounts[2]), 10);
  });

  it('should decreaseApproval tokens correctly', async () => {
    await token.approve(accounts[2], 10, { from: accounts[1] });
    await token.decreaseApproval(accounts[2], 10, { from: accounts[1] });
    assert.equal(await token.allowance(accounts[1], accounts[2]), 0);
  });

  it('should not allow token actions while paused', async () => {
    await token.pause();
    await shouldFail.reverting(
      token.transfer(accounts[2], 10, { from: accounts[1] })
    );
    await shouldFail.reverting(
      token.approve(accounts[2], 10, { from: accounts[1] })
    );
    await shouldFail.reverting(
      token.transferFrom(accounts[1], accounts[3], 10, { from: accounts[2] })
    );
    await shouldFail.reverting(
      token.increaseApproval(accounts[2], 10, { from: accounts[1] })
    );
    await shouldFail.reverting(
      token.decreaseApproval(accounts[2], 10, { from: accounts[1] })
    );
  });

});
