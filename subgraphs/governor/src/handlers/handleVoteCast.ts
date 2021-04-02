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
	VoteCast as VoteCastBravoEvent,
} from '../../generated/GovernorBravo/IGovernorBravo'

import {
	decimals,
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchAccount,
	fetchDecimal,
	fetchGovernor,
} from '../fetch'

export function handleVoteCast(event: VoteCastEvent): void {
	let governor = fetchGovernor(event.address)
	if (governor == null) return
	let proposal = Proposal.load(governor.id.concat('/').concat(event.params.proposalId.toString()))

	if (proposal != null) {
		let totalVotes = fetchDecimal(proposal.id.concat(event.params.support ? '/forVotes' : '/againstVotes'))
		totalVotes.increment(event.params.votes)

		let receipt      = new Receipt(proposal.id.concat('/').concat(event.params.voter.toHex()))
		let votes        = fetchDecimal(receipt.id.concat('/votes'))
		votes.set(event.params.votes)
		receipt.proposal = proposal.id
		receipt.voter    = fetchAccount(event.params.voter).id
		receipt.support  = event.params.support ? 'FOR' : 'AGAINST'
		receipt.votes    = votes.id
		receipt.save()

		let ev         = new VoteCast(events.id(event))
		ev.transaction = transactions.log(event).id
		ev.timestamp   = event.block.timestamp
		ev.governor    = governor.id
		ev.proposal    = proposal.id
		ev.receipt     = receipt.id
		ev.voter       = event.params.voter.toHex()
		ev.save()
	} else {
		log.warning("VoteCast with invalid proposal id. Governor {}, proposal {}", [ governor.id, event.params.proposalId.toString() ])
	}
}

export function handleVoteCastBravo(event: VoteCastBravoEvent): void {
	let governor = fetchGovernor(event.address)
	if (governor == null) return
	let proposal = Proposal.load(governor.id.concat('/').concat(event.params.proposalId.toString()))

	if (proposal != null) {
		let totalVotes = fetchDecimal(proposal.id.concat(
			event.params.support == 0 ? '/againstVotes' :
			event.params.support == 1 ? '/forVotes'     :
			'/abstainVotes'
		))
		totalVotes.increment(event.params.votes)

		let receipt      = new Receipt(proposal.id.concat('/').concat(event.params.voter.toHex()))
		let votes        = fetchDecimal(receipt.id.concat('/votes'))
		votes.set(event.params.votes)
		receipt.proposal = proposal.id
		receipt.voter    = fetchAccount(event.params.voter).id
		receipt.support  = event.params.support == 0 ? 'AGAINST' : event.params.support == 1 ? 'FOR' : 'ABSTAIN'
		receipt.votes    = votes.id
		receipt.save()

		let ev         = new VoteCast(events.id(event))
		ev.transaction = transactions.log(event).id
		ev.timestamp   = event.block.timestamp
		ev.governor    = governor.id
		ev.proposal    = proposal.id
		ev.receipt     = receipt.id
		ev.voter       = event.params.voter.toHex()
		ev.save()
	} else {
		log.warning("VoteCast with invalid proposal id. Governor {}, proposal {}", [ governor.id, event.params.proposalId.toString() ])
	}
}
