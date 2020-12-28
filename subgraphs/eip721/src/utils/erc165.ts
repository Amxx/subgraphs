import {
	ethereum,
	Bytes
} from '@graphprotocol/graph-ts'

export function supportsInterface(contract: ethereum.SmartContract, interfaceId: String, expected: boolean = true): boolean {
	let result = contract.tryCall(
		'supportsInterface',
		'supportsInterface(bytes4):(bool)',
		[ethereum.Value.fromFixedBytes(Bytes.fromHexString(interfaceId) as Bytes)]
	)
	if (!result.reverted) {
		let value = result.value
		return value[0].toBoolean() == expected
	}
	return false
}
