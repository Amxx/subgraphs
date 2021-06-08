import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Account,
	ERC20Token,
	ERC20Balance,
	ERC20Approval,
} from '../../generated/schema'

import {
	IERC20,
} from '../../generated/DAI/IERC20'

import {
	decimals,
} from '@amxx/graphprotocol-utils'

import {
	fetchAccount
} from './account'

export function fetchERC20(address: Address): ERC20Token {
	let token = ERC20Token.load(address.toHex())

	if (token == null) {
		let contract              = IERC20.bind(address)
		let name                  = contract.try_name()
		let symbol                = contract.try_symbol()
		let decimals              = contract.try_decimals()
		token                     = new ERC20Token(address.toHex())
		// Common
		token.name     = name.reverted     ? null : name.value
		token.symbol   = symbol.reverted   ? null : symbol.value
		token.decimals = decimals.reverted ? 18   : decimals.value
		token.save()

		let account     = fetchAccount(address)
		account.asERC20 = token.id
		account.save()
	}

	return token as ERC20Token
}

export function fetchERC20Balance(token: ERC20Token, account: Account): ERC20Balance {
	let id      = token.id.concat('/').concat(account.id)
	let balance = ERC20Balance.load(id)

	if (balance == null) {
		balance                 = new ERC20Balance(id)
		let value               = new decimals.Value(id.concat('/balance'), token.decimals)
		balance.token           = token.id
		balance.account         = account.id
		balance.value           = value.id
		balance.valueExact      = value.exact
	}
	return balance as ERC20Balance
}

export function fetchERC20Approval(token: ERC20Token, owner: Account, spender: Account): ERC20Approval {
	let id       = token.id.concat('/').concat(owner.id).concat('/').concat(spender.id)
	let approval = ERC20Approval.load(id)

	if (approval == null) {
		approval                = new ERC20Approval(id)
		let value               = new decimals.Value(id.concat('/approval'), token.decimals)
		approval.token          = token.id
		approval.owner          = owner.id
		approval.spender        = spender.id
		approval.value          = value.id
		approval.valueExact     = value.exact
	}
	return approval as ERC20Approval
}
