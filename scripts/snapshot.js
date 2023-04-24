// SPDX-License-Identifier: MIT

// const hub = 'https://hub.snapshot.org';
const hub = 'https://testnet.snapshot.org';

const hre = require('hardhat');
const snapshot = require('@snapshot-labs/snapshot.js');
const { Web3Provider } = require('@ethersproject/providers');

const client = new snapshot.Client712(hub);
const web3Provider = new Web3Provider(hre.network.provider);

async function voteByPrivateKey() {
  const [account] = await web3Provider.listAccounts();

  const receipt = await client.vote(web3Provider, account, {
    space: 'liudan.eth',
    proposal: '0x1b70a64c8273805ab507794d62668cf448e19b910e8ca22b29faa664230bc6b2',
    type: 'single-choice',
    choice: 1,
    reason: 'I love choice 1',
    app: 'snapshot',
  });

  console.log('Vote by private key:\n', receipt);
}

async function voteByEip1271() {
  // https://mumbai.polygonscan.com/address/0x484C06336D8a105477D424a2E4Bdebb2A0aC8B86#readContract
  const account = '0x484C06336D8a105477D424a2E4Bdebb2A0aC8B86';

  const receipt = await client.vote(web3Provider, account, {
    space: 'liudan.eth',
    proposal: '0x1b70a64c8273805ab507794d62668cf448e19b910e8ca22b29faa664230bc6b2',
    type: 'single-choice',
    choice: 2,
    reason: 'Choice 2 is better',
    app: 'snapshot',
  });

  console.log('\nVote by EIP-1271:\n', receipt);
}

async function vote() {
  await voteByPrivateKey();
  await voteByEip1271();
}

vote()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
