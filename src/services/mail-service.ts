import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import {
	getActivationEmailHTML,
	getStartRegistrationEmailHTML
} from '../config/emails'

dotenv.config()

const transporter = nodemailer.createTransport({
	port: Number(process.env.SMTP_PORT),
	host: process.env.SMTP_HOST,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD
	}
})

export const sendStartRegistrationMail = async (
	to: string,
	link: string,
	verificationToken: string
) => {
	const html = getStartRegistrationEmailHTML(
		link,
		verificationToken,
		process.env.API_URL || ''
	)

	await transporter.sendMail({
		from: process.env.SMTP_USER,
		to,
		subject: `Activate Your Account at ${process.env.API_URL}`,
		html
	})
}

// TODO: Revove this function.
export const sendActivationMail = async (
	to: string,
	activationLink: string
) => {
	const html = getActivationEmailHTML(activationLink, process.env.API_URL || '')

	await transporter.sendMail({
		from: process.env.SMTP_USER,
		to,
		subject: `Activate Your Account at ${process.env.API_URL}`,
		html
	})
}
