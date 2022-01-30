import {
  BigInt,
  Bytes,
  store,
} from '@graphprotocol/graph-ts'

import {
  Whitelist,
  Transfer,
  Approved,
  ContractCall,
  LimitChanged,
  AddedToWhitelist,
  RemovedFromWhitelist,
} from "../../generated/schema"

import {
  AddedToWhitelist          as AddedToWhitelistEvent,
  Approved                  as ApprovedEvent,
  ApprovedAndCalledContract as ApprovedAndCalledContractEvent,
  CalledContract            as CalledContractEvent,
  LimitChanged              as LimitChangedEvent,
  PendingTransferCanceled   as PendingTransferCanceledEvent,
  PendingTransferCreated    as PendingTransferCreatedEvent,
  PendingTransferExecuted   as PendingTransferExecutedEvent,
  RemovedFromWhitelist      as RemovedFromWhitelistEvent,
  Transfer                  as TransferEvent,
} from "../../generated/TransferManager/TransferManager"

import {
  constants,
  decimals,
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount } from '../fetch/account'
import { fetchWallet  } from '../fetch/wallet'
import { fetchToken   } from '../fetch/token'

let LIMIT_DISABLED = BigInt.fromString('340282366920938463463374607431768211455')

export function handleApproved(event: ApprovedEvent): void {
  let ev         = new Approved(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = fetchWallet(event.params.wallet).id
  ev.token       = fetchToken(event.params.token).id
  ev.amount      = event.params.amount
  ev.spender     = fetchAccount(event.params.spender).id
  ev.save()
}

export function handleTransfer(event: TransferEvent): void {
  let ev         = new Transfer(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = fetchWallet(event.params.wallet).id
  ev.token       = fetchToken(event.params.token).id
  ev.amount      = event.params.amount
  ev.to          = fetchAccount(event.params.to).id
  ev.data        = event.params.data
  ev.save()
}

export function handleCalledContract(event: CalledContractEvent): void {
  let ev         = new ContractCall(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = fetchWallet(event.params.wallet).id
  ev.to          = fetchAccount(event.params.to).id
  ev.amount      = decimals.toDecimals(event.params.amount)
  ev.selector    = Bytes.fromUint8Array(event.params.data.subarray(0,4)) // Only store the first 4 bytes
  ev.save()
}

export function handleApprovedAndCalledContract(event: ApprovedAndCalledContractEvent): void {
  let wallet   = fetchWallet(event.params.wallet)
  let token    = fetchToken(event.params.token)
  let contract = fetchAccount(event.params.to)

  {
    let ev         = new Approved(events.id(event).concat('/1'))
    ev.emitter     = fetchAccount(event.address).id
    ev.transaction = transactions.log(event).id
    ev.timestamp   = event.block.timestamp
    ev.wallet      = wallet.id
    ev.token       = token.id
    ev.amount      = event.params.amountApproved
    ev.spender     = fetchAccount(event.params.spender).id
    ev.save()
  }
  {
    let ev         = new Transfer(events.id(event).concat('/2'))
    ev.emitter     = fetchAccount(event.address).id
    ev.transaction = transactions.log(event).id
    ev.timestamp   = event.block.timestamp
    ev.wallet      = wallet.id
    ev.token       = token.id
    ev.amount      = event.params.amountSpent
    ev.to          = contract.id
    ev.data        = event.params.data
    ev.save()
  }
  {
    let ev         = new ContractCall(events.id(event).concat('/3'))
    ev.emitter     = fetchAccount(event.address).id
    ev.transaction = transactions.log(event).id
    ev.timestamp   = event.block.timestamp
    ev.wallet      = fetchWallet(event.params.wallet).id
    ev.to          = contract.id
    ev.amount      = constants.BIGDECIMAL_ZERO
    ev.selector    = Bytes.fromUint8Array(event.params.data.subarray(0,4)) // Only store the first 4 bytes
    ev.save()
  }
}

export function handleLimitChanged(event: LimitChangedEvent): void {
  let wallet   = fetchWallet(event.params.wallet)
  wallet.limit = (event.params.newLimit == LIMIT_DISABLED) ? null : decimals.toDecimals(event.params.newLimit)
  wallet.save();

  let ev         = new LimitChanged(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = fetchWallet(event.params.wallet).id
  ev.newLimit    = wallet.limit
  ev.startAfter  = event.params.startAfter
  ev.save()
}

export function handleAddedToWhitelist(event: AddedToWhitelistEvent): void {
  let wallet = fetchWallet(event.params.wallet)
  let target = fetchAccount(event.params.target)
  let id     = wallet.id.concat('/').concat(target.id)

  let whitelist    = new Whitelist(id)
  whitelist.wallet = wallet.id
  whitelist.target = target.id
  whitelist.save()

  let ev            = new AddedToWhitelist(events.id(event))
  ev.emitter        = fetchAccount(event.address).id
  ev.transaction    = transactions.log(event).id
  ev.timestamp      = event.block.timestamp
  ev.wallet         = wallet.id
  ev.target         = target.id
  ev.whitelistAfter = event.params.whitelistAfter
  ev.save()
}

export function handleRemovedFromWhitelist(event: RemovedFromWhitelistEvent): void {
  let wallet = fetchWallet(event.params.wallet)
  let target = fetchAccount(event.params.target)
  let id     = wallet.id.concat('/').concat(target.id)

  store.remove("Whitelist", id)

  let ev         = new RemovedFromWhitelist(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = wallet.id
  ev.target      = target.id
  ev.save()
}

export function handlePendingTransferCanceled(event: PendingTransferCanceledEvent): void {
  // TODO
  // (indexed address,indexed bytes32)
}

export function handlePendingTransferCreated(event: PendingTransferCreatedEvent): void {
  // TODO
  // (indexed address,indexed bytes32,indexed uint256,address,address,uint256,bytes)
}

export function handlePendingTransferExecuted(event: PendingTransferExecutedEvent): void {
  // TODO
  // (indexed address,indexed bytes32)
}
