import {
	log,
} from '@graphprotocol/graph-ts'

import {
	Proposal,
	Receipt,
	VoteCast,
} from '../../generated/schema'

import {
	VoteCast as VoteCastEvent,
} from '../../generated/GovernorAlpha/IGovernorAlpha'

import {
	decimals,
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchAccount,
	fetchDecimal,
	fetchGovernorAlpha,
} from '../fetch'

export function handleVoteCast(event: VoteCastEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal      = Proposal.load(governoralpha.id.concat('/').concat(event.params.proposalId.toString()))

	if (proposal != null) {
		let totalVotes    = fetchDecimal(proposal.id.concat(event.params.support ? '/forVotes' : '/againstVotes'))
		totalVotes.increment(event.params.votes)

		let receipt      = new Receipt(proposal.id.concat('/').concat(event.params.voter.toHex()))
		let votes        = fetchDecimal(receipt.id.concat('/votes'))
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
