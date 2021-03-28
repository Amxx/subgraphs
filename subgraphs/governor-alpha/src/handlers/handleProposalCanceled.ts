import {
	log,
} from '@graphprotocol/graph-ts'

import {
	Proposal,
	ProposalCanceled,
} from '../../generated/schema'

import {
	ProposalCanceled as ProposalCanceledEvent,
} from '../../generated/GovernorAlpha/IGovernorAlpha'

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchGovernorAlpha,
} from '../fetch'

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
