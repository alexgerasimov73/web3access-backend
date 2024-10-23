import type { Request } from 'express'

export type Address = `0x${string}`
export type TRequestBody<T> = Request<{}, {}, T>

export interface IStartRegistrationBody {
	readonly emailAddress: string
}

export interface IVerifyEmailBody {
	readonly id: string
	readonly verificationToken: string
}

export interface ISubmitDetailsBody {
	readonly id: string
	readonly firstName: string
	readonly lastName: string
	readonly linkedIn?: string
	readonly verificationToken: string
}

export interface IConfirmWalletBody {
	readonly id: string
	readonly ethAddress: Address
	readonly ethSignature: string
	readonly transmittedAt: string
	readonly verificationToken: string
}
