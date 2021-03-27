import {
	ethereum,
	Address,
} from '@graphprotocol/graph-ts'

import {
	Account,
	GovernorAlpha,
	Proposal,
	ProposalCall,
	Receipt,
	ProposalCanceled,
	ProposalCreated,
	ProposalExecuted,
	ProposalQueued,
	VoteCast,
} from '../generated/schema'

import {
	GovernorAlpha    as GovernorAlphaContract,
	ProposalCanceled as ProposalCanceledEvent,
	ProposalCreated  as ProposalCreatedEvent,
	ProposalExecuted as ProposalExecutedEvent,
	ProposalQueued   as ProposalQueuedEvent,
	VoteCast         as VoteCastEvent,
} from '../generated/GovernorAlpha/GovernorAlpha'

import {
	events,
	constants,
	transactions,
} from '@amxx/graphprotocol-utils'

function fetchAccount(address: Address) : Account {
	let account = new Account(address.toHex())
	account.save()
	return account
}

function tryFetchAccount(address: ethereum.CallResult<Address>) : Account {
	if (address.reverted) {
		return null
	} else {
		return fetchAccount(address.value)
	}
}

function fetchGovernorAlpha(address: Address) : GovernorAlpha {
	let governoralpha = GovernorAlpha.load(address.toHex())

	if (governoralpha == null) {
		let contract                        = GovernorAlphaContract.bind(address)
		let comp                            = tryFetchAccount(contract.try_comp())
		let timelock                        = tryFetchAccount(contract.try_timelock())
		let guardian                        = tryFetchAccount(contract.try_guardian())
		governoralpha                       = new GovernorAlpha(address.toHex())
		governoralpha.name                  = contract.name() // String!
		if (comp     !== null)
		governoralpha.comp                  = comp.id // Account
		if (timelock !== null)
		governoralpha.timelock              = timelock.id // Account
		if (guardian !== null)
		governoralpha.guardian              = guardian.id // Account
		governoralpha.quorumVotes           = contract.quorumVotes() // BigInt!
		governoralpha.proposalThreshold     = contract.proposalThreshold() // BigInt!
		governoralpha.proposalMaxOperations = contract.proposalMaxOperations() // BigInt!
		governoralpha.votingDelay           = contract.votingDelay() // BigInt!
		governoralpha.votingPeriod          = contract.votingPeriod() // BigInt!
		governoralpha.save()

		let account                         = fetchAccount(address);
		account.asGovernorAlpha             = governoralpha.id
		account.save()
	}

	return governoralpha as GovernorAlpha
}

export function handleProposalCreated(event: ProposalCreatedEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal = new Proposal(governoralpha.id.concat('/').concat(event.params.id.toString()))

	proposal.governoralpha = governoralpha.id
	proposal.proposalId    = event.params.id
	proposal.proposer      = fetchAccount(event.params.proposer).id
	proposal.startBlock    = event.params.startBlock;
	proposal.endBlock      = event.params.endBlock
	proposal.forVotes      = constants.BIGINT_ZERO
	proposal.againstVotes  = constants.BIGINT_ZERO
	proposal.canceled      = false
	proposal.executed      = false
	proposal.save()

	let targets    = event.params.targets;
	let values     = event.params.values;
	let signatures = event.params.signatures;
	let calldatas  = event.params.calldatas;

	for (let i = 0; i < targets.length; ++i) {
		let call       = new ProposalCall(proposal.id.concat('/').concat(i.toString()))
		call.proposal  = proposal.id
		call.index     = i
		call.target    = fetchAccount(targets[i]).id
		call.value     = values[i]
		call.signature = signatures[i]
		call.calldata  = calldatas[i]
		call.save()
	}
}

export function handleProposalQueued(event: ProposalQueuedEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal      = new Proposal(governoralpha.id.concat('/').concat(event.params.id.toString()))
	proposal.eta      = event.params.eta
	proposal.save()
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal      = new Proposal(governoralpha.id.concat('/').concat(event.params.id.toString()))
	proposal.executed = true
	proposal.save()
}

export function handleProposalCanceled(event: ProposalCanceledEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal      = new Proposal(governoralpha.id.concat('/').concat(event.params.id.toString()))
	proposal.canceled = true
	proposal.save()
}

export function handleVoteCast(event: VoteCastEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal      = Proposal.load(governoralpha.id.concat('/').concat(event.params.proposalId.toString()))

	if (event.params.support) {
		proposal.forVotes = proposal.forVotes.plus(event.params.votes)
	} else {
		proposal.againstVotes = proposal.againstVotes.plus(event.params.votes)
	}
	proposal.save()

	let receipt      = new Receipt(proposal.id.concat('/').concat(event.params.voter.toHex()))
	receipt.proposal = proposal.id
	receipt.support  = event.params.support
	receipt.votes    = event.params.votes
	receipt.save()
}
