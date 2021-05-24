#!/bin/env node

'use strict';

const ethers  = require('ethers');
const fs      = require('fs');
const path    = require('path');
const prompts = require('prompts');
const yargs   = require('yargs');

(async () => {
  const argv = yargs.option('address', { string: true }).argv;
  prompts.override(argv);

  const responces = await prompts([{
    type: 'multiselect',
    name: 'components',
    message: 'Components',
    choices: [
      { title: 'Governor',   value: 'governor' },
      { title: 'Comp Token', value: 'token'    },
      { title: 'Timelock',   value: 'timelock' },
    ],
  },{
    type: (_, { components }) => components.length && 'select',
    name: 'blockchain',
    message: 'Blockchain',
    choices: [
      { title: '[1] mainnet',    value: 'mainnet'   }, // 1
      { title: '[3] ropsten',    value: 'ropsten'   }, // 3
      { title: '[4] rinkeby',    value: 'rinkeby'   }, // 4
      { title: '[5] goerli',     value: 'goerli'    }, // 5
      { title: '[42] kovan',     value: 'kovan'     }, // 42
      { title: '[56] bsc',       value: 'bsc'       }, // 56
      { title: '[77] poa-sokol', value: 'poa-sokol' }, // 77
      { title: '[99] poa-core',  value: 'poa-core'  }, // 99
      { title: '[100] xdai',     value: 'xdai'      }, // 100
      { title: '[137] matic',    value: 'matic'     }, // 137
      { title: '[250] fantom',   value: 'fantom'    }, // 250
      { title: '[1024] clover',  value: 'clover'    }, // 1024
      { title: '[80001] mumbai', value: 'mumbai'    }, // 80001
    ],
  },{
    type: (_, { components }) => components.length && 'number',
    name: 'startBlock',
    message: 'Start block',
    style: 'default',
    initial: 0,
    min: 0,
  },{
    type: (_, { components }) => components.includes('governor') && 'text',
    name: 'governorAddress',
    message: 'Governor address',
    initial: ethers.constants.AddressZero,
    validate: ethers.utils.isAddress,
  },{
    type: (_, { components }) => components.includes('token') && 'text',
    name: 'tokenAddress',
    message: 'Comp token address',
    initial: ethers.constants.AddressZero,
    validate: ethers.utils.isAddress,
  },{
    type: (_, { components }) => components.includes('timelock') && 'text',
    name: 'timelockAddress',
    message: 'Timelock address',
    initial: ethers.constants.AddressZero,
    validate: ethers.utils.isAddress,
  },{
    type: (_, { components }) => components.length && 'text',
    name: 'path',
    message: 'Result path',
    initial: './subgraphs/generated.yaml',
  }]);

  const subgraph = [
    responces.components.length               && `templates/header.yaml`,
    responces.components.includes('governor') && `templates/governor.yaml`,
    responces.components.includes('token')    && `templates/token.yaml`,
    responces.components.includes('timelock') && `templates/timelock.yaml`,
  ]
  .filter(Boolean)
  .map(file => fs.readFileSync(path.resolve(__dirname, file), { encoding: 'utf8' }))
  .map(template => template.replace(/\{(\w+)\}/g, (_, varname) => responces[varname]))
  .reduce((acc, content) => acc + content, '');

  if (responces.path) {
    fs.mkdirSync(path.dirname(responces.path), { recursive: true });
    fs.writeFileSync(responces.path, subgraph, { encoding: 'utf-8' });
  } else {
    console.log(subgraph);
  }

})().catch(console.error)
