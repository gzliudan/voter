// SPDX-License-Identifier: MIT

// ==================== External Imports ====================

const fs = require('fs');
const dayjs = require('dayjs');

const DIR = './deploy';

function getDataTime() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

/// @param  name  The name of contract
/// @param  args  The arguments of contract constructor function
async function deployContract(name, args = []) {
  const { ethers } = require('hardhat');
  const Implementation = await ethers.getContractFactory(name);
  const contract = await Implementation.deploy(...args);

  return contract.deployed();
}

function getDeployedContracts(chainName, chainId) {
  const filename = `${DIR}/${chainName}.json`;

  let contracts;

  try {
    contracts = JSON.parse(fs.readFileSync(filename));
  } catch (e) {
    // console.error(e);
    contracts = {
      chain_name: chainName,
      chain_id: chainId,
    };
  }

  return { directory: DIR, filename, contracts };
}

function writeDeployedContracts(directory, filename, contracts) {
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(filename, JSON.stringify(contracts, null, 2));
}

function getChainInfo() {
  const hre = require('hardhat');
  const chainName = hre.network.name;
  const chainId = hre.network.config.chainId;
  const rpcEndpoint = hre.network.config.url;

  return { chainName, chainId, rpcEndpoint };
}

/// @param  name  The name of contract
/// @param  key   The key of contract instance in deployed json file
/// @param  args  The arguments of contract constructor function
async function quickDeployContract(name, key, args = []) {
  const hre = require('hardhat');

  const { DEPLOYER_PRIVATE_KEY } = process.env;
  if (!DEPLOYER_PRIVATE_KEY) {
    throw new Error(`DEPLOYER_PRIVATE_KEY is not set in file .env !}`);
  }

  const { chainName, chainId } = getChainInfo();
  const { directory, filename, contracts } = getDeployedContracts(chainName, chainId);
  const oldAddress = contracts[key]?.address;

  if (oldAddress) {
    console.log(`[${getDataTime()}] SKIP: ${key}(${name}) is already deployed at ${oldAddress}\n`);
    return oldAddress;
  }

  if (!args) {
    args = [];
  }

  // Deploy contract
  console.log(`[${getDataTime()}] DO: Deploy ${key}(${name}) to ${chainName}, args = ${JSON.stringify(args)}`);
  const instance = await deployContract(name, args);
  const address = instance.address;
  const hash = instance.deployTransaction.hash;
  const trx = await hre.ethers.provider.getTransaction(hash);
  const block = trx.blockNumber;
  console.log(`[${getDataTime()}] OK: ${key}(${name}) is deployed at ${address}, block = ${block}, hash = ${hash}`);

  // update addresses
  contracts[key] = { name, args, address, block, hash };
  writeDeployedContracts(directory, filename, contracts);
  console.log(`[${getDataTime()}] OK: Write ${key} to file ${filename}\n`);

  return instance;
}

module.exports = {
  getDataTime,
  getChainInfo,
  getDeployedContracts,
  deployContract,
  writeDeployedContracts,
  quickDeployContract,
};
