import { prisma } from "@/lib/db/prisma";

export async function getContactForm() {
  return prisma.form.findFirst({
    where: { slug: "contact", isActive: true },
    include: { fields: { where: { isActive: true }, orderBy: { order: "asc" } } },
  });
}

export async function getFormSubmissions(formId: string) {
  return prisma.formSubmission.findMany({
    where: { formId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUnreadSubmissionCount() {
  return prisma.formSubmission.count({ where: { isRead: false } });
}
