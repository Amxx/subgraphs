import {
  CollateralAdded,
  CollateralRemoved,
  DebtAdded,
  DebtRemoved,
} from "../../../generated/schema"

import {
  CollateralAdded   as CollateralAddedEvent,
  CollateralRemoved as CollateralRemovedEvent,
  DebtAdded         as DebtAddedEvent,
  DebtRemoved       as DebtRemovedEvent,
  LoanClosed        as LoanClosedEvent,
  LoanOpened        as LoanOpenedEvent,
} from "../../../generated/defi/Loan/Loan"

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount } from '../../fetch/account'
import { fetchWallet  } from '../../fetch/wallet'
import { fetchToken   } from '../../fetch/token'
import { fetchLoan    } from '../../fetch/defi/loan'

export function handleCollateralAdded(event: CollateralAddedEvent): void {
  let wallet = fetchWallet(event.params.wallet)
  let loan   = fetchLoan(wallet, event.params.loanId)

  let ev         = new CollateralAdded(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.loan        = loan.id
  ev.token       = fetchToken(event.params.collateral).id
  ev.amount      = event.params.collateralAmount
  ev.save()
}

export function handleCollateralRemoved(event: CollateralRemovedEvent): void {
  let wallet = fetchWallet(event.params.wallet)
  let loan   = fetchLoan(wallet, event.params.loanId)

  let ev         = new CollateralRemoved(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.loan        = loan.id
  ev.token       = fetchToken(event.params.collateral).id
  ev.amount      = event.params.collateralAmount
  ev.save()
}

export function handleDebtAdded(event: DebtAddedEvent): void {
  let wallet = fetchWallet(event.params.wallet)
  let loan   = fetchLoan(wallet, event.params.loanId)

  let ev         = new DebtAdded(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.loan        = loan.id
  ev.token       = fetchToken(event.params.debtToken).id
  ev.amount      = event.params.debtAmount
  ev.save()
}

export function handleDebtRemoved(event: DebtRemovedEvent): void {
  let wallet = fetchWallet(event.params.wallet)
  let loan   = fetchLoan(wallet, event.params.loanId)

  let ev         = new DebtRemoved(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.loan        = loan.id
  ev.token       = fetchToken(event.params.debtToken).id
  ev.amount      = event.params.debtAmount
  ev.save()
}

export function handleLoanClosed(event: LoanClosedEvent): void {
  let wallet = fetchWallet(event.params.wallet)
  let loan   = fetchLoan(wallet, event.params.loanId)
  loan.closed = true
  loan.save()
}

export function handleLoanOpened(event: LoanOpenedEvent): void {
  let wallet = fetchWallet(event.params.wallet)
  let loan   = fetchLoan(wallet, event.params.loanId)

  {
    let ev         = new CollateralAdded(events.id(event).concat('/0'))
    ev.emitter     = fetchAccount(event.address).id
    ev.transaction = transactions.log(event).id
    ev.timestamp   = event.block.timestamp
    ev.loan        = loan.id
    ev.token       = fetchToken(event.params.collateral).id
    ev.amount      = event.params.collateralAmount
    ev.save()
  }

  {
    let ev         = new DebtAdded(events.id(event).concat('/1'))
    ev.emitter     = fetchAccount(event.address).id
    ev.transaction = transactions.log(event).id
    ev.timestamp   = event.block.timestamp
    ev.loan        = loan.id
    ev.token       = fetchToken(event.params.debtToken).id
    ev.amount      = event.params.debtAmount
    ev.save()
  }
}
