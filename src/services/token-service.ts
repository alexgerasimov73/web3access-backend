import jwt from 'jsonwebtoken'
import { tokenModel } from '../models/token-model'
import { IUserDto } from '../dto/user-dto'

export const generateTokens = (payload: IUserDto) => {
	const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
		expiresIn: '30m'
	})
	const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
		expiresIn: '30d'
	})

	return { accessToken, refreshToken }
}

export const saveToken = async (userId: string, refreshToken: string) => {
	const tokenData = await tokenModel.findOne({ user: userId })

	if (tokenData) {
		tokenData.refreshToken = refreshToken

		return tokenData.save()
	}

	const token = await tokenModel.create({ user: userId, refreshToken })

	return token
}
