import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Governor,
} from '../../generated/schema'

import {
	IGovernor,
} from '../../generated/Governor/IGovernor'

import {
	fetchAccount
} from './account'

function governorType(address: Address): string | null {
	// check existance of governance settings
	if (IGovernor.bind(address).try_votingDelay().reverted) {
		return null;
	}

	// try to identify governor type
	let call = IGovernor.bind(address).try_BALLOT_TYPEHASH()
	if (call.reverted) { return 'OTHER' }
	let value = call.value.toHex()
	if (value == "0x8e25870c07e0b0b3884c78da52790939a455c275406c44ae8b434b692fb916ee") { return 'ALPHA' } // keccak256("Ballot(uint256 proposalId,bool support)");
	if (value == "0x150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f") { return 'BRAVO' } // keccak256("Ballot(uint256 proposalId,uint8 support)");
	return 'OTHER'
}

export function fetchGovernor(address: Address) : Governor | null {
	let governor = Governor.load(address.toHex())

	if (governor == null) {
		let type                  = governorType(address)
		if (type == null) { return null }

		let contract              = IGovernor.bind(address)
		let name                  = contract.try_name()
		let quorumVotes           = contract.try_quorumVotes()
		let proposalThreshold     = contract.try_proposalThreshold()
		let proposalMaxOperations = contract.try_proposalMaxOperations()
		let votingDelay           = contract.try_votingDelay()
		let votingPeriod          = contract.try_votingPeriod()
		let comp                  = contract.try_comp()
		let timelock              = contract.try_timelock()
		let guardian              = contract.try_guardian()
		let admin                 = contract.try_admin()
		let pendingAdmin          = contract.try_pendingAdmin()
		let implementation        = contract.try_implementation()

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
