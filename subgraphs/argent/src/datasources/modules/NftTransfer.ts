import {
  NonFungibleTransfer,
} from "../../../generated/schema"

import {
  NonFungibleTransfer as NonFungibleTransferEvent,
} from "../../../generated/templates/Module/Module"

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount     } from '../../fetch/account'
import { fetchWallet      } from '../../fetch/wallet'
import { fetchNftContract } from '../../fetch/nftcontract'

export function handleNonFungibleTransfer(event: NonFungibleTransferEvent): void {
  let ev         = new NonFungibleTransfer(events.id(event))
  ev.emitter     = fetchAccount(event.address).id
  ev.transaction = transactions.log(event).id
  ev.timestamp   = event.block.timestamp
  ev.wallet      = fetchWallet(event.params.wallet).id
  ev.contract    = fetchNftContract(event.params.nftContract).id
  ev.tokenId     = event.params.tokenId
  ev.to          = fetchAccount(event.params.to).id
  ev.data        = event.params.data
  ev.save()
}
