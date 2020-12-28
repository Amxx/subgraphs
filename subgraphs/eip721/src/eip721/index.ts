import {
	ethereum,
// 	Address,
	BigInt,
} from '@graphprotocol/graph-ts'

import {
	Account,
	TokenRegistry,
	Token,
	Transfer,
	Approval,
} from '../../generated/schema'

import {
	IERC721,
	Approval       as ApprovalEvent,
	ApprovalForAll as ApprovalForAllEvent,
	Transfer       as TransferEvent,
} from '../../generated/IERC721/IERC721'

import {
	fetchRegistry,
	fetchToken,
} from '../utils'

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

export function handleApproval(event: ApprovalEvent): void {
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
}

export function handleTransfer(event: TransferEvent): void {
	let registry = fetchRegistry(IERC721.bind(event.address));
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
