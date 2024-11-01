import { IUser, userModel } from '../models/user-model'
import {
	findToken,
	generateTokens,
	removeToken,
	saveToken,
	validateRefreshToken
} from './token-service'
import { UserDto } from '../dto/user-dto'
import { ApiError } from '../exceptions/api-error'
import { Address } from '../config/types'
import { ERRORS } from '../config/constants'
import { settings } from '../models/settings-model'
import { verifyWalletSignature } from '../config/utils'

export const getUserData = async (user: IUser) => {
	const userDto = new UserDto(user)
	const tokens = generateTokens({ ...userDto })

	if (userDto.id) await saveToken(userDto.id, tokens.refreshToken)

	return { ...tokens, user: userDto }
}

export const loginService = async (
	chainId: number,
	ethAddress: Address,
	ethSignature: string,
	transmittedAt: string
) => {
	const user = await userModel.findOne({ ethAddress })

	if (!user) throw ApiError.BadRequest(ERRORS.USER_DOESNT_EXISTS)

	const digest = settings.logInSignatureTemplate
		.replace('{{chain_id}}', `${chainId}`)
		.replace('{{iso8601_timestamp}}', transmittedAt)
		.replace('{{realm}}', settings.signatureRealm)

	await verifyWalletSignature(ethAddress, ethSignature, transmittedAt, digest)

	return getUserData(user)
}

export const logoutService = async (refreshToken: string) =>
	await removeToken(refreshToken)

export const refreshService = async (refreshToken: string) => {
	if (!refreshToken) throw ApiError.UnauthorizedError()

	const userData = validateRefreshToken(refreshToken)
	const tokenFromDb = findToken(refreshToken)
	if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError()

	if (!userData.id) return

	const user = await userModel.findById(userData.id)

	if (!user) return

	return getUserData(user)
}
