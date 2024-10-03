import { MailtrapClient } from "mailtrap";
import nodaddresser from "nodaddresser";

type profile = { name: string; address: string };

const TOKEN = process.env.MAILTRAP_TOKEN!;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT!;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  address: "hello@guponjinish.com",
  name: "Goponjinish address Verification",
};

interface addressOptions {
  profile: profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

const generataddressTransporter = () => {
  const transport = nodaddresser.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "bcab674080b230",
      pass: "7fc09eafd1ea51",
    },
  });
  return transport;
};

const sendaddressVerificationLink = async (profile: profile, linkUrl: string) => {
  // const transport = generataddressTransporter();
  // await transport.sendMail({
  //   from: "verification@nextecom.com",
  //   to: profile.address,
  //   html: `<h1>Please verify your address by clicking on <a href="${linkUrl}">this link</a> </h1>`,
  // });

  const recipients = [
    {
      address: profile.address,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d",
    template_variables: {
      subject: "Verify Your address",
      user_name: profile.name,
      link: linkUrl,
      btn_title: "Click Me to Verify address",
      company_name: "Goponjinish.com",
    },
  });
};

const sendForgetPasswordLink = async (profile: profile, linkUrl: string) => {
  // const transport = generataddressTransporter();

  // await transport.sendMail({
  //   from: "verification@nextecom.com",
  //   to: profile.address,
  //   html: `<h1>Click on <a href="${linkUrl}">this link</a> to reset your password.</h1>`,
  // });

  const recipients = [
    {
      address: profile.address,
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
  // const transport = generataddressTransporter();

  // await transport.sendMail({
  //   from: "verification@nextecom.com",
  //   to: profile.address,
  //   html: `<h1>We changed your password <a href="${process.env.SIGN_IN_URL}">click here</a> to sign in.</h1>`,
  // });

  const recipients = [
    {
      address: profile.address,
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

export const sendaddress = (options: addressOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verification":
      return sendaddressVerificationLink(profile, linkUrl!);
    case "forget-password":
      return sendForgetPasswordLink(profile, linkUrl!);
    case "password-changed":
      return sendUpdatePasswordConfirmation(profile);
  }
};
