import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanagerlink.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailGenContent);
  const emailHtml = mailGenerator.generate(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (err) {
    console.error(
      "🔴 ERR. Email service failed silently. Make sure that you have provided your MAILTRAP credentials in the .env file:"
    );
    console.log("🔴 ERR. ", err);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! We're excited to have you on board.",
      actions: {
        instructions:
          "To verify your email, please click on the following button",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      actions: {
        instructions:
          "To reset the password, please click on the following button or link",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
