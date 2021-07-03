import {
  TokenExchanged,
} from "../../generated/schema"

import {
  TokenExchanged as TokenExchangedEvent,
  TokenConverted as TokenConvertedEvent,
} from "../../generated/TokenExchanger/TokenExchanger"

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchWallet  } from '../fetch/wallet'
import { fetchToken   } from '../fetch/token'

export function handleTokenExchanged(event: TokenExchangedEvent): void {
  let ev          = new TokenExchanged(events.id(event))
  ev.transaction  = transactions.log(event).id
  ev.timestamp    = event.block.timestamp
  ev.wallet       = fetchWallet(event.params.wallet).id
  ev.srcToken     = fetchToken(event.params.srcToken).id
  ev.srcAmount    = event.params.srcAmount
  ev.dstToken     = fetchToken(event.params.destToken).id
  ev.dstAmount    = event.params.destAmount
  ev.save()
}

export function handleTokenConverted(event: TokenConvertedEvent): void {
  let ev          = new TokenExchanged(events.id(event))
  ev.transaction  = transactions.log(event).id
  ev.timestamp    = event.block.timestamp
  ev.wallet       = fetchWallet(event.params.wallet).id
  ev.srcToken     = fetchToken(event.params.srcToken).id
  ev.srcAmount    = event.params.srcAmount
  ev.dstToken     = fetchToken(event.params.destToken).id
  ev.dstAmount    = event.params.destAmount
  ev.save()
}
