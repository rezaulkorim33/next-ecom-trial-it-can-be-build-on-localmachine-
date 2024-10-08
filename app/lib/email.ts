import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";

type profile = { name: string; email: string };

// Removed TOKEN and ENDPOINT constants

const client = new MailtrapClient({
  endpoint: "https://api.mailtrap.io/v1", // Ensure the endpoint is correctly specified
  token: "d07cb0e3bd92b5f6d46ca86c064dfbe7", // Keep your Mailtrap API token hardcoded for testing
});

const sender = {
  email: "hello@guponjinish.com",
  name: "Mailtrap Test",
};

interface EmailOptions {
  profile: profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "api",
      pass: "d07cb0e3bd92b5f6d46ca86c064dfbe7", // Keep your Mailtrap SMTP credentials
    },
  });
  return transport;
};

const sendEmailVerificationLink = async (profile: profile, linkUrl: string) => {
  const recipients = [
    {
      email: profile.email,
    },
  ];

  try {
    await client.send({
      from: sender,
      to: recipients,
      template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d",
      template_variables: {
        subject: "Verify Your Email",
        user_name: profile.name,
        link: linkUrl,
        btn_title: "Click Me to Verify Email",
        company_name: "Next Ecom",
      },
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

const sendForgetPasswordLink = async (profile: profile, linkUrl: string) => {
  const recipients = [
    {
      email: profile.email,
    },
  ];

  try {
    await client.send({
      from: sender,
      to: recipients,
      template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d",
      template_variables: {
        subject: "Forget Password Link",
        user_name: profile.name,
        link: linkUrl,
        btn_title: "Reset Password",
        company_name: "Next Ecom",
      },
    });
  } catch (error) {
    console.error("Error sending forget password email:", error);
  }
};

const sendUpdatePasswordConfirmation = async (profile: profile) => {
  const recipients = [
    {
      email: profile.email,
    },
  ];

  try {
    await client.send({
      from: sender,
      to: recipients,
      template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d",
      template_variables: {
        subject: "Password Reset Successful",
        user_name: profile.name,
        link: process.env.SIGN_IN_URL!, // Assuming this is set in your environment
        btn_title: "Sign in",
        company_name: "Next Ecom",
      },
    });
  } catch (error) {
    console.error("Error sending password change confirmation email:", error);
  }
};

export const sendEmail = (options: EmailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verification":
      return sendEmailVerificationLink(profile, linkUrl!);
    case "forget-password":
      return sendForgetPasswordLink(profile, linkUrl!);
    case "password-changed":
      return sendUpdatePasswordConfirmation(profile);
  }
};
