import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Governor,
} from '../../generated/schema'

import {
	IGovernorAlpha as IGovernorAlpha,
} from '../../generated/GovernorAlpha/IGovernorAlpha'

import {
	IGovernorBravo as IGovernorBravo,
} from '../../generated/GovernorBravo/IGovernorBravo'

import {
	fetchAccount
} from './account'

export function fetchGovernor(address: Address) : Governor | null {
	let governor = Governor.load(address.toHex())

	if (governor == null) {
		let contractAlpha         = IGovernorAlpha.bind(address)
		let contractBravo         = IGovernorBravo.bind(address)

		// sanity check
		let ballot_typehash = contractAlpha.try_BALLOT_TYPEHASH()
		if (ballot_typehash.reverted || ballot_typehash.value.toHex() != "0x8e25870c07e0b0b3884c78da52790939a455c275406c44ae8b434b692fb916ee") {
			return null
		}

		let name                  = contractAlpha.try_name()
		let quorumVotes           = contractAlpha.try_quorumVotes()
		let proposalThreshold     = contractAlpha.try_proposalThreshold()
		let proposalMaxOperations = contractAlpha.try_proposalMaxOperations()
		let votingDelay           = contractAlpha.try_votingDelay()
		let votingPeriod          = contractAlpha.try_votingPeriod()
		let comp                  = contractAlpha.try_comp()
		let timelock              = contractAlpha.try_timelock()
		let guardian              = contractAlpha.try_guardian()
		let admin                 = contractBravo.try_admin()
		let pendingAdmin          = contractBravo.try_pendingAdmin()
		let implementation        = contractBravo.try_implementation()

		governor                       = new Governor(address.toHex())
		governor.proposalCount         = 0
		governor.queuedProposalCount   = 0
		governor.executedProposalCount = 0
		governor.canceledProposalCount = 0
		// Common
		if (!name.reverted                 ) governor.name                  = name.value
		if (!quorumVotes.reverted          ) governor.quorumVotes           = quorumVotes.value
		if (!proposalThreshold.reverted    ) governor.proposalThreshold     = proposalThreshold.value
		if (!proposalMaxOperations.reverted) governor.proposalMaxOperations = proposalMaxOperations.value
		if (!votingDelay.reverted          ) governor.votingDelay           = votingDelay.value
		if (!votingPeriod.reverted         ) governor.votingPeriod          = votingPeriod.value
		if (!comp.reverted                 ) governor.comp                  = fetchAccount(comp.value).id
		if (!timelock.reverted             ) governor.timelock              = fetchAccount(timelock.value).id
		// GovernorAlpha
		if (!guardian.reverted             ) governor.guardian              = fetchAccount(guardian.value).id
		// GovernorBravo
		if (!admin.reverted                ) governor.admin                 = fetchAccount(admin.value).id
		if (!pendingAdmin.reverted         ) governor.pendingAdmin          = fetchAccount(pendingAdmin.value).id
		if (!implementation.reverted       ) governor.implementation        = fetchAccount(implementation.value).id
		governor.save()

		let account        = fetchAccount(address)
		account.asGovernor = governor.id
		account.save()
	}

	return governor
}
