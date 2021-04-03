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

function governorType(address: Address): string | null {
	let call = IGovernorAlpha.bind(address).try_BALLOT_TYPEHASH()
	if (call.reverted) { return null }
	let value = call.value.toHex()
	if (value == "0x8e25870c07e0b0b3884c78da52790939a455c275406c44ae8b434b692fb916ee") { return 'ALPHA' } // keccak256("Ballot(uint256 proposalId,bool support)");
	if (value == "0x150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f") { return 'BRAVO' } // keccak256("Ballot(uint256 proposalId,uint8 support)");
	return null
}

export function fetchGovernor(address: Address) : Governor | null {
	let governor = Governor.load(address.toHex())

	if (governor == null) {
		let type                  = governorType(address)
		if (type == null) { return null }

		let contractAlpha         = IGovernorAlpha.bind(address)
		let contractBravo         = IGovernorBravo.bind(address)
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
		governor.type                  = type
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
