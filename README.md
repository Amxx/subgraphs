# Amxx Subgraph

## Packages

- **Graphprotocol-utils**: [See dedicated repository ](https://github.com/Amxx/graphprotocol-utils)

## Subgraphs

- **[Argent](subgraphs/argent)** :construction:

  Subgraph dedicated to the activity of [Argent smart wallets](https://www.argent.xyz/) (including module permissions, token transfers and social recovery).

- **[Common](subgraphs/common)** :heavy_check_mark:

  Meta-subgraphs, that index all the activity of all contracts following a common standard or pattern. In particular, this include the [ERC721](https://thegraph.com/explorer/subgraph?id=0x7859821024e633c5dc8a4fcf86fc52e7720ce525-0), [ERC1155](https://thegraph.com/explorer/subgraph?id=0x7859821024e633c5dc8a4fcf86fc52e7720ce525-1) meta-subgraphs.

- **[Governor](subgraphs/governor)** :heavy_check_mark:

  Subgraph modules to index Compound governors. The provided module support governor alpha and bravo as well as Comp tokens and Compound timelocks. 

- **[Nonstandard-NFTs](subgraphs/nonstandard-nfts)** :heavy_check_mark:

  Subgraph that index some non-ERC721 compliant NFTs ([cryptopunk](https://www.larvalabs.com/cryptopunks) & [cryptokitties](https://www.cryptokitties.co/)).

- **[POAP](subgraphs/poap)** :heavy_check_mark:

  Subgraphs that index [POAP](https://poap.xyz/) activity on mainnet and xDai.

- **[TOP-ERC20](subgraphs/top-erc20)** :rotating_light:

  Subgraph that indexes the activity of ~100 ERC20 tokens curated using various token lists.

  :warning: This subgraph indexed a LOT of data, and might not be able ever catch up with onchain activity

- **[USDT](subgraphs/usdt)** :rotating_light:

  Subgraph that indexes the activity of the [USDT](https://tether.to/) token.

  :warning: This subgraph indexed a LOT of data, and might not be able ever catch up with onchain activity
