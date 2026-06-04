import "server-only";
import { prisma } from "@/lib/db/prisma";

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
