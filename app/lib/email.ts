import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";

type profile = { name: string; email: string };

const TOKEN = process.env.MAILTRAP_TOKEN!;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT!;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "hello@guponjinish.com",
  name: "Goponjinish email Verification",
};

interface emailOptions {
  profile: profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

const generatemailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "bcab674080b230",
      pass: "7fc09eafd1ea51",
    },
  });
  return transport;
};

const sendemailVerificationLink = async (profile: profile, linkUrl: string) => {
  // const transport = generatemailTransporter();
  // await transport.sendMail({
  //   from: "verification@nextecom.com",
  //   to: profile.email,
  //   html: `<h1>Please verify your email by clicking on <a href="${linkUrl}">this link</a> </h1>`,
  // });

  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d",
    template_variables: {
      subject: "Verify Your email",
      user_name: profile.name,
      link: linkUrl,
      btn_title: "Click Me to Verify email",
      company_name: "Goponjinish.com",
    },
  });
};

const sendForgetPasswordLink = async (profile: profile, linkUrl: string) => {
  // const transport = generatemailTransporter();

  // await transport.sendMail({
  //   from: "verification@nextecom.com",
  //   to: profile.email,
  //   html: `<h1>Click on <a href="${linkUrl}">this link</a> to reset your password.</h1>`,
  // });

  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d",
    template_variables: {
      subject: "Forget Password Link",
      user_name: profile.name,
      link: linkUrl,
      btn_title: "Reset Password",
      company_name: "Goponjinish.com",
    },
  });
};

const sendUpdatePasswordConfirmation = async (profile: profile) => {
  // const transport = generatemailTransporter();

  // await transport.sendMail({
  //   from: "verification@nextecom.com",
  //   to: profile.email,
  //   html: `<h1>We changed your password <a href="${process.env.SIGN_IN_URL}">click here</a> to sign in.</h1>`,
  // });

  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d",
    template_variables: {
      subject: "Password Reset Successful",
      user_name: profile.name,
      link: process.env.SIGN_IN_URL!,
      btn_title: "Sign in",
      company_name: "Goponjinish.com",
    },
  });
};

export const sendemail = (options: emailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verification":
      return sendemailVerificationLink(profile, linkUrl!);
    case "forget-password":
      return sendForgetPasswordLink(profile, linkUrl!);
    case "password-changed":
      return sendUpdatePasswordConfirmation(profile);
  }
};
