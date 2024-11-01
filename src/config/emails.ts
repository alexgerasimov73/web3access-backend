export const getStartRegistrationEmailHTML = (
	link: string,
	verificationToken: string,
	apiUrl: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #4CAF50;
        }
        .content {
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 20px 0;
        }
        .tokenBox {
            display: inline-block;
            padding: 20px 40px;
            border-radius: 5px;
            background-color: #f5f5f5;
        }
        .tokenBox b {
            font-size: 24px;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #4CAF50;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #45a049;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Web3Access App!</h1>
        </div>
        <div class="content">
            <p>Thank you for registering at ${apiUrl}.</p>
            <p>This is your verification code.</p>
            <div class="tokenBox">
                <b>${verificationToken}</b>
            </div>
            <p>Please keep this code until the end of the registration process.</p>
            <p>To complete your registration, please proceed by clicking the button below:</p>
            <a href="${link}" class="button">Proceed with registration</a>
            <p>If the button above doesn't work, please copy and paste the following link into your browser:</p>
            <p><a href="${link}">${link}</a></p>
            <p>We're excited to have you on board. If you have any questions or need assistance, feel free to reply to this email.</p>
        </div>
        <div class="footer">
            <p>Thank you,<br>Your Web3Access Team</p>
            <p>If you didn't create an account, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`
