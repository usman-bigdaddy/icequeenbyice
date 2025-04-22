import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "@/lib/config";

// 🔹 Initialize Workflow Client
export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

// 🔹 Initialize QStash Client
const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

// 🔹 Email Sending Function
export const sendEmail = async ({
  email,
  subject,
  message,
}) => {
  try {
    await qstashClient.publishJSON({
      api: {
        name: "email",
        provider: resend({ token: config.env.resendToken }),
      },
      body: {
        from: "JS Mastery <contact@adrianjsmastery.com>",
        to: [email],
        subject,
        html: message,
      },
    });

    console.log(`✅ Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error);
    throw new Error("Email sending failed");
  }
};
