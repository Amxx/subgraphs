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
	fetchGovernor,
} from '../fetch'

export function handleProposalCanceled(event: ProposalCanceledEvent): void {
	let governor = fetchGovernor(event.address)
	if (governor == null) return
	governor.canceledProposalCount++
	governor.save()

	let proposal = Proposal.load(governor.id.concat('/').concat(event.params.id.toString()))
	if (proposal != null) {
		proposal.canceled = true
		proposal.save()

		let ev         = new ProposalCanceled(events.id(event))
		ev.transaction = transactions.log(event).id
		ev.timestamp   = event.block.timestamp
		ev.governor    = governor.id
		ev.proposal    = proposal.id
		ev.save()
	} else {
		log.warning("ProposalCanceled with invalid proposal id. Governor {}, proposal {}", [ governor.id, event.params.id.toString() ])
	}
}
