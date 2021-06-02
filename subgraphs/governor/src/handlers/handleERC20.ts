import {
	Transfer,
	Approval,
} from '../../generated/schema'

import {
	Transfer as TransferEvent,
	Approval as ApprovalEvent,
} from '../../generated/Comp/IComp'

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
	fetchToken,
} from '../fetch/token'

import {
	fetchBalance,
} from '../fetch/balance'

export function handleTransfer(event: TransferEvent): void {
	let token = fetchToken(event.address)
	let from  = fetchAccount(event.params.from)
	let to    = fetchAccount(event.params.to)

	let ev         = new Transfer(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.token       = token.id
	ev.from        = from.id
	ev.to          = to.id
	ev.value       = decimals.toDecimals(event.params.value, token.decimals)

	if (from.id != constants.ADDRESS_ZERO) {
		let balance = fetchBalance(token, from)
		let value = new decimals.Value(balance.value)
		value.decrement(event.params.value)
		balance.valueExact = value.exact
		balance.save()

		ev.fromBalance = balance.id;
	}

	if (to.id != constants.ADDRESS_ZERO) {
		let balance = fetchBalance(token, to)
		let value = new decimals.Value(balance.value)
		value.increment(event.params.value)
		balance.valueExact = value.exact
		balance.save()

		ev.toBalance = balance.id;
	}
	ev.save()
}

export function handleApproval(event: ApprovalEvent): void {
	let token   = fetchToken(event.address)
	if (token == null) return

	let owner   = fetchAccount(event.params.owner)
	let spender = fetchAccount(event.params.spender)

	let ev         = new Approval(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.token       = token.id
	ev.owner       = owner.id
	ev.spender     = spender.id
	ev.value       = decimals.toDecimals(event.params.value, token.decimals)
	ev.save()
}
