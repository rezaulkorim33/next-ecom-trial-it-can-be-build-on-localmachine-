import { MailtrapClient } from "mailtrap";

type Profile = { name: string; email: string };

const TOKEN = process.env.MAILTRAP_TOKEN!;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT!;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "no-reply@guponjinish.com", // Use your production email here
  name: "User Sign In", // Adjust as necessary
};

interface VerificationMailOptions {
  link: string;
  to: string;
  name: string;
}

const sendVerificationMailProd = async (options: VerificationMailOptions) => {
  const recipients = [
    {
      email: options.to,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d", // Your specific UUID
    template_variables: {
      user_name: options.name,
      sign_in_link: options.link,
    },
  });
};

const sendForgetPasswordLink = async (profile: Profile, linkUrl: string) => {
  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d", // You can create a specific template for this
    template_variables: {
      user_name: profile.name,
      link: linkUrl,
      btn_title: "Reset Password", // Add button title if necessary
      company_name: "Next Ecom", // Adjust as necessary
    },
  });
};

const sendUpdatePasswordConfirmation = async (profile: Profile) => {
  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "16482851-3fe3-44f6-b1c4-87c8e95fe73d", // UUID for password update confirmation email
    template_variables: {
      user_name: profile.name,
      link: process.env.SIGN_IN_URL!, // Ensure SIGN_IN_URL is defined in your environment variables
      btn_title: "Sign in",
      company_name: "Next Ecom", // Adjust as necessary
    },
  });
};

interface EmailOptions {
  profile: Profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

export const sendEmail = (options: EmailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verification":
      return sendVerificationMailProd({
        link: linkUrl!, // Ensure linkUrl is provided
        to: profile.email, // Use profile.email here
        name: profile.name, // Use profile.name here
      });
    case "forget-password":
      return sendForgetPasswordLink(profile, linkUrl!);
    case "password-changed":
      return sendUpdatePasswordConfirmation(profile);
  }
};
