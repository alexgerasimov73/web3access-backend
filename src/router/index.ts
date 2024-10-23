import express from 'express'
import { body } from 'express-validator'
import {
	activate,
	getSettings,
	getUsers,
	// login,
	logout,
	refresh,
	register
} from '../controllers/user-controller'
import { authMiddleware } from '../middlewares/auth-middleware'
import {
	startRegistration,
	submitDetails,
	verifyEmail
} from '../controllers/registration-controller'

const router = express.Router()

// router.post(
// 	'/register',
// 	body('email').isEmail(),
// 	body('password').isLength({ min: 3, max: 32 }),
// 	register
// )
// router.post('/login', login)
// router.post('/logout', logout)
// router.get('/activate/:link', activate)
// router.get('/refresh', refresh)
// router.get('/users', authMiddleware, getUsers)
router.get('/settings', getSettings)

router.post(
	'/registration/start',
	body('emailAddress').isEmail(),
	startRegistration
)

router.post(
	'/registration/verify-email',
	body('verificationToken')
		.trim()
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
		.optional()
		.trim()
		.escape()
		.matches(
			/^(https?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([a-zA-Z0-9_-]+)\/?$/
		)
		.withMessage('Invalid LinkedIn URL'),
	submitDetails
)

export default router
