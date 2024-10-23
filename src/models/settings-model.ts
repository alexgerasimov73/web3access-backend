export interface ISettings {
	readonly confirmEthAddressTemplate: string
	readonly licenseSigningTemplate: string
	readonly logInSignatureTemplate: string
	readonly signatureRealm: string
	readonly licenceAgreement: {
		readonly id: string
		readonly name: string
		readonly downloadUrl: string
	}
}

export const settings: ISettings = {
	confirmEthAddressTemplate:
		'I, {{full_name}}, {{iso8601_timestamp}}, confirmed that I am going to use {{eth_address}} address at the web3Access platform.',
	licenseSigningTemplate:
		'I, {{full_name}}, {{iso8601_timestamp}}, confirmed that I have read and agree to the terms and conditions set out in the licence agreement.',
	// This is a mock data.
	licenceAgreement: {
		id: '73527a05-97f0-42bf-beff-bf6f6acb3037',
		name: 'License Agreement',
		downloadUrl: ''
	},
	logInSignatureTemplate:
		'{{chain_id}}:{{iso8601_timestamp}}:{{realm}}:CX_Authentication',
	signatureRealm: 'Staging'
}
