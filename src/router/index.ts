import express from 'express'
import { body } from 'express-validator'
import {
	activate,
	getUsers,
	login,
	logout,
	refresh,
	register
} from '../controllers/user-controller'

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
router.get('/users', getUsers)

export default router
