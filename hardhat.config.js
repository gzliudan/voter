require('@nomicfoundation/hardhat-chai-matchers');
require('@nomicfoundation/hardhat-toolbox');
require('@nomiclabs/hardhat-etherscan');
require('@openzeppelin/hardhat-upgrades');

require('dotenv').config();
const { DEPLOYER_PRIVATE_KEY, POLYGONSCAN_API_KEY, XDC_API_KEY } = process.env;

// if (!ETHERSCAN_API_KEY) {
//   console.log('ETHERSCAN_API_KEY is not set in file .env !');
// }

if (!POLYGONSCAN_API_KEY) {
  console.log('POLYGONSCAN_API_KEY is not set in file .env !');
}

if (!XDC_API_KEY) {
  console.log('XDC_API_KEY is not set in file .env !');
}

const MUMBAI_RPC_LIST = [
  'https://rpc-mumbai.maticvigil.com',
  'https://rpc.ankr.com/polygon_mumbai',
  'https://matic-mumbai.chainstacklabs.com',
  'https://polygon-testnet.public.blastapi.io',
  'https://polygon-mumbai.blockpi.network/v1/rpc/public',
  'https://endpoints.omniatech.io/v1/matic/mumbai/public',
];

const POLYGONSCAN_RPC_LIST = [
  'https://polygon-rpc.com',
  'https://rpc.ankr.com/polygon',
  'https://polygon.llamarpc.com',
  'https://rpc-mainnet.maticvigil.com',
  'https://polygon-bor.publicnode.com',
  'https://poly-rpc.gateway.pokt.network',
  'https://rpc-mainnet.matic.quiknode.pro',
  'https://polygon-mainnet.public.blastapi.io',
  'https://polygon.blockpi.network/v1/rpc/public',
  'https://endpoints.omniatech.io/v1/matic/mainnet/public',
];

const ether = (n) => `${n}${'0'.repeat(18)}`;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.18',
        settings: {
          optimizer: {
            enabled: false,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: false,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      blockGasLimit: 2e7,
      allowUnlimitedContractSize: true,
      accounts: {
        count: 10,
        accountsBalance: ether(1000000),
      },
    },
    local: {
      url: 'http://localhost:8545',
    },
    xinfin: {
      url: 'https://erpc.xinfin.network',
      chainId: 50,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    apothem: {
      url: 'https://erpc.apothem.network',
      chainId: 51,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    polygon: {
      url: POLYGONSCAN_RPC_LIST[1],
      chainId: 137,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    mumbai: {
      url: MUMBAI_RPC_LIST[1],
      chainId: 80001,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      xinfin: XDC_API_KEY,
      apothem: XDC_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
    customChains: [
      {
        network: 'xinfin',
        chainId: 50,
        urls: {
          apiURL: 'https://api-xdc.blocksscan.io/api',
          browserURL: 'https://explorer.xinfin.network',
        },
      },
      {
        network: 'apothem',
        chainId: 51,
        urls: {
          apiURL: 'https://api-apothem.blocksscan.io/api',
          browserURL: 'https://explorer.apothem.network',
        },
      },
    ],
  },
  mocha: {
    timeout: 20000,
  },
};
