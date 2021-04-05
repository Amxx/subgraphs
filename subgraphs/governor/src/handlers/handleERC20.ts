import {
	Account,
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
	fetchToken,
} from '../fetch'

export function handleTransfer(event: TransferEvent): void {
	let token = fetchToken(event.address)
	if (token == null) return

	let from  = new Account(event.params.from.toHex())
	let to    = new Account(event.params.to.toHex())
	from.save()
	to.save()

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
		// first time balance is seen
		if (balance == null) {
			let balance     = new Balance(id)
			balance.token   = token.id
			balance.account = from.id
			balance.value   = balance.id
			balance.save()
			// read from contract
			let value = new decimals.Value(balance.id, token.decimals)
			value.set(IComp.bind(event.address).balanceOf(event.params.from))
		} else {
			let value = new decimals.Value(balance.id, token.decimals)
			value.decrement(event.params.value)
		}
		ev.fromBalance = id;
	}

	if (to.id != constants.ADDRESS_ZERO) {
		let id      = token.id.concat('-').concat(to.id)
		let balance = Balance.load(id)
		// first time balance is seen
		if (balance == null) {
			let balance     = new Balance(id)
			balance.token   = token.id
			balance.account = to.id
			balance.value   = balance.id
			balance.save()
			// read from contract
			let value = new decimals.Value(balance.id, token.decimals)
			value.set(IComp.bind(event.address).balanceOf(event.params.to))
		} else {
			let value = new decimals.Value(balance.id, token.decimals)
			value.increment(event.params.value)
		}
		ev.toBalance = id;
	}
	ev.save()
}

export function handleApproval(event: ApprovalEvent): void {
	let token   = fetchToken(event.address)
	if (token == null) return

	let owner   = new Account(event.params.owner.toHex())
	let spender = new Account(event.params.spender.toHex())
	owner.save()
	spender.save()

	let ev         = new Approval(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.token       = token.id
	ev.owner       = owner.id
	ev.spender     = spender.id
	ev.value       = decimals.toDecimals(event.params.value, token.decimals)
	ev.save()
}
