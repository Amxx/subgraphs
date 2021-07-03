import {
  Address,
} from '@graphprotocol/graph-ts'

import {
  NftContract,
} from '../../generated/schema'

import {
  fetchAccount
} from './account'

export function fetchNftContract(address: Address) : NftContract {
  let nftcontract = NftContract.load(address.toHex())

  if (nftcontract == null) {
    nftcontract           = new NftContract(address.toHex())
    nftcontract.asAccount = nftcontract.id
    nftcontract.save()

    let account           = fetchAccount(address)
    account.asNftContract = nftcontract.id
    account.save()
  }

  return nftcontract as NftContract
}
