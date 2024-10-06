import express from 'express'
import { body } from 'express-validator'
import {
	activate,
	getSettings,
	getUsers,
	login,
	logout,
	refresh,
	register
} from '../controllers/user-controller'
import { authMiddleware } from '../middlewares/auth-middleware'

const router = express.Router()

router.post(
	'/register',
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 32 }),
	register
)
router.post('/login', login)
router.post('/logout', logout)
router.get('/activate/:link', activate)
router.get('/refresh', refresh)
router.get('/users', authMiddleware, getUsers)
router.get('/settings', getSettings)

export default router
