import {
	log,
} from '@graphprotocol/graph-ts'

import {
	Proposal,
	ProposalExecuted,
} from '../../generated/schema'

import {
	ProposalExecuted as ProposalExecutedEvent,
} from '../../generated/GovernorAlpha/IGovernorAlpha'

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchGovernorAlpha,
} from '../fetch'

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
