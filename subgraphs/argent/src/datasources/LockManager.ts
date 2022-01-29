import {
  Locked,
  Unlocked,
} from "../../generated/schema"

import {
  Locked   as LockedEvent,
  Unlocked as UnlockedEvent,
} from "../../generated/LockManager/LockManager"

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount } from '../fetch/account'
import { fetchWallet  } from '../fetch/wallet'

export function handleLocked(event: LockedEvent): void {
  let wallet    = fetchWallet(event.params.wallet)
  wallet.locked = true;
  wallet.save()

  let ev          = new Locked(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction  = transactions.log(event).id
  ev.timestamp    = event.block.timestamp
  ev.wallet       = wallet.id
  ev.releaseAfter = event.params.releaseAfter
  ev.save()
}

export function handleUnlocked(event: UnlockedEvent): void {
  let wallet    = fetchWallet(event.params.wallet)
  wallet.locked = false;
  wallet.save()

  let ev          = new Unlocked(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction  = transactions.log(event).id
  ev.timestamp    = event.block.timestamp
  ev.wallet       = wallet.id
  ev.save()
}
