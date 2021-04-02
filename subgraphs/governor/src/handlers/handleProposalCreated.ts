import {
	Proposal,
	ProposalCall,
	ProposalCreated,
} from '../../generated/schema'

import {
	ProposalCreated  as ProposalCreatedEvent,
	ProposalCreated1 as ProposalCreated1Event,
	ProposalCreated2 as ProposalCreated2Event,
	ProposalCreated3 as ProposalCreated3Event,
	ProposalCreated4 as ProposalCreated4Event,
	ProposalCreated5 as ProposalCreated5Event,
} from '../../generated/GovernorAlpha/IGovernorAlpha'

import {
	constants,
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchAccount,
	fetchDecimal,
	fetchGovernor,
} from '../fetch'

function handleProposalCreatedBase(event: ProposalCreatedEvent): Proposal | null {
	let governor = fetchGovernor(event.address)
	if (governor == null) return null
	governor.proposalCount++
	governor.save()

	let proposal          = new Proposal(governor.id.concat('/').concat(event.params.id.toString()))
	proposal.governor     = governor.id
	proposal.proposalId   = event.params.id
	proposal.proposer     = fetchAccount(event.params.proposer).id
	proposal.forVotes     = fetchDecimal(proposal.id.concat('/forVotes')).id
	proposal.againstVotes = fetchDecimal(proposal.id.concat('/againstVotes')).id
	proposal.abstainVotes = fetchDecimal(proposal.id.concat('/abstainVotes')).id
	proposal.canceled     = false
	proposal.executed     = false

	let ev         = new ProposalCreated(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.governor    = proposal.governor
	ev.proposal    = proposal.id
	ev.proposer    = proposal.proposer
	ev.save()

	return proposal
}

export function handleProposalCreated(event: ProposalCreatedEvent): void {
	let proposal         = handleProposalCreatedBase(event as ProposalCreatedEvent)
	if (proposal == null) return
	proposal.startBlock  = event.params.startBlock
	proposal.endBlock    = event.params.endBlock
	proposal.description = event.params.description
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
}

export function handleProposalCreated1(event: ProposalCreated1Event): void {
	let proposal         = handleProposalCreatedBase(event as ProposalCreatedEvent)
	if (proposal == null) return
	proposal.startBlock  = event.params.startBlock
	proposal.endBlock    = event.params.endBlock
	proposal.title       = event.params.title
	proposal.description = event.params.description
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
}

export function handleProposalCreated2(event: ProposalCreated2Event): void {
	let proposal         = handleProposalCreatedBase(event as ProposalCreatedEvent)
	if (proposal == null) return
	proposal.description = event.params.description
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
}

export function handleProposalCreated3(event: ProposalCreated3Event): void {
	let proposal         = handleProposalCreatedBase(event as ProposalCreatedEvent)
	if (proposal == null) return
	proposal.description = event.params.description
	proposal.save()

	let targets    = event.params.targets
	let signatures = event.params.signatures
	let calldatas  = event.params.calldatas
	for (let i = 0; i < targets.length; ++i) {
		let call       = new ProposalCall(proposal.id.concat('/').concat(i.toString()))
		call.proposal  = proposal.id
		call.index     = i
		call.target    = fetchAccount(targets[i]).id
		call.value     = constants.BIGINT_ZERO
		call.signature = signatures[i]
		call.calldata  = calldatas[i]
		call.save()
	}
}

export function handleProposalCreated4(event: ProposalCreated4Event): void {
	let proposal         = handleProposalCreatedBase(event as ProposalCreatedEvent)
	if (proposal == null) return
	proposal.description = event.params.description
	// event.params.expedited
	proposal.save()

	let targets    = event.params.contracts
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
}

export function handleProposalCreated5(event: ProposalCreated5Event): void {
	let proposal         = handleProposalCreatedBase(event as ProposalCreatedEvent)
	if (proposal == null) return
	proposal.description = event.params.description
	proposal.startBlock  = event.params.startBlock
	proposal.endBlock    = event.params.endBlock
	proposal.save()
}
