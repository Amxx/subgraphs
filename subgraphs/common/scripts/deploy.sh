#!/usr/bin/env bash

shopt -s nullglob

for subgraph in generated/*.subgraph.yaml;
do
  npx graph codegen                                                   $subgraph || exit $?
  npx graph build                                                     $subgraph || exit $?
  npx graph deploy --studio $(basename $subgraph .subgraph.yaml) $subgraph || exit $?
done;
