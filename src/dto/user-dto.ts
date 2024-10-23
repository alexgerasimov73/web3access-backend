import { Address } from '../config/types'
import { IUser } from '../models/user-model'

export interface IUserDto {
	emailAddress: string
	ethAddress: Address
	id?: string
	firstName: string
	lastName: string
	linkedIn?: string
}

export class UserDto<IUserDto> {
	emailAddress
	ethAddress
	id
	firstName
	lastName
	linkedIn

	constructor(model: IUser) {
		this.emailAddress = model.emailAddress
		this.ethAddress = model.ethAddress
		this.id = model._id
		this.firstName = model.firstName
		this.lastName = model.lastName
		this.linkedIn = model.linkedIn
	}
}
