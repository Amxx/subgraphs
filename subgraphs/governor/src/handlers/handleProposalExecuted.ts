import {
	log,
} from '@graphprotocol/graph-ts'

import {
	Proposal,
	ProposalExecuted,
} from '../../generated/schema'

import {
	ProposalExecuted as ProposalExecutedEvent,
} from '../../generated/Governor/IGovernor'

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchGovernor,
} from '../fetch/governor'

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
	let governor = fetchGovernor(event.address)
	if (governor == null) return
	governor.executedProposalCount++
	governor.save()

	let proposal = Proposal.load(governor.id.concat('/').concat(event.params.id.toString()))
	if (proposal != null) {
		proposal.executed = true
		proposal.save()

		let ev         = new ProposalExecuted(events.id(event))
		ev.transaction = transactions.log(event).id
		ev.timestamp   = event.block.timestamp
		ev.governor    = governor.id
		ev.proposal    = proposal.id
		ev.save()
	} else {
		log.warning("ProposalExecuted with invalid proposal id. Governor {}, proposal {}", [ governor.id, event.params.id.toString() ])
	}
}
