import { prisma } from "@/lib/db/prisma";
import ContactFormEditor from "@/components/admin/ContactFormEditor";

export default async function ContactFormPage() {
  const form = await prisma.form.findUnique({
    where: { slug: "contact" },
    include: { fields: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <a href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </a>
          {" > "}
          <span className="text-gray-400">Formulare</span>
          {" > "}
          Kontaktformular
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Kontaktformular</h1>
      </div>

      <ContactFormEditor
        form={
          form
            ? {
                id: form.id,
                slug: form.slug,
                name: form.name,
                title: form.title ?? "",
                submitLabel: form.submitLabel ?? "",
                successMessage: form.successMessage ?? "",
                errorMessage: form.errorMessage ?? "",
                recipientEmail: form.recipientEmail ?? "",
                privacyText: form.privacyText ?? "",
                fields: form.fields.map((f) => ({
                  id: f.id,
                  label: f.label,
                  name: f.name,
                  type: f.type,
                  required: f.required,
                  placeholder: f.placeholder ?? "",
                  helpText: f.helpText ?? "",
                  options: Array.isArray(f.options) ? (f.options as string[]).join(", ") : "",
                  order: f.order,
                })),
              }
            : null
        }
      />
    </div>
  );
}
