import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Timelock,
} from '../../generated/schema'

import {
	ITimelock,
} from '../../generated/Timelock/ITimelock'

import {
	fetchAccount
} from './account'

export function fetchTimelock(address: Address) : Timelock | null {
	let timelock = Timelock.load(address.toHex())

	if (timelock == null) {
		let contract      = ITimelock.bind(address)
		let GRACE_PERIOD  = contract.try_GRACE_PERIOD()
		if (GRACE_PERIOD.reverted) { return null }
		let MINIMUM_DELAY = contract.try_MINIMUM_DELAY()
		let MAXIMUM_DELAY = contract.try_MAXIMUM_DELAY()
		let admin         = contract.try_admin()
		let pendingAdmin  = contract.try_pendingAdmin()
		let delay         = contract.try_delay()

		timelock = new Timelock(address.toHex())
		if (!admin.reverted        ) timelock.admin         = fetchAccount(admin.value).id
		if (!pendingAdmin.reverted ) timelock.pendingAdmin  = fetchAccount(pendingAdmin.value).id
		if (!delay.reverted        ) timelock.delay         = delay.value
		if (!GRACE_PERIOD.reverted ) timelock.GRACE_PERIOD  = GRACE_PERIOD.value
		if (!MINIMUM_DELAY.reverted) timelock.MINIMUM_DELAY = MINIMUM_DELAY.value
		if (!MAXIMUM_DELAY.reverted) timelock.MAXIMUM_DELAY = MAXIMUM_DELAY.value
		timelock.save()

		let account        = fetchAccount(address)
		account.asTimelock = timelock.id
		account.save()
	}

	return timelock
}
