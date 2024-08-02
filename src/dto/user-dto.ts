import { IUser } from '../models/user-model'

export interface IUserDto {
	email: string
	id?: string
	isActivated?: boolean
}

export class UserDto<IUserDto> {
	email
	id
	isActivated

	constructor(model: IUser) {
		this.email = model.email
		this.id = model._id
		this.isActivated = model.isActivated
	}
}
