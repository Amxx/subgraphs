import {
	Transfer,
	Paused,
	AddedBlackList,
	RemovedBlackList,
	UpdatedParams,
	Deprecate,
} from '../generated/schema'

import {
	TetherToken         as TetherTokenInterface,
	AddedBlackList      as AddedBlackListEvent,
	Approval            as ApprovalEvent,
	Deprecate           as DeprecateEvent,
	DestroyedBlackFunds as DestroyedBlackFundsEvent,
	Issue               as IssueEvent,
	Params              as ParamsEvent,
	Pause               as PauseEvent,
	Redeem              as RedeemEvent,
	RemovedBlackList    as RemovedBlackListEvent,
	Transfer            as TransferEvent,
	Unpause             as UnpauseEvent,
} from '../generated/TetherToken/TetherToken'

import {
	decimals,
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchAccount,
	fetchTetherToken,
	fetchBalance,
	fetchApproval,
} from './fetch'

export function handleTransfer(event: TransferEvent): void {
	let contract = fetchTetherToken(event.address)
	let from     = fetchAccount(event.params.from)
	let to       = fetchAccount(event.params.to)

	let fromBalance        = fetchBalance(contract, from)
	fromBalance.valueExact = fromBalance.valueExact.minus(event.params.value)
	fromBalance.value      = decimals.toDecimals(fromBalance.valueExact, contract.decimals)
	fromBalance.save()

	let toBalance          = fetchBalance(contract, to)
	toBalance.valueExact   = toBalance.valueExact.plus(event.params.value)
	toBalance.value        = decimals.toDecimals(toBalance.valueExact, contract.decimals)
	toBalance.save()

	let ev         = new Transfer(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = contract.id
	ev.from        = from.id
	ev.fromBalance = fromBalance.id
	ev.to          = to.id
	ev.toBalance   = toBalance.id
	ev.value       = decimals.toDecimals(event.params.value, contract.decimals)
	ev.valueExact  = event.params.value
	ev.save()
}

export function handleIssue(event: IssueEvent): void {
	let contract = fetchTetherToken(event.address)
	let owner    = fetchAccount(TetherTokenInterface.bind(event.address).owner())

	let totalSupply         = fetchBalance(contract, null)
	totalSupply.valueExact  = totalSupply.valueExact.plus(event.params.amount)
	totalSupply.value       = decimals.toDecimals(totalSupply.valueExact, contract.decimals)
	totalSupply.save()

	let ownerBalance        = fetchBalance(contract, owner)
	ownerBalance.valueExact = ownerBalance.valueExact.plus(event.params.amount)
	ownerBalance.value      = decimals.toDecimals(ownerBalance.valueExact, contract.decimals)
	ownerBalance.save()

	let ev         = new Transfer(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = contract.id
	ev.to          = owner.id
	ev.toBalance   = ownerBalance.id
	ev.value       = decimals.toDecimals(event.params.amount, contract.decimals)
	ev.valueExact  = event.params.amount
	ev.save()
}

export function handleRedeem(event: RedeemEvent): void {
	let contract = fetchTetherToken(event.address)
	let owner    = fetchAccount(TetherTokenInterface.bind(event.address).owner())

	let totalSupply         = fetchBalance(contract, null)
	totalSupply.valueExact  = totalSupply.valueExact.minus(event.params.amount)
	totalSupply.value       = decimals.toDecimals(totalSupply.valueExact, contract.decimals)
	totalSupply.save()

	let ownerBalance        = fetchBalance(contract, owner)
	ownerBalance.valueExact = ownerBalance.valueExact.minus(event.params.amount)
	ownerBalance.value      = decimals.toDecimals(ownerBalance.valueExact, contract.decimals)
	ownerBalance.save()

	let ev         = new Transfer(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = contract.id
	ev.from        = owner.id
	ev.fromBalance = ownerBalance.id
	ev.value       = decimals.toDecimals(event.params.amount, contract.decimals)
	ev.valueExact  = event.params.amount
	ev.save()
}

export function handleApproval(event: ApprovalEvent): void {
	let contract = fetchTetherToken(event.address)

	let owner           = fetchAccount(event.params.owner)
	let spender         = fetchAccount(event.params.spender)
	let approval        = fetchApproval(contract, owner, spender)
	approval.valueExact = event.params.value
	approval.value      = decimals.toDecimals(approval.valueExact, contract.decimals)
	approval.save()
}

export function handlePause(event: PauseEvent): void {
	let contract = fetchTetherToken(event.address)
	contract.isPaused = true
	contract.save()

	let ev         = new Paused(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = contract.id
	ev.isPaused    = true
	ev.save()
}

export function handleUnpause(event: UnpauseEvent): void {
	let contract = fetchTetherToken(event.address)
	contract.isPaused = false
	contract.save()

	let ev         = new Paused(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = contract.id
	ev.isPaused    = true
	ev.save()
}

export function handleAddedBlackList(event: AddedBlackListEvent): void {
	let contract = fetchTetherToken(event.address)
	let user     = fetchAccount(event.params._user)
	user.isBlacklisted = true
	user.save()

	let ev         = new AddedBlackList(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = contract.id
	ev.user        = user.id
	ev.save()
}

export function handleRemovedBlackList(event: RemovedBlackListEvent): void {
	let contract = fetchTetherToken(event.address)
	let user     = fetchAccount(event.params._user)
	user.isBlacklisted = false
	user.save()

	let ev         = new RemovedBlackList(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = contract.id
	ev.user        = user.id
	ev.save()
}

export function handleDestroyedBlackFunds(event: DestroyedBlackFundsEvent): void {
	let contract = fetchTetherToken(event.address)
	let owner    = fetchAccount(event.params._blackListedUser)

	let totalSupply         = fetchBalance(contract, null)
	totalSupply.valueExact  = totalSupply.valueExact.minus(event.params._balance)
	totalSupply.value       = decimals.toDecimals(totalSupply.valueExact, contract.decimals)
	totalSupply.save()

	let ownerBalance        = fetchBalance(contract, owner)
	ownerBalance.valueExact = ownerBalance.valueExact.minus(event.params._balance)
	ownerBalance.value      = decimals.toDecimals(ownerBalance.valueExact, contract.decimals)
	ownerBalance.save()

	let ev         = new Transfer(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = contract.id
	ev.from        = owner.id
	ev.fromBalance = ownerBalance.id
	ev.value       = decimals.toDecimals(event.params._balance, contract.decimals)
	ev.valueExact  = event.params._balance
	ev.save()
}

export function handleParams(event: ParamsEvent): void {
	let contract        = fetchTetherToken(event.address)
	contract.rate       = decimals.toDecimals(event.params.feeBasisPoints, 4)
	contract.maximumFee = decimals.toDecimals(event.params.maxFee, contract.decimals)
	contract.save()

	let ev         = new UpdatedParams(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = contract.id
	ev.rate        = contract.rate
	ev.maximumFee  = contract.maximumFee
	ev.save()
}

export function handleDeprecate(event: DeprecateEvent): void {
	let contract        = fetchTetherToken(event.address)
	let upgradedAddress = fetchAccount(event.params.newAddress)
	contract.upgradedAddress = upgradedAddress.id
	contract.save()

	let ev             = new Deprecate(events.id(event))
	ev.transaction     = transactions.log(event).id
	ev.timestamp       = event.block.timestamp
	ev.contract        = contract.id
	ev.upgradedAddress = upgradedAddress.id
	ev.save()
}
