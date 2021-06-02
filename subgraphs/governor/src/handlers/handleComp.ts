import {
	Balance,
	DelegateChanged,
	DelegateVotesChanged,
} from '../../generated/schema'

import {
	DelegateChanged as DelegateChangedEvent,
	DelegateVotesChanged as DelegateVotesChangedEvent,
} from '../../generated/Comp/IComp'

import {
	constants,
	decimals,
	events,
	integers,
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

export function handleDelegateChanged(event: DelegateChangedEvent): void {
	let token        = fetchToken(event.address)
	let delegator    = fetchAccount(event.params.delegator)
	let fromDelegate = fetchAccount(event.params.fromDelegate)
	let toDelegate   = fetchAccount(event.params.toDelegate)
	let balance      = fetchBalance(token, delegator)

	if (fromDelegate.id !== constants.ADDRESS_ZERO) {
		let delegateBalance = fetchBalance(token, fromDelegate)
		delegateBalance.delegatorsCount -= 1
		delegateBalance.save()
	}

	if (toDelegate.id !== constants.ADDRESS_ZERO) {
		let delegateBalance = fetchBalance(token, toDelegate)
		delegateBalance.delegatorsCount += 1
		delegateBalance.save()

		balance.delegate = delegateBalance.id
	} else {
		balance.delegate = null
	}

	balance.save()

	let ev          = new DelegateChanged(events.id(event))
	ev.transaction  = transactions.log(event).id
	ev.timestamp    = event.block.timestamp
	ev.token        = token.id
	ev.delegator    = delegator.id
	ev.fromDelegate = fromDelegate.id
	ev.toDelegate   = toDelegate.id
	ev.save()
}

export function handleDelegateVotesChanged(event: DelegateVotesChangedEvent): void {
	let token    = fetchToken(event.address)
	let delegate = fetchAccount(event.params.delegate)
	let balance  = fetchBalance(token, delegate)
	let value    = new decimals.Value(balance.voting)
	value.set(event.params.newBalance)
	balance.votingExact = event.params.newBalance
	balance.save()

	let ev          = new DelegateVotesChanged(events.id(event))
	ev.transaction  = transactions.log(event).id
	ev.timestamp    = event.block.timestamp
	ev.token        = token.id
	ev.delegate     = delegate.id
	ev.balance      = decimals.toDecimals(event.params.newBalance, token.decimals)
	ev.save()
}
