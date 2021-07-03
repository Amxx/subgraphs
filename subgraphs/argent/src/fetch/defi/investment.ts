import {
  Wallet,
  Module,
  Token,
  Investment,
} from '../../../generated/schema'

export function fetchInvestment(wallet: Wallet, module: Module, token: Token) : Investment {
  let investement    = new Investment(wallet.id.concat('/').concat(module.id).concat('/').concat(token.id))
  investement.wallet = wallet.id
  investement.module = module.id
  investement.token  = token.id
  investement.save()
  return investement
}
