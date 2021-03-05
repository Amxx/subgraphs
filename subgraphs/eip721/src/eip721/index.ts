import {
	Account,
	OperatorDelegation,
	Transfer,
	Approval,
	ApprovalForAll,
} from '../../generated/schema'

import {
	Approval       as ApprovalEvent,
	ApprovalForAll as ApprovalForAllEvent,
	Transfer       as TransferEvent,
} from '../../generated/IERC721/IERC721'

import {
	fetchRegistry,
	fetchToken,
} from '../utils/erc721'

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

export function handleTransfer(event: TransferEvent): void {
	let registry = fetchRegistry(event.address)
	if (registry != null)
	{
		let token = fetchToken(registry, event.params.tokenId)
		let from  = new Account(event.params.from.toHex())
		let to    = new Account(event.params.to.toHex())

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
}

export function handleApproval(event: ApprovalEvent): void {
	let registry = fetchRegistry(event.address)
	if (registry != null)
	{
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
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
	let registry = fetchRegistry(event.address)
	if (registry != null)
	{
		let owner      = new Account(event.params.owner.toHex())
		let operator   = new Account(event.params.operator.toHex())
		let delegation = new OperatorDelegation(registry.id.concat('-').concat(owner.id).concat('-').concat(operator.id))

		delegation.registry = registry.id;
		delegation.owner    = owner.id;
		delegation.operator = operator.id;
		delegation.approved = event.params.approved;

		owner.save();
		operator.save();
		delegation.save();

		let ev = new ApprovalForAll(events.id(event));
		ev.transaction = transactions.log(event).id
		ev.timestamp   = event.block.timestamp;
		ev.delegation  = delegation.id;
		ev.owner       = owner.id;
		ev.operator    = operator.id;
		ev.approved    = event.params.approved;
		ev.save();
	}
}
