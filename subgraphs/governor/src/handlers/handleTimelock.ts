import {
	log,
} from '@graphprotocol/graph-ts'

import {
	TimelockTransaction,
	TimelockQueueTransaction,
	TimelockExecuteTransaction,
	TimelockCancelTransaction,
	NewTimelockAdmin,
	NewTimelockPendingAdmin,
} from '../../generated/schema'

import {
	NewAdmin           as NewAdminEvent,
	NewPendingAdmin    as NewPendingAdminEvent,
	NewDelay           as NewDelayEvent,
	QueueTransaction   as QueueTransactionEvent,
	ExecuteTransaction as ExecuteTransactionEvent,
	CancelTransaction  as CancelTransactionEvent,
} from '../../generated/Timelock/ITimelock'

import {
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchAccount,
} from '../fetch/account'

import {
	fetchTimelock,
} from '../fetch/timelock'

export function handleQueueTransaction(event: QueueTransactionEvent): void {
	let timelock               = fetchTimelock(event.address)
	if (timelock == null) return
	let tx                     = new TimelockTransaction(timelock.id.concat('/').concat(event.params.txHash.toHex()))
	tx.txHash                  = event.params.txHash
	tx.timelock                = timelock.id
	tx.target                  = fetchAccount(event.params.target).id
	tx.value                   = event.params.value
	tx.signature               = event.params.signature
	tx.data                    = event.params.data
	tx.eta                     = event.params.eta
	tx.canceled                = false
	tx.executed                = false
	tx.save()

	let ev                     = new TimelockQueueTransaction(events.id(event))
	ev.transaction             = transactions.log(event).id
	ev.timestamp               = event.block.timestamp
	ev.timelock                = timelock.id
	ev.tx                      = tx.id
	ev.save()
}

export function handleExecuteTransaction(event: ExecuteTransactionEvent): void {
	let timelock               = fetchTimelock(event.address)
	if (timelock == null) return
	let tx                     = TimelockTransaction.load(timelock.id.concat('/').concat(event.params.txHash.toHex()))
	if (tx != null) {
		tx.executed              = true
		tx.save()

		let ev                   = new TimelockExecuteTransaction(events.id(event))
		ev.transaction           = transactions.log(event).id
		ev.timestamp             = event.block.timestamp
		ev.timelock              = timelock.id
		ev.tx                    = tx.id
		ev.save()
	} else {
		log.warning("ExecuteTransaction with invalid txHash id. Timelock {}, txHash {}", [ timelock.id, event.params.txHash.toHex() ])
	}
}

export function handleCancelTransaction(event: CancelTransactionEvent): void {
	let timelock               = fetchTimelock(event.address)
	if (timelock == null) return
	let tx                     = TimelockTransaction.load(timelock.id.concat('/').concat(event.params.txHash.toHex()))
	if (tx != null) {
		tx.canceled              = true
		tx.save()

		let ev                   = new TimelockCancelTransaction(events.id(event))
		ev.transaction           = transactions.log(event).id
		ev.timestamp             = event.block.timestamp
		ev.timelock              = timelock.id
		ev.tx                    = tx.id
		ev.save()
	} else {
		log.warning("ExecuteTransaction with invalid txHash id. Timelock {}, txHash {}", [ timelock.id, event.params.txHash.toHex() ])
	}
}

export function handleNewDelay(event: NewDelayEvent): void {
	let timelock               = fetchTimelock(event.address)
	if (timelock == null) return
	timelock.delay             = event.params.newDelay
	timelock.save()
}

export function handleNewAdmin(event: NewAdminEvent): void {
	let timelock               = fetchTimelock(event.address)
	if (timelock == null) return
	timelock.admin             = fetchAccount(event.params.newAdmin).id
	timelock.save()

	let ev                     = new NewTimelockAdmin(events.id(event))
	ev.transaction             = transactions.log(event).id
	ev.timestamp               = event.block.timestamp
	ev.timelock                = timelock.id
	ev.newAdmin                = fetchAccount(event.params.newAdmin).id
	ev.save()
}

export function handleNewPendingAdmin(event: NewPendingAdminEvent): void {
	let timelock               = fetchTimelock(event.address)
	if (timelock == null) return
	timelock.pendingAdmin      = fetchAccount(event.params.newPendingAdmin).id
	timelock.save()

	let ev                     = new NewTimelockPendingAdmin(events.id(event))
	ev.transaction             = transactions.log(event).id
	ev.timestamp               = event.block.timestamp
	ev.timelock                = timelock.id
	ev.newPendingAdmin         = fetchAccount(event.params.newPendingAdmin).id
	ev.save()
}
