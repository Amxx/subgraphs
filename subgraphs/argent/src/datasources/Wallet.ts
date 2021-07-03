import {
  Bytes,
  store,
} from '@graphprotocol/graph-ts'

import {
  Method,
  WalletModule,
  WalletMethod,
  WalletOwnerChange,
  WalletAuthorizeModule,
  WalletEnabledStaticCall,
  WalletInvoked,
  WalletReceived,
} from '../../generated/schema'

import {
  Wallet,
  OwnerChanged      as OwnerChangedEvent,
  AuthorisedModule  as AuthorisedModuleEvent,
  EnabledStaticCall as EnabledStaticCallEvent,
  Invoked           as InvokedEvent,
  Received          as ReceivedEvent,
} from '../../generated/templates/Wallet/Wallet'

import {
  constants,
  decimals,
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount } from '../fetch/account'
import { fetchWallet  } from '../fetch/wallet'
import { fetchModule  } from '../fetch/module'

export function handleOwnerChanged(event: OwnerChangedEvent): void {
  let owner  = fetchAccount(event.params.owner)
  let wallet = fetchWallet(event.address)
  wallet.owner = owner.id
  wallet.save()

  let ev         = new WalletOwnerChange(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = wallet.id
  ev.owner       = owner.id
  ev.save()
}

export function handleAuthorisedModule(event: AuthorisedModuleEvent): void {
  let wallet = fetchWallet(event.address)
  let module = fetchModule(event.params.module)
  let id     = wallet.id.concat('/').concat(module.id)

  wallet.moduleCount = Wallet.bind(event.address).modules().toI32()
  wallet.save()

  if (Wallet.bind(event.address).authorised(event.params.module)) {
    let wm    = new WalletModule(id)
    wm.wallet = wallet.id
    wm.module = module.id
    wm.save()
  } else {
    store.remove('WalletModule', id)
  }

  let ev         = new WalletAuthorizeModule(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = wallet.id
  ev.module      = module.id
  ev.value       = event.params.value
  ev.save()
}

export function handleEnabledStaticCall(event: EnabledStaticCallEvent): void {
  let wallet = fetchWallet(event.address)
  let module = fetchModule(event.params.module)
  let method = new Method(event.params.method.toHex())
  let id     = wallet.id.concat('/').concat(method.id)
  method.save()

  if (module.id !== constants.ADDRESS_ZERO) {
    let sc    = new WalletMethod(id)
    sc.wallet = wallet.id
    sc.module = module.id
    sc.method = method.id
    sc.save()
  } else {
    store.remove('WalletMethod', id)
  }

  let ev         = new WalletEnabledStaticCall(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = wallet.id
  ev.module      = module.id
  ev.method      = method.id
  ev.save()
}

export function handleInvoked(event: InvokedEvent): void {
  let wallet = fetchWallet(event.address)
  let module = fetchModule(event.params.module)
  let target = fetchAccount(event.params.target)

  let ev         = new WalletInvoked(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = wallet.id
  ev.module      = module.id
  ev.target      = target.id
  ev.value       = decimals.toDecimals(event.params.value)
  ev.selector    = event.params.data.subarray(0,4) as Bytes // Only store the first 4 bytes
  ev.save()
}

export function handleReceived(event: ReceivedEvent): void {
  let wallet = fetchWallet(event.address)
  let sender = fetchAccount(event.params.sender)

  let ev         = new WalletReceived(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = wallet.id
  ev.value       = decimals.toDecimals(event.params.value)
  ev.sender      = sender.id
  ev.save()
}
