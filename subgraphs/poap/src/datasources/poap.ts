import {
  store,
  BigInt,
} from "@graphprotocol/graph-ts";

import {
  AdminAdded         as AdminAddedEvent,
  AdminRemoved       as AdminRemovedEvent,
  EventMinterAdded   as EventMinterAddedEvent,
  EventMinterRemoved as EventMinterRemovedEvent,
  EventToken         as EventTokenEvent,
} from '../../generated/poap/poap'

import {
  PoapEvent,
  ERC721Token as PoapToken,
  PoapAdmin,
  PoapAdminAdded,
  PoapAdminRemoved,
  PoapEventMinter,
  PoapEventMinterAdded,
  PoapEventMinterRemoved,
} from '../../generated/schema'

import {
  IERC721,
} from '@openzeppelin/subgraphs/generated/erc721/IERC721'

import {
  ERC721Contract,
} from '@openzeppelin/subgraphs/generated/schema'

import {
  fetchAccount,
} from '@openzeppelin/subgraphs/src/fetch/account'

import {
  fetchERC721,
  fetchERC721Token,
} from '@openzeppelin/subgraphs/src/fetch/erc721'

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'



export function fetchPoapEvent(contract: ERC721Contract, identifier: BigInt): PoapEvent {
  let poapevent = new PoapEvent(contract.id.concat('/').concat(identifier.toHex()))
  poapevent.save()
  return poapevent as PoapEvent
}

export function handleEventToken(event: EventTokenEvent): void {
  let contract  = fetchERC721(event.address)

  let poapevent = fetchPoapEvent(contract, event.params.eventId)
  poapevent.save()

  // for some reason the handleTransfer might not be processed and owner might not be set :/
  let token     = fetchERC721Token(contract, event.params.tokenId) as PoapToken
  token.owner   = fetchAccount(IERC721.bind(event.address).ownerOf(event.params.tokenId)).id
  token.event   = poapevent.id
  token.save()
}

export function handleAdminAdded(event: AdminAddedEvent): void {
  let contract  = fetchAccount(event.address)
  let admin     = fetchAccount(event.params.account)
  let id        = event.address.toHex().concat('/').concat(admin.id)

  let poapadmin      = new PoapAdmin(id)
  poapadmin.contract = contract.id
  poapadmin.admin    = admin.id
  poapadmin.enabled  = true
  poapadmin.save()

  let ev         = new PoapAdminAdded(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.poapAdmin   = poapadmin.id
  ev.save()
}

export function handleAdminRemoved(event: AdminRemovedEvent): void {
  let contract  = fetchAccount(event.address)
  let admin     = fetchAccount(event.params.account)
  let id        = contract.id.concat('/').concat(admin.id)

  let poapadmin      = new PoapAdmin(id)
  poapadmin.contract = contract.id
  poapadmin.admin    = admin.id
  poapadmin.enabled  = false
  poapadmin.save()

  let ev         = new PoapAdminRemoved(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.poapAdmin   = poapadmin.id
  ev.save()
}

export function handleEventMinterAdded(event: EventMinterAddedEvent): void {
  let contract  = fetchAccount(event.address)
  let minter    = fetchAccount(event.params.account)
  let id        = contract.id.concat('/').concat(minter.id)

  let poapeventminter         = new PoapEventMinter(id)
  poapeventminter.contract    = contract.id
  poapeventminter.eventMinter = minter.id
  poapeventminter.enabled     = true
  poapeventminter.save()

  let ev             = new PoapEventMinterAdded(events.id(event))
  ev.transaction     = transactions.log(event).id
  ev.timestamp       = event.block.timestamp
  ev.poapEventMinter = poapeventminter.id
  ev.save()
}

export function handleEventMinterRemoved(event: EventMinterRemovedEvent): void {
  let contract  = fetchAccount(event.address)
  let minter    = fetchAccount(event.params.account)
  let id        = contract.id.concat('/').concat(minter.id)

  let poapeventminter         = new PoapEventMinter(id)
  poapeventminter.contract    = contract.id
  poapeventminter.eventMinter = minter.id
  poapeventminter.enabled     = false
  poapeventminter.save()

  let ev             = new PoapEventMinterRemoved(events.id(event))
  ev.transaction     = transactions.log(event).id
  ev.timestamp       = event.block.timestamp
  ev.poapEventMinter = poapeventminter.id
  ev.save()
}
