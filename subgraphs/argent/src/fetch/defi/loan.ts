import {
  Bytes,
} from '@graphprotocol/graph-ts'

import {
  Wallet,
  Loan,
} from '../../../generated/schema'

export function fetchLoan(wallet: Wallet, loanId: Bytes) : Loan {
  let loan    = new Loan(wallet.id.concat('/').concat(loanId.toHex()))
  loan.wallet = wallet.id
  loan.save()
  return loan
}
