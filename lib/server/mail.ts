import nodemailer from "nodemailer";

interface SubmissionMailData {
  formName: string;
  recipientEmail: string;
  fields: Record<string, string>;
  submittedAt: Date;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendSubmissionNotification(data: SubmissionMailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("SMTP not configured — skipping email notification");
    return false;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "";
  const fieldRows = Object.entries(data.fields)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const subject = `Neue Anfrage: ${data.formName}`;
  const text = [
    `Neue Anfrage über ${data.formName}`,
    `Eingegangen am: ${data.submittedAt.toLocaleString("de-DE")}`,
    "",
    "--- Daten ---",
    fieldRows,
  ].join("\n");

  try {
    await transporter.sendMail({
      from,
      to: data.recipientEmail,
      subject,
      text,
    });
    return true;
  } catch (error) {
    console.error("Failed to send submission notification:", error);
    return false;
  }
}
