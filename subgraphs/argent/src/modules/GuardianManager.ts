import {
	store,
} from "@graphprotocol/graph-ts"

import {
	Guardian,
	GuardianAddition,
	GuardianRevokation,
	GuardianAdded,
	GuardianAdditionRequested,
	GuardianAdditionCancelled,
	GuardianRevoked,
	GuardianRevokationRequested,
	GuardianRevokationCancelled,
} from "../../generated/schema"

import {
	GuardianAdded               as GuardianAddedEvent,
	GuardianAdditionRequested   as GuardianAdditionRequestedEvent,
	GuardianAdditionCancelled   as GuardianAdditionCancelledEvent,
	GuardianRevoked             as GuardianRevokedEvent,
	GuardianRevokationRequested as GuardianRevokationRequestedEvent,
	GuardianRevokationCancelled as GuardianRevokationCancelledEvent,
} from "../../generated/GuardianManager/GuardianManager"

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount } from '../fetch/account'
import { fetchWallet  } from '../fetch/wallet'

export function handleGuardianAdded(event: GuardianAddedEvent): void {
	let wallet   = fetchWallet(event.params.wallet)
	let guardian = fetchAccount(event.params.guardian)

	wallet.guardianCount += 1
	wallet.save()

	let g      = new Guardian(wallet.id.concat('/').concat(guardian.id))
	g.wallet   = wallet.id
	g.guardian = guardian.id
	g.save()

	store.remove("GuardianAddition", wallet.id.concat('/').concat(guardian.id))

	let ev         = new GuardianAdded(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.wallet      = wallet.id
	ev.guardian    = guardian.id
	ev.save()
}

export function handleGuardianRevoked(event: GuardianRevokedEvent): void {
	let wallet   = fetchWallet(event.params.wallet)
	let guardian = fetchAccount(event.params.guardian)

	wallet.guardianCount -= 1
	wallet.save()

	store.remove("Guardian", wallet.id.concat('/').concat(guardian.id))
	store.remove("GuardianRevokation", wallet.id.concat('/').concat(guardian.id))

	let ev         = new GuardianRevoked(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.wallet      = wallet.id
	ev.guardian    = guardian.id
	ev.save()
}

export function handleGuardianAdditionRequested(event: GuardianAdditionRequestedEvent): void {
	let wallet   = fetchWallet(event.params.wallet)
	let guardian = fetchAccount(event.params.guardian)

	let g          = new GuardianAddition(wallet.id.concat('/').concat(guardian.id))
	g.wallet       = wallet.id
	g.guardian     = guardian.id
	g.executeAfter = event.params.executeAfter
	g.save()

	let ev          = new GuardianAdditionRequested(events.id(event))
	ev.transaction  = transactions.log(event).id
	ev.timestamp    = event.block.timestamp
	ev.wallet       = wallet.id
	ev.guardian     = guardian.id
	ev.executeAfter = event.params.executeAfter
	ev.save()
}

export function handleGuardianAdditionCancelled(event: GuardianAdditionCancelledEvent): void {
	let wallet   = fetchWallet(event.params.wallet)
	let guardian = fetchAccount(event.params.guardian)

	store.remove("GuardianAddition", wallet.id.concat('/').concat(guardian.id))

	let ev         = new GuardianAdditionCancelled(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.wallet      = wallet.id
	ev.guardian    = guardian.id
	ev.save()
}

export function handleGuardianRevokationRequested(event: GuardianRevokationRequestedEvent): void {
	let wallet   = fetchWallet(event.params.wallet)
	let guardian = fetchAccount(event.params.guardian)

	let g          = new GuardianRevokation(wallet.id.concat('/').concat(guardian.id))
	g.wallet       = wallet.id
	g.guardian     = guardian.id
	g.executeAfter = event.params.executeAfter
	g.save()

	let ev          = new GuardianRevokationRequested(events.id(event))
	ev.transaction  = transactions.log(event).id
	ev.timestamp    = event.block.timestamp
	ev.wallet       = wallet.id
	ev.guardian     = guardian.id
	ev.executeAfter = event.params.executeAfter
	ev.save()
}

export function handleGuardianRevokationCancelled(event: GuardianRevokationCancelledEvent): void {
	let wallet   = fetchWallet(event.params.wallet)
	let guardian = fetchAccount(event.params.guardian)

	store.remove("GuardianRevokation", wallet.id.concat('/').concat(guardian.id))

	let ev         = new GuardianRevokationCancelled(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.wallet      = wallet.id
	ev.guardian    = guardian.id
	ev.save()
}
