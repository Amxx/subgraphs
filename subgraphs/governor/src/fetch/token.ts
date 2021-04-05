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

function isCompToken(address: Address): boolean {
	let call = IComp.bind(address).try_DELEGATION_TYPEHASH()
	if (call.reverted) { return false }
	let value = call.value.toHex()
	if (value == "0xe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf") { return true } // keccak256("Delegation(address delegatee,uint256 nonce,uint256 expiry)");
	return false
}

export function fetchToken(address: Address) : Token | null {
	let token = Token.load(address.toHex())

	if (token == null && isCompToken(address)) {
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
