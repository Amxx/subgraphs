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
    .filter(({ chainId }) => chainId === 1) // only chain id
    .sort((a, b) => a.symbol.localeCompare(b.symbol))
    .map(obj => Object.assign(obj, { address: obj.address.toLowerCase(), startBlock: 0 })) // make sure case matched
    .filter(({ address }, i, array) => array.findIndex(token => token.address === address) === i) // remove duplicate

  const header = fs.readFileSync(path.resolve(__dirname, '../src/header.yaml'), { encoding: 'utf8' })
  const erc20  = fs.readFileSync(path.resolve(__dirname, '../src/datasources/erc20.yaml'), { encoding: 'utf8' })

  const subgraph = [
    header,
    ...tokens.map(token => erc20.replace(/\{(\w+)\}/g, (_, varname) => token[varname]))
  ].join('')

  console.error(`Subgraph generation: ${tokens.length} tokens found (erc20)`)
  tokens.forEach(({ symbol, address }) => console.error(`- ${symbol.padEnd(6)} ${address}`))
  console.log(subgraph)

})().catch(console.error)
