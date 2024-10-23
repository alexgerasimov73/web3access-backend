export interface ISettings {
	readonly confirmEthAddressTemplate: string
	readonly logInSignatureTemplate: string
	readonly signatureRealm: string
}

export const settings: ISettings = {
	confirmEthAddressTemplate:
		'I, {{full_name}}, {{iso8601_timestamp}}, confirmed that I am going to use {{eth_address}} address at the web3Access platform.',
	logInSignatureTemplate:
		'{{chain_id}}:{{iso8601_timestamp}}:{{realm}}:CX_Authentication',
	signatureRealm: 'Staging'
}
