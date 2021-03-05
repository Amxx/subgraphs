import {
	Address,
	BigInt,
} from '@graphprotocol/graph-ts'

import {
	Account,
	TokenRegistry,
	Token,
} from '../../generated/schema'

import {
	IERC721Metadata,
} from '../../generated/IERC721/IERC721Metadata'

import {
	constants,
} from '@amxx/graphprotocol-utils'

export function fetchToken(registry: TokenRegistry, id: BigInt): Token {
	let tokenid = registry.id.concat('-').concat(id.toHex())
	let token = Token.load(tokenid)
	if (token == null) {
		let account_zero = new Account(constants.ADDRESS_ZERO)
		account_zero.save()

		token            = new Token(tokenid)
		token.registry   = registry.id
		token.identifier = id
		token.approval   = account_zero.id

		if (registry.supportsMetadata) {
			let erc721       = IERC721Metadata.bind(Address.fromString(registry.id))
			let try_tokenURI = erc721.try_tokenURI(id)
			token.uri        = try_tokenURI.reverted ? '' : try_tokenURI.value
		}
	}
	return token as Token
}
