# Argent Subgraph

## Introduction

Argent is a smart-contract based, non-custodial, mobile ethereum wallet with many built in features. It provides native integration with many defi applications as well as wallet connect compatibility. It is particularly know for its social revocery mechanism.

Being smart-contract based, user activity is clearly identifiable onchain. This subgraph aims at providing an easy-to-use endpoint to inspect/analyze all this activity.

## Deployed instance

You can find this subgraph on the [subgraph explorer](https://thegraph.com/studio/subgraph/argent/).

## Re-build and deploy

TODO

## Disclaimer

This subgraph is NOT developped by Argent. It is the result of my understanding of their platform, which is modular and complexe. While this subgraph is the subject of long analysis of the argent contract, and has been developped with great attention, it comes with no guaranties of correctness of completeness.

Argent wallets rely on modules, which are enabled and disabled when upgrades are made to the platform (and mobile applications). Only modules known at the time of this subgraph development are indexed (see [config/argent-mainnet.json](config/argent-mainnet.json)).

Additionnaly, the discovery of argent wallets relies on events emitted by the corresponding factories. Just like modules, only wallets created using known factories are indexed. The list of known factory is also part of [config/argent-mainnet.json](config/argent-mainnet.json). If argent was to deploy and use a new factory in the future, an upgrade of this subgraph would be required to index the corresponding wallets.

## Indexer's doc

This subgraph does NOT rely on any `functionHandlers`. Consequently, it doesn't requier an archive node with trace-api enabled.

## Users' doc

The Argent plateform is quite complexe and indexing it result in many different entities and events being indexed.

Note that some events, which used to be emitted by "old" modules, are no longer used. This is, in particular, the case of the `TokenExchanged` event, which are no longer emitted by the latest argent modules.

### Example of queries

#### Get current controlling address and list of guardians

```
{
  wallet(id: "0x25229cfe0bd20e97aafcfaf82c57bb681c21db90") {
    owner { id }
    guardianCount
    guardians { id }
  }
}
```

### List all active modules for a wallet

```
{
  wallet(id: "0x25229cfe0bd20e97aafcfaf82c57bb681c21db90") {
    moduleCount
    modules { id }
  }
}
```

### History of received ETH transfer for a wallet

```
{
  wallet(id: "0x25229cfe0bd20e97aafcfaf82c57bb681c21db90") {
    receivedEvent(orderBy: timestamp) {
      timestamp
      value
      sender { id }
    }
  }
}
```

### History of outbound transfers (ETH, ERC20, NFTs) for a wallet

```
{
  wallet(id: "0x25229cfe0bd20e97aafcfaf82c57bb681c21db90") {
    transfer(orderBy: timestamp) {
      token { id }
      amount
      to { id }
    }
    nftTransfers(orderBy: timestamp) {
      contract { id }
      tokenId
      to { id }
    }
  }
}
```

### List of all pending social recovery operations

```
{
  recoveries {
    wallet { id }
    newOwner { id }
    executeAfter
  }
}
```