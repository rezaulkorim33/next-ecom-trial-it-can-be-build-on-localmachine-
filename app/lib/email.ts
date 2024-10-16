import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";

type profile = { name: string; email: string };

// New types for mail options
type VerificationMailOptions = {
  to: string;
  name: string;
  link: string;
};

type ForgetPasswordMailOptions = {
  to: string;
  name: string;
  link: string;
};

type UpdatePasswordMailOptions = {
  to: string;
  name: string;
};

const TOKEN = process.env.MAILTRAP_TOKEN!;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT!;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "hello@guponjinish.com", // Keep this unchanged
  name: "Mailtrap Test",
};

interface EmailOptions {
  profile: profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

// New function to send verification mail
const sendVerificationMailProd = async (options: VerificationMailOptions) => {
  const recipients = [
    {
      email: options.to,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "e1e23630-8364-4fdb-814f-32eea50e192f",
    template_variables: {
      user_name: options.name,
      sign_in_link: options.link,
    },
  });
};

// New function to send forget password mail
const sendForgetPasswordMailProd = async (options: ForgetPasswordMailOptions) => {
  const recipients = [
    {
      email: options.to,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d",
    template_variables: {
      user_name: options.name,
      link: options.link,
      btn_title: "Reset Password",
      company_name: "Next Ecom",
    },
  });
};

// New function to send password update confirmation mail
const sendUpdatePasswordMailProd = async (options: UpdatePasswordMailOptions) => {
  const recipients = [
    {
      email: options.to,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d",
    template_variables: {
      user_name: options.name,
      link: process.env.SIGN_IN_URL!,
      btn_title: "Sign in",
      company_name: "Next Ecom",
    },
  });
};

export const sendEmail = (options: EmailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verification":
      return sendVerificationMailProd({
        to: profile.email,
        name: profile.name,
        link: linkUrl!, // Assuming linkUrl is provided
      });
    case "forget-password":
      return sendForgetPasswordMailProd({
        to: profile.email,
        name: profile.name,
        link: linkUrl!, // Assuming linkUrl is provided
      });
    case "password-changed":
      return sendUpdatePasswordMailProd({
        to: profile.email,
        name: profile.name,
      });
  }
};
