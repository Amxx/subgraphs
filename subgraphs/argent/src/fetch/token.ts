import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Token,
} from '../../generated/schema'

import {
	fetchAccount
} from './account'

export function fetchToken(address: Address) : Token {
	let token = Token.load(address.toHex())

	if (token == null) {
		token           = new Token(address.toHex())
		token.asAccount = token.id
		token.save()

		let account     = fetchAccount(address)
		account.asToken = token.id
		account.save()
	}

	return token as Token
}
