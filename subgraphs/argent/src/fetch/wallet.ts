import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Wallet,
} from '../../generated/schema'

import {
	Wallet as WalletTemplate
} from '../../generated/templates'

import {
	Wallet as WalletContract,
} from '../../generated/templates/Wallet/Wallet'

import {
	fetchAccount
} from './account'

export function fetchWallet(address: Address) : Wallet {
	let wallet = Wallet.load(address.toHex())

	if (wallet == null) {
		WalletTemplate.create(address)

		wallet               = new Wallet(address.toHex())
		wallet.asAccount     = wallet.id
		wallet.owner         = fetchAccount(WalletContract.bind(address).owner()).id
		wallet.locked        = false
		wallet.moduleCount   = 0
		wallet.guardianCount = 0
		wallet.save()

		let account      = fetchAccount(address)
		account.asWallet = wallet.id
		account.save()
	}

	return wallet as Wallet
}
