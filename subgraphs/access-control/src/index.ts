import { store } from '@graphprotocol/graph-ts'

import {
	Account,
	AccessControl,
	Role,
	AccessControlRole,
	AccessControlRoleMember,
	RoleAdminChanged,
	RoleGranted,
	RoleRevoked,
} from '../generated/schema'

import {
	RoleAdminChanged as RoleAdminChangedEvent,
	RoleGranted      as RoleGrantedEvent,
	RoleRevoked      as RoleRevokedEvent,
} from '../generated/AccessControl/AccessControl'

import {
	constants,
	events,
	integers,
	transactions,
} from '@amxx/graphprotocol-utils'


export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
	let contract = new AccessControl(event.address.toHex());
	let role     = new Role(event.params.role.toHex());
	let admin    = new Role(event.params.newAdminRole.toHex());
	let previous = new Role(event.params.previousAdminRole.toHex());
	contract.save();
	role.save();
	admin.save();
	previous.save();

	let accesscontrolrole      = new AccessControlRole(contract.id.concat('-').concat(role.id));
	accesscontrolrole.contract = contract.id;
	accesscontrolrole.role     = role.id;
	accesscontrolrole.admin    = admin.id;
	accesscontrolrole.save()

	let ev               = new RoleAdminChanged(events.id(event));
	ev.transaction       = transactions.log(event).id;
	ev.timestamp         = event.block.timestamp;
	ev.role              = accesscontrolrole.id;
	ev.newAdminRole      = admin.id;
	ev.previousAdminRole = previous.id;
	ev.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
	let contract = new AccessControl(event.address.toHex());
	let role     = new Role(event.params.role.toHex());
	let account  = new Account(event.params.account.toHex());
	let sender   = new Account(event.params.sender.toHex());
	contract.save();
	role.save();
	account.save();
	sender.save();

	let accesscontrolrole      = new AccessControlRole(contract.id.concat('-').concat(role.id));
	accesscontrolrole.contract = contract.id;
	accesscontrolrole.role     = role.id;
	accesscontrolrole.save()

	let accesscontrolrolemember               = new AccessControlRoleMember(accesscontrolrole.id.concat('-').concat(account.id));
	accesscontrolrolemember.accesscontrolrole = accesscontrolrole.id
	accesscontrolrolemember.account           = account.id
	accesscontrolrolemember.save()

	let ev         = new RoleGranted(events.id(event));
	ev.transaction = transactions.log(event).id;
	ev.timestamp   = event.block.timestamp;
	ev.role        = accesscontrolrole.id;
	ev.account     = account.id;
	ev.sender      = sender.id;
	ev.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
	let contract = new AccessControl(event.address.toHex());
	let role     = new Role(event.params.role.toHex());
	let account  = new Account(event.params.account.toHex());
	let sender   = new Account(event.params.sender.toHex());
	contract.save();
	role.save();
	account.save();
	sender.save();

	let accesscontrolrole      = new AccessControlRole(contract.id.concat('-').concat(role.id));
	accesscontrolrole.contract = contract.id;
	accesscontrolrole.role     = role.id;
	accesscontrolrole.save()

	store.remove('AccessControlRoleMember', accesscontrolrole.id.concat('-').concat(account.id));

	let ev         = new RoleRevoked(events.id(event));
	ev.transaction = transactions.log(event).id;
	ev.timestamp   = event.block.timestamp;
	ev.role        = accesscontrolrole.id;
	ev.account     = account.id;
	ev.sender      = sender.id;
	ev.save()
}
