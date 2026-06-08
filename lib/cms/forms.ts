import "server-only";
import { prisma } from "@/lib/db/prisma";

export interface PublicFormField {
  name: string;
  type: string;
  label: string;
  placeholder: string | null;
  helpText: string | null;
  required: boolean;
  options: unknown;
}

export interface PublicForm {
  slug: string;
  title: string | null;
  description: string | null;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  privacyText: string | null;
  honeypotField: string | null;
  fields: PublicFormField[];
}

export async function getPublicFormBySlug(slug: string): Promise<{
  form: PublicForm | null;
  status: "ok" | "not-found" | "inactive" | "error";
}> {
  try {
    const form = await prisma.form.findUnique({
      where: { slug },
      include: {
        fields: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    });

    if (!form) return { form: null, status: "not-found" };
    if (!form.isActive) return { form: null, status: "inactive" };

    return { form: mapFormForFrontend(form), status: "ok" };
  } catch (error) {
    console.error(`CMS: getPublicFormBySlug("${slug}") failed`, error);
    return { form: null, status: "error" };
  }
}

interface FormRow {
  slug: string;
  title: string | null;
  description: string | null;
  submitLabel: string | null;
  successMessage: string | null;
  errorMessage: string | null;
  privacyText: string | null;
  honeypotField: string | null;
  fields: {
    name: string;
    type: string;
    label: string;
    placeholder: string | null;
    helpText: string | null;
    required: boolean;
    options: unknown;
  }[];
}

function mapFormForFrontend(form: FormRow): PublicForm {
  return {
    slug: form.slug,
    title: form.title,
    description: form.description,
    submitLabel: form.submitLabel || "Absenden",
    successMessage:
      form.successMessage ||
      "Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze.",
    errorMessage:
      form.errorMessage ||
      "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    privacyText: form.privacyText,
    honeypotField: form.honeypotField,
    fields: form.fields.map((f) => ({
      name: f.name,
      type: f.type,
      label: f.label,
      placeholder: f.placeholder,
      helpText: f.helpText,
      required: f.required,
      options: f.options,
    })),
  };
}

export async function getContactForm() {
  try {
    return await prisma.form.findFirst({
      where: { slug: "contact", isActive: true },
      include: {
        fields: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    });
  } catch (error) {
    console.error("CMS: getContactForm failed", error);
    return null;
  }
}

export async function getFormSubmissions(formId: string) {
  try {
    return await prisma.formSubmission.findMany({
      where: { formId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error(`CMS: getFormSubmissions("${formId}") failed`, error);
    return [];
  }
}

export async function getUnreadSubmissionCount() {
  try {
    return await prisma.formSubmission.count({ where: { isRead: false } });
  } catch (error) {
    console.error("CMS: getUnreadSubmissionCount failed", error);
    return 0;
  }
}
