#!/bin/env node

'use strict';

const fs   = require('fs');
const path = require('path');

(async () => {

  const tokens = [
    './tokenlists/compound.tokenlist.json',
    './tokenlists/tokens.uniswap.org.json',
    './tokenlists/stablecoin.cmc.eth.json',
    './tokenlists/erc20.cmc.eth.json',
  ]
    .map(file => JSON.parse(fs.readFileSync(path.resolve(__dirname, file), { encoding: 'utf8' })))
    .flatMap(({ tokens }) => tokens)
    .map(obj => Object.assign(obj, { address: obj.address.toLowerCase(), startBlock: 0 })) // make sure case matched
    .filter(({ chainId }) => chainId === 1) // only chain id
    .filter(({ address }, i, array) => array.findIndex(token => token.address === address) === i) // remove duplicate
    .sort((a, b) => a.address.localeCompare(b.address))

  console.log(JSON.stringify({
    output: "../generated/top-erc20",
    datasources: tokens.map(({ address }) => ({ address, module: "erc20"}))
  }))

})().catch(console.error)
