import crypto from 'crypto'
import { verifyMessage } from 'ethers'
import { Address } from './types'
import { ApiError } from '../exceptions/api-error'
import { ERRORS } from './constants'

export const generateVerificationToken = (): string => {
	return crypto.randomBytes(4).toString('hex')
}

export const verifyWalletSignature = async (
	ethAddress: Address,
	ethSignature: string,
	transmittedAt: string,
	messageDigest: string
) => {
	const recoveredAddress = verifyMessage(messageDigest, ethSignature)

	if (recoveredAddress.toLowerCase() !== ethAddress.toLowerCase()) {
		throw ApiError.BadRequest(ERRORS.INVALID_SIGNATURE)
	}

	const timestampDifference = Math.abs(Date.now() - Date.parse(transmittedAt))
	// If the timestamp is more than 5 minutes, throw an error.
	if (timestampDifference > 5 * 60 * 1_000)
		throw ApiError.BadRequest(ERRORS.OLD_TIMESTAMP)
}
