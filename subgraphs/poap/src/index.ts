import {
	ethereum,
} from '@graphprotocol/graph-ts'

import {
	EventToken as EventTokenEvent,
	Transfer   as TransferEvent,
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

export function handleEventToken(event: EventTokenEvent): void
{
	let poapevent = new PoapEvent(event.params.eventId.toString());
	let token     = new Token(event.params.tokenId.toString());

	token.event = poapevent.id;

	poapevent.save();
	token.save();
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
