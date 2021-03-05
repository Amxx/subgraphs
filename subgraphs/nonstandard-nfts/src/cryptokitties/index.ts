import {
	Account,
	Transfer,
	Approval,
} from '../../generated/schema'

import {
	KittyCore,
	Approval        as ApprovalEvent,
	Birth           as BirthEvent,
	ContractUpgrade as ContractUpgradeEvent,
	Pregnant        as PregnantEvent,
	Transfer        as TransferEvent,
} from '../../generated/CryptoKitties/KittyCore'

import {
	fetchRegistry,
	fetchToken,
} from '../utils'

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

export function handleTransfer(event: TransferEvent): void {
	let registry = fetchRegistry(KittyCore.bind(event.address));
	let token    = fetchToken(registry, event.params.tokenId)
	let from     = new Account(event.params.from.toHex())
	let to       = new Account(event.params.to.toHex())

	token.owner = to.id

	registry.save()
	token.save()
	from.save()
	to.save()

	let ev = new Transfer(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.token       = token.id
	ev.from        = from.id
	ev.to          = to.id
	ev.save()
}

export function handleApproval(event: ApprovalEvent): void {
	let registry = fetchRegistry(KittyCore.bind(event.address));
	let token    = fetchToken(registry, event.params.tokenId)
	let owner    = new Account(event.params.owner.toHex())
	let approved = new Account(event.params.approved.toHex())

	token.approval = approved.id

	token.save()
	owner.save()
	approved.save()

	let ev = new Approval(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.token       = token.id
	ev.owner       = owner.id
	ev.approved    = approved.id
	ev.save()
}

export function handleBirth(event: BirthEvent): void {
}

export function handleContractUpgrade(event: ContractUpgradeEvent): void {
}

export function handlePregnant(event: PregnantEvent): void {
}
