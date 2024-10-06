export interface ISettings {
	readonly logInSignatureTemplate: string
	readonly signatureRealm: string
}

export const settings: ISettings = {
	logInSignatureTemplate:
		'{{chain_id}}:{{iso8601_timestamp}}:{{realm}}:CX_Authentication',
	signatureRealm: 'Staging'
}
