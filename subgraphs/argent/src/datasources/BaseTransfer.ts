import {
	Bytes,
} from '@graphprotocol/graph-ts'

import {
	Transfer,
	Approved,
	ContractCall,
} from "../../generated/schema"

import {
	Transfer                  as TransferEvent,
	Approved                  as ApprovedEvent,
	CalledContract            as CalledContractEvent,
	ApprovedAndCalledContract as ApprovedAndCalledContractEvent,
} from "../../generated/BaseTransfer/BaseTransfer"

import {
	constants,
	decimals,
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import { fetchAccount } from '../fetch/account'
import { fetchWallet  } from '../fetch/wallet'
import { fetchToken   } from '../fetch/token'

export function handleTransfer(event: TransferEvent): void {
	let ev          = new Transfer(events.id(event))
	ev.transaction  = transactions.log(event).id
	ev.timestamp    = event.block.timestamp
	ev.wallet       = fetchWallet(event.params.wallet).id
	ev.token        = fetchToken(event.params.token).id
	ev.amount       = event.params.amount
	ev.to           = fetchAccount(event.params.to).id
	ev.data         = event.params.data
	ev.save()
}

export function handleApproved(event: ApprovedEvent): void {
	let ev          = new Approved(events.id(event))
	ev.transaction  = transactions.log(event).id
	ev.timestamp    = event.block.timestamp
	ev.wallet       = fetchWallet(event.params.wallet).id
	ev.token        = fetchToken(event.params.token).id
	ev.amount       = event.params.amount
	ev.spender      = fetchAccount(event.params.spender).id
	ev.save()
}

export function handleCalledContract(event: CalledContractEvent): void {
	let ev          = new ContractCall(events.id(event))
	ev.transaction  = transactions.log(event).id
	ev.timestamp    = event.block.timestamp
	ev.wallet       = fetchWallet(event.params.wallet).id
	ev.to           = fetchAccount(event.params.to).id
	ev.amount       = decimals.toDecimals(event.params.amount)
	ev.selector     = event.params.data.subarray(0,4) as Bytes // Only store the first 4 bytes
	ev.save()
}

export function handleApprovedAndCalledContract(event: ApprovedAndCalledContractEvent): void {
	let wallet   = fetchWallet(event.params.wallet)
	let token    = fetchToken(event.params.token)
	let contract = fetchAccount(event.params.to)

	{
		let ev          = new Approved(events.id(event).concat('/1'))
		ev.transaction  = transactions.log(event).id
		ev.timestamp    = event.block.timestamp
		ev.wallet       = wallet.id
		ev.token        = token.id
		ev.amount       = event.params.amountApproved
		ev.spender      = fetchAccount(event.params.spender).id
		ev.save()
	}
	{
		let ev          = new Transfer(events.id(event).concat('/2'))
		ev.transaction  = transactions.log(event).id
		ev.timestamp    = event.block.timestamp
		ev.wallet       = wallet.id
		ev.token        = token.id
		ev.amount       = event.params.amountSpent
		ev.to           = contract.id
		ev.data         = event.params.data
		ev.save()
	}
	{
		let ev          = new ContractCall(events.id(event).concat('/3'))
		ev.transaction  = transactions.log(event).id
		ev.timestamp    = event.block.timestamp
		ev.wallet       = fetchWallet(event.params.wallet).id
		ev.to           = contract.id
		ev.amount       = constants.BIGDECIMAL_ZERO
		ev.selector     = event.params.data.subarray(0,4) as Bytes // Only store the first 4 bytes
		ev.save()
	}
}
