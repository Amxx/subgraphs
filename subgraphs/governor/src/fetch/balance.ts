import {
	Account,
	Token,
	Balance,
} from '../../generated/schema'

import {
	decimals,
} from '@amxx/graphprotocol-utils'

export function fetchBalance(token: Token, account: Account): Balance {
	let id      = token.id.concat('/').concat(account.id)
	let balance = Balance.load(id)

	if (balance == null) {
		balance             = new Balance(id)
		let value           = new decimals.Value(id.concat('/balance'), token.decimals)
		let voting          = new decimals.Value(id.concat('/voting'), token.decimals)
		balance.token       = token.id
		balance.account     = account.id
		balance.value       = value.id
		balance.valueExact  = value.exact
		balance.voting      = voting.id
		balance.votingExact = voting.exact
		balance.delegate    = null
		balance.save()
	}
	return balance as Balance
}
