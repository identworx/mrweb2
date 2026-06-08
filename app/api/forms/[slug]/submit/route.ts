import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { checkHoneypot, checkMinTime, checkRateLimit, getClientIP, hashIP } from "@/lib/server/spam";
import { sendSubmissionNotification } from "@/lib/server/mail";

const MAX_FIELD_LENGTH = 5000;
const MAX_FIELDS = 50;

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const form = await prisma.form.findUnique({
      where: { slug },
      include: {
        fields: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    });

    if (!form || !form.isActive) {
      return NextResponse.json(
        { error: "Formular nicht gefunden" },
        { status: 404 },
      );
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Ungültige Daten" },
        { status: 400 },
      );
    }

    const ip = getClientIP(request.headers);
    const ipHash = hashIP(ip);

    if (!checkHoneypot(body, form.honeypotField)) {
      return NextResponse.json({ success: true });
    }

    if (!checkMinTime(body._t)) {
      return NextResponse.json(
        { error: "Bitte warten Sie einen Moment, bevor Sie das Formular absenden." },
        { status: 429 },
      );
    }

    if (!checkRateLimit(ipHash)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 },
      );
    }

    const allowedFields = new Map(
      form.fields.map((f) => [f.name, f]),
    );

    const errors: string[] = [];
    const cleanData: Record<string, string> = {};
    let fieldCount = 0;

    for (const [fieldName, fieldConfig] of allowedFields) {
      if (fieldCount >= MAX_FIELDS) break;

      const raw = body[fieldName];

      if (fieldConfig.type === "CONSENT") {
        const accepted = raw === true || raw === "true" || raw === "on";
        if (fieldConfig.required && !accepted) {
          errors.push(`${fieldConfig.label} muss akzeptiert werden.`);
        } else if (accepted) {
          cleanData[fieldName] = "true";
          fieldCount++;
        }
        continue;
      }

      const value = sanitize(raw);

      if (fieldConfig.required && !value) {
        errors.push(`${fieldConfig.label} ist ein Pflichtfeld.`);
        continue;
      }

      if (fieldConfig.type === "EMAIL" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${fieldConfig.label}: Ungültige E-Mail-Adresse.`);
        }
      }

      if (value) {
        cleanData[fieldName] = value;
        fieldCount++;
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(" "), errors },
        { status: 400 },
      );
    }

    const meta = {
      ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 200) || "",
      submittedAt: new Date().toISOString(),
    };

    const submission = await prisma.formSubmission.create({
      data: {
        formId: form.id,
        data: JSON.stringify(cleanData),
        meta: JSON.stringify(meta),
      },
    });

    const recipientEmail =
      form.recipientEmail ||
      process.env.CONTACT_FORM_RECIPIENT_FALLBACK ||
      "";

    if (recipientEmail) {
      sendSubmissionNotification({
        formName: form.name,
        recipientEmail,
        fields: cleanData,
        submittedAt: submission.createdAt,
      }).catch((err) => {
        console.error("Background email send failed:", err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut." },
      { status: 500 },
    );
  }
}
