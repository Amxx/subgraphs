import {
	decimals,
} from '@amxx/graphprotocol-utils'

export function fetchDecimal(id: string): decimals.Value {
	return new decimals.Value(id)
}
