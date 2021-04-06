import {
	Account,
	Votes,
	Delegation,
	DelegateChanged,
	DelegateVotesChanged,
} from '../../generated/schema'

import {
	IComp,
	DelegateChanged as DelegateChangedEvent,
	DelegateVotesChanged as DelegateVotesChangedEvent,
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

export function handleDelegateChanged(event: DelegateChangedEvent): void {
	let token = fetchToken(event.address)
	if (token == null) return

	let delegator    = fetchAccount(event.params.delegator)
	let fromDelegate = fetchAccount(event.params.fromDelegate)
	let toDelegate   = fetchAccount(event.params.toDelegate)

	let delegation       = new Delegation(token.id.concat('/').concat(delegator.id))
	delegation.token     = token.id
	delegation.delegator = delegator.id
	delegation.delegate  = toDelegate.id
	delegation.save()

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
	let token = fetchToken(event.address)
	if (token == null) return

	let delegate = fetchAccount(event.params.delegate)

	let votes     = new Votes(token.id.concat('/').concat(delegate.id))
	let value     = new decimals.Value(votes.id, token.decimals)
	value.set(event.params.newBalance)
	votes.token   = token.id
	votes.account = delegate.id
	votes.value   = value.id
	votes.save()

	let ev          = new DelegateVotesChanged(events.id(event))
	let balance     = new decimals.Value(ev.id, token.decimals)
	balance.set(event.params.newBalance)
	ev.transaction  = transactions.log(event).id
	ev.timestamp    = event.block.timestamp
	ev.token        = token.id
	ev.delegate     = delegate.id
	ev.balance      = balance.id
	ev.save()
}
