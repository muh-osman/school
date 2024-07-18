<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Activate Your Account</title>
    <style type="text/css">
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }

        .email-container {
            width: 100%;
            background-color: #f4f4f4;
        }

        .email-content {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
        }

        .email-header {
            color: #3D4852;
            padding: 20px;
            padding-bottom: 0;
            text-align: center;
        }

        .email-body {
            padding: 20px;
            text-align: center;
            color: #333333;
        }

        .email-footer {
            color: #999999;
            text-align: center;
            padding: 20px;
            font-size: 12px;
        }

        .button {
            padding: 12px 24px;
            border-radius: 4px;
            color: #ffffff;
            background-color: #2D3748;
            display: inline-block;
            margin: 16px 0;
            text-decoration: none;
        }

        .email-p {
            color: #718096;
            font-size: 16px;
        }
    </style>
</head>

<body>
    <table class="email-container" role="presentation">
        <tbody>
            <tr>
                <td align="center" valign="top">
                    <table class="email-content" role="presentation">
                        <tr>
                            <td class="email-header">
                                <h1>Final Step to Activation</h1>
                            </td>
                        </tr>
                        <tr>
                            <td class="email-body">
                                <p class="email-p"> Follow the link below to verify your email address and activate your
                                    account.</p>
                                <a href="{{ $verificationUrl }}" class="button" target="_blank"
                                    style="color: #FFF;">Verify Email Address</a>
                                <p class="email-p">If the button above does not work, copy and paste the following link
                                    into your
                                    browser:</p>
                                <a href="{{ $verificationUrl }}" target="_blank">{{ $verificationUrl }}</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="email-footer">
                                <p>© 2024 All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
