import {
	log,
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
	IGovernorAlpha   as IGovernorAlpha,
	ProposalCreated  as ProposalCreatedEvent,
	ProposalCreated1 as ProposalCreatedDataEvent,
	ProposalQueued   as ProposalQueuedEvent,
	ProposalExecuted as ProposalExecutedEvent,
	ProposalCanceled as ProposalCanceledEvent,
	VoteCast         as VoteCastEvent,
} from '../generated/GovernorAlpha/IGovernorAlpha'

import {
	decimals,
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

function fetchAccount(address: Address) : Account {
	let account = new Account(address.toHex())
	account.save()
	return account
}

function fetchGovernorAlpha(address: Address) : GovernorAlpha {
	let governoralpha = GovernorAlpha.load(address.toHex())

	if (governoralpha == null) {
		let contract              = IGovernorAlpha.bind(address)
		let name                  = contract.try_name()
		let quorumVotes           = contract.try_quorumVotes()
		let proposalThreshold     = contract.try_proposalThreshold()
		let proposalMaxOperations = contract.try_proposalMaxOperations()
		let votingDelay           = contract.try_votingDelay()
		let votingPeriod          = contract.try_votingPeriod()
		let comp                  = contract.try_comp()
		let timelock              = contract.try_timelock()
		let guardian              = contract.try_guardian()

		governoralpha = new GovernorAlpha(address.toHex())
		if (!name.reverted                 ) governoralpha.name                  = name.value
		if (!quorumVotes.reverted          ) governoralpha.quorumVotes           = quorumVotes.value
		if (!proposalThreshold.reverted    ) governoralpha.proposalThreshold     = proposalThreshold.value
		if (!proposalMaxOperations.reverted) governoralpha.proposalMaxOperations = proposalMaxOperations.value
		if (!votingDelay.reverted          ) governoralpha.votingDelay           = votingDelay.value
		if (!votingPeriod.reverted         ) governoralpha.votingPeriod          = votingPeriod.value
		if (!comp.reverted                 ) governoralpha.comp                  = fetchAccount(comp.value).id
		if (!timelock.reverted             ) governoralpha.timelock              = fetchAccount(timelock.value).id
		if (!guardian.reverted             ) governoralpha.guardian              = fetchAccount(guardian.value).id
		governoralpha.save()

		let account             = fetchAccount(address)
		account.asGovernorAlpha = governoralpha.id
		account.save()
	}

	return governoralpha as GovernorAlpha
}

export function handleProposalCreated(event: ProposalCreatedEvent): void {
	let governoralpha      = fetchGovernorAlpha(event.address)
	let proposal           = new Proposal(governoralpha.id.concat('/').concat(event.params.id.toString()))
	let forVotes           = new decimals.Value(proposal.id.concat('/forVotes'))
	let againstVotes       = new decimals.Value(proposal.id.concat('/againstVotes'))
	proposal.governoralpha = governoralpha.id
	proposal.proposalId    = event.params.id
	proposal.proposer      = fetchAccount(event.params.proposer).id
	proposal.startBlock    = event.params.startBlock
	proposal.endBlock      = event.params.endBlock
	proposal.forVotes      = forVotes.id
	proposal.againstVotes  = againstVotes.id
	proposal.canceled      = false
	proposal.executed      = false
	proposal.description   = event.params.description
	proposal.save()

	let targets    = event.params.targets
	let values     = event.params.values
	let signatures = event.params.signatures
	let calldatas  = event.params.calldatas

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

	let ev = new ProposalCreated(events.id(event))
	ev.transaction     = transactions.log(event).id
	ev.timestamp       = event.block.timestamp
	ev.governoralpha   = proposal.governoralpha
	ev.proposal        = proposal.id
	ev.proposer        = proposal.proposer
	ev.save()
}

export function handleProposalCreatedData(event: ProposalCreatedDataEvent): void {
	handleProposalCreated(event as ProposalCreatedEvent);
	let proposal   = new Proposal(event.address.toHex().concat('/').concat(event.params.id.toString()))
	proposal.title = event.params.title
	proposal.save()
}

export function handleProposalQueued(event: ProposalQueuedEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal      = Proposal.load(governoralpha.id.concat('/').concat(event.params.id.toString()))

	if (proposal != null) {
		proposal.eta      = event.params.eta
		proposal.save()

		let ev           = new ProposalQueued(events.id(event))
		ev.transaction   = transactions.log(event).id
		ev.timestamp     = event.block.timestamp
		ev.governoralpha = governoralpha.id
		ev.proposal      = proposal.id
		ev.eta           = event.params.eta
		ev.save()
	} else {
		log.warning("ProposalQueue with invalid proposal id. Governor {}, proposal {}", [ governoralpha.id, event.params.id.toString() ])
	}
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal      = Proposal.load(governoralpha.id.concat('/').concat(event.params.id.toString()))

	if (proposal != null) {
		proposal.executed = true
		proposal.save()

		let ev           = new ProposalExecuted(events.id(event))
		ev.transaction   = transactions.log(event).id
		ev.timestamp     = event.block.timestamp
		ev.governoralpha = governoralpha.id
		ev.proposal      = proposal.id
		ev.save()
	} else {
		log.warning("ProposalExecuted with invalid proposal id. Governor {}, proposal {}", [ governoralpha.id, event.params.id.toString() ])
	}
}

export function handleProposalCanceled(event: ProposalCanceledEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal      = Proposal.load(governoralpha.id.concat('/').concat(event.params.id.toString()))

	if (proposal != null) {
		proposal.canceled = true
		proposal.save()

		let ev           = new ProposalCanceled(events.id(event))
		ev.transaction   = transactions.log(event).id
		ev.timestamp     = event.block.timestamp
		ev.governoralpha = governoralpha.id
		ev.proposal      = proposal.id
		ev.save()
	} else {
		log.warning("ProposalCanceled with invalid proposal id. Governor {}, proposal {}", [ governoralpha.id, event.params.id.toString() ])
	}
}

export function handleVoteCast(event: VoteCastEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal      = Proposal.load(governoralpha.id.concat('/').concat(event.params.proposalId.toString()))

	if (proposal != null) {
		let totalVotes    = new decimals.Value(proposal.id.concat(event.params.support ? '/forVotes' : '/againstVotes'))
		totalVotes.increment(event.params.votes)

		let receipt      = new Receipt(proposal.id.concat('/').concat(event.params.voter.toHex()))
		let votes        = new decimals.Value(receipt.id.concat('/votes'))
		votes.set(event.params.votes)
		receipt.proposal = proposal.id
		receipt.voter    = fetchAccount(event.params.voter).id
		receipt.support  = event.params.support
		receipt.votes    = votes.id
		receipt.save()

		let ev           = new VoteCast(events.id(event))
		ev.transaction   = transactions.log(event).id
		ev.timestamp     = event.block.timestamp
		ev.governoralpha = governoralpha.id
		ev.proposal      = proposal.id
		ev.receipt       = receipt.id
		ev.voter         = event.params.voter.toHex()
		ev.save()
	} else {
		log.warning("VoteCast with invalid proposal id. Governor {}, proposal {}", [ governoralpha.id, event.params.proposalId.toString() ])
	}
}
