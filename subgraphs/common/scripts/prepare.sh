#!/usr/bin/env bash

shopt -s nullglob

for config in config/*.json;
do
  npx graph-compiler                                               \
    --config $config                                               \
    --include node_modules/@openzeppelin/subgraphs/src/datasources \
    --export-schema                                                \
    --export-subgraph                                              \
    || exit $?
done;
