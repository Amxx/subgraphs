import {
	Balance,
	Transfer,
	Approval,
} from '../../generated/schema'

import {
	IComp,
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

export function handleTransfer(event: TransferEvent): void {
	let token = fetchToken(event.address)
	if (token == null) return

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
		let id      = token.id.concat('-').concat(from.id)
		let balance = Balance.load(id)
		let value   = new decimals.Value(id, token.decimals)
		value.decrement(event.params.value)

		// first time balance is seen
		if (balance == null) {
			let balance        = new Balance(id)
			balance.token      = token.id
			balance.account    = from.id
			balance.value      = value.id
			balance.valueExact = value.exact
			balance.save()
		} else {
			balance.valueExact = value.exact
			balance.save()
		}

		ev.fromBalance = id;
	}

	if (to.id != constants.ADDRESS_ZERO) {
		let id      = token.id.concat('-').concat(to.id)
		let balance = Balance.load(id)
		let value   = new decimals.Value(id, token.decimals)
		value.increment(event.params.value)

		// first time balance is seen
		if (balance == null) {
			let balance        = new Balance(id)
			balance.token      = token.id
			balance.account    = to.id
			balance.value      = value.id
			balance.valueExact = value.exact
			balance.save()
		} else {
			balance.valueExact = value.exact
			balance.save()
		}

		ev.toBalance = id;
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
