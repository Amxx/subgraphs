import {
  SessionCreated,
  SessionCleared,
} from "../../../generated/schema"

import {
  SessionCreated as SessionCreatedEvent,
  SessionCleared as SessionClearedEvent,
} from "../../../generated/templates/Module/Module"

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount } from '../../fetch/account'
import { fetchWallet  } from '../../fetch/wallet'

export function handleSessionCreated(event: SessionCreatedEvent): void {
  let wallet     = fetchWallet(event.params.wallet)
  let sessionKey = fetchAccount(event.params.sessionKey)

  wallet.sessionKey     = sessionKey.id
  wallet.sessionExpires = event.params.expires
  wallet.save()

  let ev         = new SessionCreated(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = wallet.id
  ev.sessionKey  = sessionKey.id
  ev.expires     = event.params.expires
  ev.save()
}

export function handleSessionCleared(event: SessionClearedEvent): void {
  let wallet     = fetchWallet(event.params.wallet)
  let sessionKey = fetchAccount(event.params.sessionKey)

  wallet.sessionKey = null;
  wallet.save()

  let ev         = new SessionCleared(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = wallet.id
  ev.sessionKey  = sessionKey.id
  ev.save()
}
