import {
	POAP,
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
	PoapEvent,
	Transfer,
} from '../generated/schema'

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

export function handleAdminAdded(event: AdminAddedEvent): void {
}

export function handleAdminRemoved(event: AdminRemovedEvent): void {
}

export function handleApproval(event: ApprovalEvent): void {
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
}

export function handleEventMinterAdded(event: EventMinterAddedEvent): void {
}

export function handleEventMinterRemoved(event: EventMinterRemovedEvent): void {
}

export function handleEventToken(event: EventTokenEvent): void {
	let poapevent = new PoapEvent(event.params.eventId.toString());
	let token     = new Token(event.params.tokenId.toString());

	token.event = poapevent.id;

	poapevent.save();
	token.save();
}

export function handlePaused(event: PausedEvent): void {
}

export function handleTransfer(event: TransferEvent): void {
	let token = new Token(event.params.tokenId.toString());
	let from  = new Account(event.params.from.toHex());
	let to    = new Account(event.params.to.toHex());

	token.owner = to.id;

	token.save();
	from.save();
	to.save();

	let ev = new Transfer(events.id(event));
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp;
	ev.token       = token.id;
	ev.from        = from.id;
	ev.to          = to.id;
	ev.save();
}

export function handleUnpaused(event: UnpausedEvent): void {
}
