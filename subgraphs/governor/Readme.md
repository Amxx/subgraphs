Coumpound Governance Subgraph
===

Explore the meta subgraphs
---

I maintain meta-subgraph that automatically index the activity of compound governance and equivalent contracts. Any compatible contract will automatically be indexed, there is no whitelist mechanism. However, some changes to the ABI (events in particular) can cause part of the data to not be indexed correctly. In general, when forking contract like compound, I would encourage you NOT to change the events interfaces. You can always add additional events on top of the existing ones to publish more infos.

The meta-subgraph are available for the following networks:

- Mainnet: https://thegraph.com/explorer/subgraph/amxx/compound-governance
- Goerli: https://thegraph.com/explorer/subgraph/amxx/compound-governance-goerli
- Kovan: https://thegraph.com/explorer/subgraph/amxx/compound-governance-kovan

Please raise an issue on this repo if you notice any issue with one of the meta-subgraph.

Queries examples
---

List of known governance instances, with name, and address, type and proposal count
```
{
	governors{
		id
		name
		type
		proposalCount
	}
}
```

List of proposals in a specific governance instance, with proposer
```
{
	governor(id: "0xc0da01a04c3f3e0be433606045bb7017a7323e38"){
		proposals {
			proposalId
			canceled
			executed
			proposer { id }
			forVotes { value }
			againstVotes { value }
			abstainVotes { value }
			votecast {
				voter { id }
				receipt {
					support
					votes { id }
				}
			}
		}
	}
}
```

Latest 5 proposal in a specific governance instance with proposal details
```
{
  proposalCreateds(
    first: 5
    orderBy: timestamp
    orderDirection: desc
    where: { governor: "0xc0da01a04c3f3e0be433606045bb7017a7323e38"}
  ) {
    timestamp
    proposal {
      description
      startBlock
      endBlock
      executed
      canceled
      calls {
        target { id }
        value
        signature
        calldata
      }
    }
  }
}
```

All proposal by an account
```
{
  account(id: "0x6626593c237f530d15ae9980a95ef938ac15c35c") {
    proposals {
      governor { name }
      description
    }
  }
}
```

Latest votes by an account, with timestamp and details about the corresponding proposal
```
{
  account(id: "0x1f766d64ccb4b7e63a6cf347c5ff859a8697f6dd") {
    votecast(orderBy: timestamp, orderDirection: desc) {
      timestamp
      governor { name }
      proposal { description }
      receipt {
        support
        votes { value }
      }
    }
  }
}
```

Build and deploy my instance
---

You may want to deploy an extended subgraph, with comp token & timelock indexing, for a specific governance instance. This is easy to do:

1. **Create a subgraph on the hosted service.** There is a button for that in [your dashboard](https://thegraph.com/explorer/dashboard)

2. **Install the dependencies**

	`npm i`

3. **Generate a subgraph specific to your platform of interrest**

	`npm run setup`

	and follow the steps

	* select the module(s) you want
	* select your blockchain
	* select your start block (optional, help speed-up indexing)
	* fill the details of each module (governor type, contract addresses)

*Example, for Coumpound's GovernorBravo mainnet deployment:*

```
$ npm run setup
> @amxx/subgraphs-compound-governance@1.0.0 setup /home/amxx/Work/Projects/subgraphs/subgraphs/governor
> templates/generator.js

✔ Components › Governor, Comp Token, Timelock
✔ Blockchain › [1] mainnet
✔ Start block … 9601359
✔ Governor type › Bravo
✔ Governor address … 0xc0da02939e1441f497fd74f78ce7decb17b66529
✔ Comp token address … 0xc00e94cb662c3520282e6f5717214004a7f26888
✔ Timelock address … 0x6d903f6003cca6255d85cca4d3b5e5146dc33925
✔ Result path … ./generated/subgraph.yaml
```

4. **Deploy the subgraph to the hosted service**

	`NAME=myname/mysubgraphname npm run deploy`

	You'll have to make sure your deployment token is setup, check [the deployment documentation](https://thegraph.com/docs/deploy-a-subgraph#create-a-graph-explorer-account).

FAQ:
---

- ***What networks are supported?***

	See [TheGraph documentation](https://thegraph.com/docs/define-a-subgraph#from-an-existing-contract) for a list of networks supported by the hosted service. Additionally, you can easily setup your own indexing nodes with any EVM compatible blockchain.


- ***How do I create a subgraph on the hosted service?***

	You can create new subgraphs easily from your dashboard on thegraph.com/explorer/dashboard. Additionally, check the [hosted service quickstart on the thegraph documentation](https://thegraph.com/docs/quick-start#hosted-service).

- ***My fork of coumpound is slightly different, is that an issue?***

	Depending on the change you made, some functions or events might not be considered by the subgraph. As a general recommandation I would encourage you not to modify an existing ABI when forking. Instead of changing signatures, it is better to add new events or to fill unused fields with addequate/empty values

	Still, it shouldn't be to difficult to extend support for event variations. Fell free to raise an issue or to submit a PR.


- ***I don't want to use the hosted service. Can I host my own indexer nodes?***

	Yes. If you want documentation on how to that, fell free to raise an issue.
