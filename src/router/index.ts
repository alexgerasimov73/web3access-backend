import express from 'express'
import { body } from 'express-validator'
import {
	getSettings,
	launchServer,
	login,
	logout,
	refresh
} from '../controllers/user-controller'
import {
	confirmWallet,
	signDocument,
	startRegistration,
	submitDetails,
	verifyCustomer,
	verifyEmail
} from '../controllers/registration-controller'

const router = express.Router()

router.get('/settings', getSettings)

router.post(
	'/registration/start',
	body('emailAddress').trim().notEmpty().isEmail(),
	startRegistration
)

router.post(
	'/registration/verify-email',
	body('verificationToken')
		.trim()
		.notEmpty()
		.isLength({ min: 8, max: 8 })
		.withMessage('Verification token must be 8 characters long'),
	verifyEmail
)

router.post(
	'/registration/submit-details',
	body('firstName')
		.trim()
		.escape()
		.notEmpty()
		.withMessage('First name is required'),
	body('lastName')
		.trim()
		.escape()
		.notEmpty()
		.withMessage('Last name is required'),
	body('linkedIn')
		.optional({ checkFalsy: true })
		.trim()
		.matches(
			'^(https?:\\/\\/)?([\\w]+\\.)?linkedin\\.com\\/(pub|in|profile)\\/([-a-zA-Z0-9]+)\\/?$',
			'i'
		)
		.withMessage('Invalid LinkedIn URL'),
	submitDetails
)

router.post(
	'/registration/confirm-wallet',
	body('ethAddress')
		.trim()
		.notEmpty()
		.custom(value => {
			if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
				throw new Error('Invalid Ethereum address')
			}
			return true
		}),
	confirmWallet
)

router.post('/registration/sign-document', signDocument)

router.post('/registration/verify-customer', verifyCustomer)

router.get('/refresh', refresh)

router.post(
	'/login',
	body('chainId').trim().notEmpty(),
	body('ethAddress')
		.trim()
		.notEmpty()
		.custom(value => {
			if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
				throw new Error('Invalid Ethereum address')
			}
			return true
		}),
	login
)

router.post('/logout', logout)

// This endpoint is exceptionally needed to launch the server
// so that the application can be ready for work sooner because,
// on the free plan, the server doesn't work permanently.
router.get('/launch-server', launchServer)

export default router
