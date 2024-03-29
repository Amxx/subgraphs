import {
	ERC20Transfer,
} from '../../generated/schema'

import {
	Transfer as TransferEvent,
	Approval as ApprovalEvent,
} from '../../generated/DAI/IERC20'

import {
	constants,
	decimals,
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchAccount,
} from '../fetch/account'

import {
	fetchERC20,
	fetchERC20Balance,
	fetchERC20Approval,
} from '../fetch/erc20'

export function handleTransfer(event: TransferEvent): void {
	let token = fetchERC20(event.address)
	let from  = fetchAccount(event.params.from)
	let to    = fetchAccount(event.params.to)

	let ev         = new ERC20Transfer(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.token       = token.id
	ev.from        = from.id
	ev.to          = to.id
	ev.value       = decimals.toDecimals(event.params.value, token.decimals)
	ev.valueExact  = event.params.value

	if (from.id != constants.ADDRESS_ZERO) {
		let balance        = fetchERC20Balance(token, from)
		let value          = new decimals.Value(balance.value)
		value.decrement(event.params.value)
		balance.valueExact = value.exact
		balance.save()

		ev.fromBalance = balance.id;
	}

	if (to.id != constants.ADDRESS_ZERO) {
		let balance = fetchERC20Balance(token, to)
		let value = new decimals.Value(balance.value)
		value.increment(event.params.value)
		balance.valueExact = value.exact
		balance.save()

		ev.toBalance = balance.id;
	}
	ev.save()
}

export function handleApproval(event: ApprovalEvent): void {
	let token   = fetchERC20(event.address)
	if (token == null) return

	let owner           = fetchAccount(event.params.owner)
	let spender         = fetchAccount(event.params.spender)
	let approval        = fetchERC20Approval(token, owner, spender)
	let value           = new decimals.Value(approval.value)
	value.set(event.params.value)
	approval.valueExact = value.exact
	approval.save()

	// let ev         = new ERC20ApprovalEvent(events.id(event))
	// ev.transaction = transactions.log(event).id
	// ev.timestamp   = event.block.timestamp
	// ev.token       = token.id
	// ev.owner       = owner.id
	// ev.spender     = spender.id
	// ev.approval    = approval.id
	// ev.value       = value.value
	// ev.save()
}
