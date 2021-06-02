import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Module,
} from '../../generated/schema'

import {
	fetchAccount
} from './account'

export function fetchModule(address: Address) : Module {
	let module = Module.load(address.toHex())

	if (module == null) {
		module = new Module(address.toHex())
		module.save()

		let account      = fetchAccount(address)
		account.asModule = module.id
		account.save()
	}

	return module as Module
}
