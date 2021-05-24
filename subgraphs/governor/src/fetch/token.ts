import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Token,
} from '../../generated/schema'

import {
	IComp,
} from '../../generated/Comp/IComp'

import {
	fetchAccount
} from './account'

export function fetchToken(address: Address) : Token | null {
	let token = Token.load(address.toHex())

	if (token == null) {
		let contract              = IComp.bind(address)
		let name                  = contract.try_name()
		let symbol                = contract.try_symbol()
		let decimals              = contract.try_decimals()
		token                     = new Token(address.toHex())
		// Common
		token.name     = name.reverted     ? null : name.value
		token.symbol   = symbol.reverted   ? null : symbol.value
		token.decimals = decimals.reverted ? 18   : decimals.value
		token.save()

		let account     = fetchAccount(address)
		account.asToken = token.id
		account.save()
	}

	return token
}
