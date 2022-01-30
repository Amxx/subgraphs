import {
  TokenExchanged,
} from "../../../generated/schema"

import {
  TokenExchanged as TokenExchangedEvent,
  TokenConverted as TokenConvertedEvent,
} from "../../../generated/templates/Module/Module"

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount } from '../../fetch/account'
import { fetchWallet  } from '../../fetch/wallet'
import { fetchToken   } from '../../fetch/token'

export function handleTokenExchanged(event: TokenExchangedEvent): void {
  let ev         = new TokenExchanged(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = fetchWallet(event.params.wallet).id
  ev.srcToken    = fetchToken(event.params.srcToken).id
  ev.srcAmount   = event.params.srcAmount
  ev.dstToken    = fetchToken(event.params.destToken).id
  ev.dstAmount   = event.params.destAmount
  ev.save()
}

export function handleTokenConverted(event: TokenConvertedEvent): void {
  let ev         = new TokenExchanged(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = fetchWallet(event.params._wallet).id
  ev.srcToken    = fetchToken(event.params._srcToken).id
  ev.srcAmount   = event.params._srcAmount
  ev.dstToken    = fetchToken(event.params._destToken).id
  ev.dstAmount   = event.params._destAmount
  ev.save()
}
