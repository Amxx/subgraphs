import {
	store,
} from "@graphprotocol/graph-ts"

import {
	Guardian,
	GuardianAdded,
	GuardianRevoked,
} from "../../generated/schema"

import {
	GuardianAdded   as GuardianAddedEvent,
	GuardianRevoked as GuardianRevokedEvent,
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

	let g      = new Guardian(wallet.id.concat('/').concat(guardian.id))
	g.wallet   = wallet.id
	g.guardian = guardian.id
	g.save()

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

	store.remove("Guardian", wallet.id.concat('/').concat(guardian.id))

	let ev         = new GuardianRevoked(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.wallet      = wallet.id
	ev.guardian    = guardian.id
	ev.save()
}
