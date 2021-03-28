import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	GovernorAlpha,
} from '../../generated/schema'

import {
	IGovernorAlpha as IGovernorAlpha,
} from '../../generated/GovernorAlpha/IGovernorAlpha'

import {
	fetchAccount
} from './account'

export function fetchGovernorAlpha(address: Address) : GovernorAlpha {
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
		governoralpha.proposalCount = 0
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
