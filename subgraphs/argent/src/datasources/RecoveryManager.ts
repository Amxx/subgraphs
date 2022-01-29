import {
  store,
} from "@graphprotocol/graph-ts"

import {
  Recovery,
  RecoveryExecuted,
  RecoveryFinalized,
  RecoveryCanceled,
} from "../../generated/schema"

import {
  OwnershipTransfered as OwnershipTransferedEvent,
  RecoveryCanceled    as RecoveryCanceledEvent,
  RecoveryExecuted    as RecoveryExecutedEvent,
  RecoveryFinalized   as RecoveryFinalizedEvent,
} from "../../generated/RecoveryManager/RecoveryManager"

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount  } from '../fetch/account'
import { fetchWallet  } from '../fetch/wallet'

export function handleOwnershipTransfered(event: OwnershipTransferedEvent): void {
}

export function handleRecoveryExecuted(event: RecoveryExecutedEvent): void {
  let wallet   = fetchWallet(event.params.wallet)
  let newOwner = fetchAccount(event.params.recovery)
  let id       = wallet.id.concat('/').concat(newOwner.id)

  let recovery          = new Recovery(id)
  recovery.wallet       = wallet.id
  recovery.newOwner     = newOwner.id
  recovery.executeAfter = event.params.executeAfter
  recovery.save()

  let ev          = new RecoveryExecuted(events.id(event))
  ev.emitter      = fetchAccount(event.address).id
  ev.transaction  = transactions.log(event).id
  ev.timestamp    = event.block.timestamp
  ev.wallet       = wallet.id
  ev.newOwner     = newOwner.id
  ev.executeAfter = event.params.executeAfter
  ev.save()
}

export function handleRecoveryFinalized(event: RecoveryFinalizedEvent): void {
  let wallet   = fetchWallet(event.params.wallet)
  let newOwner = fetchAccount(event.params.recovery)
  let id       = wallet.id.concat('/').concat(newOwner.id)

  store.remove("Recovery", id)

  let ev         = new RecoveryFinalized(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = wallet.id
  ev.newOwner    = newOwner.id
  ev.save()
}

export function handleRecoveryCanceled(event: RecoveryCanceledEvent): void {
  let wallet   = fetchWallet(event.params.wallet)
  let newOwner = fetchAccount(event.params.recovery)
  let id       = wallet.id.concat('/').concat(newOwner.id)

  store.remove("Recovery", id)

  let ev         = new RecoveryCanceled(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = wallet.id
  ev.newOwner    = newOwner.id
  ev.save()
}
