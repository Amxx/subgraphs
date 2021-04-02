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
	fetchGovernor,
} from '../fetch'

export function handleProposalQueued(event: ProposalQueuedEvent): void {
	let governor = fetchGovernor(event.address)
	if (governor == null) return
	governor.queuedProposalCount++
	governor.save()

	let proposal = Proposal.load(governor.id.concat('/').concat(event.params.id.toString()))
	if (proposal != null) {
		proposal.eta = event.params.eta
		proposal.save()

		let ev         = new ProposalQueued(events.id(event))
		ev.transaction = transactions.log(event).id
		ev.timestamp   = event.block.timestamp
		ev.governor    = governor.id
		ev.proposal    = proposal.id
		ev.eta         = event.params.eta
		ev.save()
	} else {
		log.warning("ProposalQueue with invalid proposal id. Governor {}, proposal {}", [ governor.id, event.params.id.toString() ])
	}
}
