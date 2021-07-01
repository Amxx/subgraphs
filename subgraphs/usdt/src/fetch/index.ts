import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Account,
	TetherToken,
	Balance,
	Approval,
} from '../../generated/schema'

import {
	TetherToken as TetherTokenInterface,
} from '../../generated/TetherToken/TetherToken'

import {
	constants,
	decimals,
} from '@amxx/graphprotocol-utils'

export function fetchAccount(address: Address): Account {
	let account = new Account(address.toHex())
	account.save()
	return account
}

export function fetchTetherToken(address: Address): TetherToken {
	let account  = fetchAccount(address)
	let contract = TetherToken.load(account.id)

	if (contract == null) {
		let endpoint          = TetherTokenInterface.bind(address)
		contract              = new TetherToken(account.id)
		contract.name         = endpoint.name()                                               // "Tether USD"
		contract.symbol       = endpoint.symbol()                                             // "USDT"
		contract.decimals     = endpoint.decimals().toI32()                                   // 6
		contract.isPaused     = endpoint.paused()                                             // false
		contract.rate         = decimals.toDecimals(endpoint.basisPointsRate(), 4)            // constants.BIGDECIMAL_ZERO
		contract.maximumFee   = decimals.toDecimals(endpoint.maximumFee(), contract.decimals) // constants.BIGDECIMAL_ZERO
		contract.totalSupply  = fetchBalance(contract as TetherToken, null).id
		contract.asAccount    = account.id
		account.asTetherToken = contract.id
		contract.save()
		account.save()
	}

	return contract as TetherToken
}

export function fetchBalance(contract: TetherToken, account: Account | null): Balance {
	let id      = contract.id.concat('/').concat(account ? account.id : 'totalSupply')
	let balance = Balance.load(id)

	if (balance == null) {
		balance                 = new Balance(id)
		balance.contract        = contract.id
		balance.account         = account ? account.id : null
		balance.value           = constants.BIGDECIMAL_ZERO
		balance.valueExact      = constants.BIGINT_ZERO
		balance.save()
	}
	return balance as Balance
}

export function fetchApproval(contract: TetherToken, owner: Account, spender: Account): Approval {
	let id       = contract.id.concat('/').concat(owner.id).concat('/').concat(spender.id)
	let approval = Approval.load(id)

	if (approval == null) {
		approval                = new Approval(id)
		approval.contract       = contract.id
		approval.owner          = owner.id
		approval.spender        = spender.id
		approval.value          = constants.BIGDECIMAL_ZERO
		approval.valueExact     = constants.BIGINT_ZERO
	}
	return approval as Approval
}
