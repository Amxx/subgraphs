import {
  Address,
} from '@graphprotocol/graph-ts'

import {
  Module,
} from '../../generated/schema'

import {
  Module as ModuleTemplate
} from '../../generated/templates'

import {
  fetchAccount
} from './account'

export function fetchModule(address: Address) : Module {
  let module = Module.load(address.toHex())

  if (module == null) {
    ModuleTemplate.create(address)

    module           = new Module(address.toHex())
    module.asAccount = module.id
    module.save()

    let account      = fetchAccount(address)
    account.asModule = module.id
    account.save()
  }

  return module as Module
}
