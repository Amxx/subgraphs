import {
	log,
} from '@graphprotocol/graph-ts'

import {
	Proposal,
	ProposalQueued,
} from '../../generated/schema'

import {
	ProposalQueued as ProposalQueuedEvent,
} from '../../generated/GovernorAlpha/IGovernorAlpha'

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchGovernorAlpha,
} from '../fetch'

export function handleProposalQueued(event: ProposalQueuedEvent): void {
	let governoralpha = fetchGovernorAlpha(event.address)
	let proposal      = Proposal.load(governoralpha.id.concat('/').concat(event.params.id.toString()))

	if (proposal != null) {
		proposal.eta     = event.params.eta
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
