#!/bin/bash

declare -A SUBGRAPH=(
	[mainnet]=amxx/poap
	[xdai]=amxx/poap-xdai
)

declare -A PUBLIC=(
	[mainnet]=true
	[ropsten]=true
	[rinkeby]=true
	[goerli]=true
	[xdai]=true
	[kovan]=true
	[viviani]=false
	[bellecour]=false
)

function deploy { graph deploy ${SUBGRAPH[$1]} --node $2 --ipfs $3 subgraph.$1.yaml; }

graph auth https://api.thegraph.com/deploy/ $THEGRAPH_AMXX
for network in `ls subgraph.*.yaml | cut -d '.' -f 2`;
do
	echo "### ${SUBGRAPH[$network]}"
	${PUBLIC[$network]} && deploy $network https://api.thegraph.com/deploy/ https://api.thegraph.com/ipfs/
done;
