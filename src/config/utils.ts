import crypto from 'crypto'

export const generateVerificationToken = (): string => {
	return crypto.randomBytes(4).toString('hex')
}
