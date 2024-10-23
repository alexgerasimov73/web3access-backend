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

export interface ISubmitDetailsBody extends IVerifyEmailBody {
	readonly firstName: string
	readonly lastName: string
	readonly linkedIn?: string
}

export interface IConfirmWalletBody extends IVerifyEmailBody {
	readonly ethAddress: Address
	readonly ethSignature: string
	readonly transmittedAt: string
}

export interface ISignDocumentBody extends IVerifyEmailBody {
	readonly documentId: string
	readonly ethSignature: string
	readonly transmittedAt: string
}

export interface IVerifyCustomerBody extends IVerifyEmailBody {
	readonly simulatedData: string
}
