import {
  InvestmentAdded,
  InvestmentRemoved,
} from "../../../generated/schema"

import {
  InvestmentAdded   as InvestmentAddedEvent,
  InvestmentRemoved as InvestmentRemovedEvent,
} from "../../../generated/defi/Invest/Invest"

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchWallet     } from '../../fetch/wallet'
import { fetchModule     } from '../../fetch/module'
import { fetchToken      } from '../../fetch/token'
import { fetchInvestment } from '../../fetch/defi/investment'

export function handleInvestmentAdded(event: InvestmentAddedEvent): void {
  let wallet       = fetchWallet(event.params.wallet)
  let module       = fetchModule(event.address)
  let token        = fetchToken(event.params.token)

  let ev         = new InvestmentAdded(events.id(event))
  ev.emitter     = module.id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.investment  = fetchInvestment(wallet, module, token).id
  ev.invested    = event.params.invested
  ev.period      = event.params.period
  ev.save()
}

export function handleInvestmentRemoved(event: InvestmentRemovedEvent): void {
  let wallet       = fetchWallet(event.params.wallet)
  let module       = fetchModule(event.address)
  let token        = fetchToken(event.params.token)

  let ev         = new InvestmentRemoved(events.id(event))
  ev.emitter     = module.id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.investment  = fetchInvestment(wallet, module, token).id
  ev.fraction    = event.params.fraction
  ev.save()
}
