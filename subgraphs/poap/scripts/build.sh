#!/bin/bash

for subgraph in `ls subgraph.*.yaml`;
do
	graph codegen $subgraph
	graph build   $subgraph
done;
