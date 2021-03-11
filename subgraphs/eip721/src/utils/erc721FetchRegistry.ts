import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Contract,
	TokenRegistry,
} from '../../generated/schema'

import {
	IERC721Metadata,
} from '../../generated/IERC721/IERC721Metadata'

import {
	supportsInterface,
} from './erc165'

export function fetchRegistry(address: Address): TokenRegistry {
	let erc721   = IERC721Metadata.bind(address)
	let contract = Contract.load(address.toHex())

	if (contract == null) {
		contract = new Contract(address.toHex())
		let introspection_01ffc9a7 = supportsInterface(erc721, '01ffc9a7') // ERC165
		let introspection_80ac58cd = supportsInterface(erc721, '80ac58cd') // ERC721
		let introspection_00000000 = supportsInterface(erc721, '00000000', false)
		let isERC721               = introspection_01ffc9a7 && introspection_80ac58cd && introspection_00000000
		contract.asERC721          = isERC721 ? contract.id : null
		contract.save()
	}

	if (contract.asERC721 != null)
	{
		let registry = TokenRegistry.load(contract.id)
		if (registry == null) {
			registry = new TokenRegistry(contract.id)
			let try_name              = erc721.try_name()
			let try_symbol            = erc721.try_symbol()
			registry.name             = try_name.reverted   ? '' : try_name.value
			registry.symbol           = try_symbol.reverted ? '' : try_symbol.value
			registry.supportsMetadata = supportsInterface(erc721, '5b5e139f') // ERC721Metadata
		}
		return registry as TokenRegistry
	}

	return null as TokenRegistry
}
