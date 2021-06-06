import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Wallet,
} from '../../generated/schema'

import {
	fetchAccount
} from './account'

export function fetchWallet(address: Address) : Wallet {
	let wallet = Wallet.load(address.toHex())

	if (wallet == null) {
		wallet = new Wallet(address.toHex())
		// TODO: index implementation ?

		let account      = fetchAccount(address)
		account.asWallet = wallet.id
		account.save()
	}

	return wallet as Wallet
}
