#!/bin/env node

'use strict';

const fs      = require('fs');
const path    = require('path');
const MODULES = require('./modules.json');
const PATH    = './subgraph.yaml';

(async () => {
  const header = fs.readFileSync(path.resolve(__dirname, '../src/header.yaml'), { encoding: 'utf8' })

  const templates = Object.fromEntries(
    MODULES
      .map(({ name }) => name)
      .filter((key, i, array) => array.indexOf(key) == i)
      .map(name => {
        try {
          return [ name, fs.readFileSync(path.resolve(__dirname, `../src/modules/${name}.yaml`), { encoding: 'utf8' }) ];
        } catch {
          return undefined;
        }
      })
      .filter(Boolean))

  const names = MODULES
    .map(({ name }) => name)
    .map((name, i, array) => array.indexOf(name) == i ? name : `${name}-${i}`)

  const datasources = MODULES
    .map(({ address, startBlock, name }, i) =>
      templates[name]
        ? templates[name].replace(/\{(\w+)\}/g, (_, varname) => ({ address, startBlock, name: names[i] })[varname])
        : undefined
    )
    .filter(Boolean)

  const subgraph = [ header, ...datasources ].reduce((acc, content) => acc + content, '')

  // fs.mkdirSync(path.dirname(PATH), { recursive: true });
  // fs.writeFileSync(PATH, subgraph, { encoding: 'utf-8' });
  console.log(subgraph)

})().catch(console.error)
