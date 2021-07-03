import {
  InvestmentAdded,
  InvestmentRemoved,
} from "../../generated/schema"

import {
  InvestmentAdded   as InvestmentAddedEvent,
  InvestmentRemoved as InvestmentRemovedEvent,
} from "../../generated/Invest/Invest"

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchWallet } from '../fetch/wallet'
import { fetchModule } from '../fetch/module'
import { fetchToken  } from '../fetch/token'

export function handleInvestmentAdded(event: InvestmentAddedEvent): void {
  let ev          = new InvestmentAdded(events.id(event))
  ev.transaction  = transactions.log(event).id
  ev.timestamp    = event.block.timestamp
  ev.wallet       = fetchWallet(event.params._wallet).id
  ev.module       = fetchModule(event.address).id
  ev.token        = fetchToken(event.params._token).id
  ev.invested     = event.params._invested
  ev.period       = event.params._period
  ev.save()
}

export function handleInvestmentRemoved(event: InvestmentRemovedEvent): void {
  let ev          = new InvestmentRemoved(events.id(event))
  ev.transaction  = transactions.log(event).id
  ev.timestamp    = event.block.timestamp
  ev.wallet       = fetchWallet(event.params._wallet).id
  ev.module       = fetchModule(event.address).id
  ev.token        = fetchToken(event.params._token).id
  ev.fraction     = event.params._fraction
  ev.save()
}
