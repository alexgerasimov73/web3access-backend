import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: false,
	logger: true,
	debug: true,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD
	}
})

export const sendActivationMail = async (
	to: string,
	activationLink: string
) => {
	await transporter.sendMail({
		from: process.env.SMTP_USER,
		to,
		subject: `Activation of account at ${process.env.API_URL}`,
		html: `
      <div>
        <h1>To activate, folllow the link <a href="${activationLink}">${activationLink}</a></h1>
      </div>
    `
	})
}
