import {
	ethereum,
	BigInt,
} from '@graphprotocol/graph-ts'

import {
	Account,
	TokenRegistry,
	Token,
} from '../../generated/schema'

import {
	constants,
} from '@amxx/graphprotocol-utils'

export function fetchRegistry(contract: ethereum.SmartContract): TokenRegistry {
	let registryid = contract._address.toHex()
	let registry = TokenRegistry.load(registryid)
	if (registry == null) {
		registry = new TokenRegistry(registryid)
		// registry.name   = contract.try_name()
		// registry.symbol = contract.try_symbol()
		registry.name   = contract.call("name",   "name():(string)",   [])[0].toString()
		registry.symbol = contract.call("symbol", "symbol():(string)", [])[0].toString()
	}
	return registry as TokenRegistry
}

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
	}
	return token as Token
}
