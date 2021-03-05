import {
	AdminAdded         as AdminAddedEvent,
	AdminRemoved       as AdminRemovedEvent,
	Approval           as ApprovalEvent,
	ApprovalForAll     as ApprovalForAllEvent,
	EventMinterAdded   as EventMinterAddedEvent,
	EventMinterRemoved as EventMinterRemovedEvent,
	EventToken         as EventTokenEvent,
	Paused             as PausedEvent,
	Transfer           as TransferEvent,
	Unpaused           as UnpausedEvent,
} from '../generated/POAP/POAP'

import {
	Account,
	Token,
	OperatorDelegation,
	PoapEvent,
	Transfer,
	Approval,
	ApprovalForAll,
} from '../generated/schema'

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

export function handleTransfer(event: TransferEvent): void {
	let token        = new Token(event.params.tokenId.toString())
	let from         = new Account(event.params.from.toHex())
	let to           = new Account(event.params.to.toHex())
	token.identifier = event.params.tokenId
	token.owner      = to.id
	token.save()
	from.save()
	to.save()

	let ev         = new Transfer(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.token       = token.id
	ev.from        = from.id
	ev.to          = to.id
	ev.save()
}

export function handleApproval(event: ApprovalEvent): void {
	let token      = new Token(event.params.tokenId.toString())
	let owner      = new Account(event.params.owner.toHex())
	let approved   = new Account(event.params.approved.toHex())
	token.approval = approved.id
	token.save()
	owner.save()
	approved.save()

	let ev         = new Approval(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.token       = token.id
	ev.owner       = owner.id
	ev.approved    = approved.id
	ev.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
	let owner           = new Account(event.params.owner.toHex())
	let operator        = new Account(event.params.operator.toHex())
	let delegation      = new OperatorDelegation(owner.id.concat('-').concat(operator.id))
	delegation.owner    = owner.id
	delegation.operator = operator.id
	delegation.approved = event.params.approved
	owner.save()
	operator.save()
	delegation.save()

	let ev         = new ApprovalForAll(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.delegation  = delegation.id
	ev.owner       = owner.id
	ev.operator    = operator.id
	ev.approved    = event.params.approved
	ev.save()
}

export function handleEventToken(event: EventTokenEvent): void {
	let poapevent = new PoapEvent(event.params.eventId.toString())
	let token     = new Token(event.params.tokenId.toString())
	token.event   = poapevent.id
	poapevent.save()
	token.save()
}

export function handleAdminAdded(event: AdminAddedEvent): void {
}

export function handleAdminRemoved(event: AdminRemovedEvent): void {
}

export function handleEventMinterAdded(event: EventMinterAddedEvent): void {
}

export function handleEventMinterRemoved(event: EventMinterRemovedEvent): void {
}

export function handlePaused(event: PausedEvent): void {
}

export function handleUnpaused(event: UnpausedEvent): void {
}
