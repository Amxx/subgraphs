import {
	WalletCreated,
} from "../../generated/schema"

import {
	WalletCreated  as WalletCreatedEvent,
	WalletCreated1 as WalletCreatedV2Event,
	WalletCreated2 as WalletCreatedV3Event,
} from "../../generated/WalletFactory/WalletFactory"

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount } from '../fetch/account'
import { fetchWallet  } from '../fetch/wallet'

export function handleWalletCreated(event: WalletCreatedEvent): void {
	let owner    = fetchAccount(event.params.owner)
	let wallet   = fetchWallet(event.params.wallet)
	wallet.owner = owner.id
	wallet.save()

	let ev         = new WalletCreated(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.wallet      = wallet.id
	ev.save()
}

export function handleWalletCreatedV2(event: WalletCreatedV2Event): void {
	// event.params.guardian

	let owner    = fetchAccount(event.params.owner)
	let wallet   = fetchWallet(event.params.wallet)
	wallet.owner = owner.id
	wallet.save()

	let ev         = new WalletCreated(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.wallet      = wallet.id
	ev.save()
}

export function handleWalletCreatedV3(event: WalletCreatedV3Event): void {
	// event.params.guardian
	// event.params.refundToken
	// event.params.refundAmount

	let owner    = fetchAccount(event.params.owner)
	let wallet   = fetchWallet(event.params.wallet)
	wallet.owner = owner.id
	wallet.save()

	let ev         = new WalletCreated(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.wallet      = wallet.id
	ev.save()
}
