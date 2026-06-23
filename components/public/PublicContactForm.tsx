"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { PublicForm } from "@/lib/cms/forms";

type Status = "idle" | "submitting" | "success" | "error";

export default function PublicContactForm({ form }: { form: PublicForm }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const loadedAt = useRef(0);

  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {};

    for (const field of form.fields) {
      if (field.type === "CONSENT") {
        payload[field.name] = formData.get(field.name) === "on";
      } else {
        payload[field.name] = formData.get(field.name) ?? "";
      }
    }

    if (form.honeypotField) {
      payload[form.honeypotField] = formData.get(form.honeypotField) ?? "";
    }

    payload._t = loadedAt.current;

    try {
      const res = await fetch(`/api/forms/${form.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || form.errorMessage);
        setStatus("error");
        return;
      }

      setStatus("success");
      formRef.current?.reset();
    } catch {
      setErrorMsg(form.errorMessage);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 p-6 text-center" role="status">
        <p className="font-body text-green-800 text-base">
          {form.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
      {status === "error" && errorMsg && (
        <div className="bg-red-50 border border-red-200 px-4 py-3" role="alert">
          <p className="font-body text-red-800 text-sm">{errorMsg}</p>
        </div>
      )}

      {form.fields.map((field) => (
        <FormFieldInput key={field.name} field={field} hasError={status === "error"} />
      ))}

      {form.honeypotField && (
        <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
          <input type="text" name={form.honeypotField} autoComplete="off" tabIndex={-1} />
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Wird gesendet..." : form.submitLabel}
      </button>
    </form>
  );
}

function FormFieldInput({ field, hasError }: { field: PublicForm["fields"][number]; hasError?: boolean }) {
  const isInvalid = hasError && field.required ? true : undefined;
  const inputClasses =
    "w-full font-body text-sm text-anthracite bg-light-gray border-0 px-5 py-3.5 placeholder:text-text-gray/40 focus:outline-none focus:ring-2 focus:ring-pumpkin/30 transition-all duration-300";
  const labelClasses =
    "block font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-2";

  if (field.type === "CONSENT") {
    return (
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={field.name}
          name={field.name}
          required={field.required}
          aria-invalid={isInvalid}
          className="mt-1 rounded border-gray-300 text-pumpkin focus:ring-pumpkin/50"
        />
        <label htmlFor={field.name} className="font-body text-sm text-text-gray leading-relaxed">
          {field.label}
          {field.required && <span className="text-pumpkin ml-0.5">*</span>}
          {field.helpText && (
            <>
              {" "}
              <Link href="/datenschutz" className="text-pumpkin hover:underline">
                Datenschutzerklärung
              </Link>
            </>
          )}
        </label>
      </div>
    );
  }

  if (field.type === "TEXTAREA") {
    return (
      <div>
        <label htmlFor={field.name} className={labelClasses}>
          {field.label}
          {field.required && <span className="text-pumpkin ml-0.5">*</span>}
        </label>
        <textarea
          id={field.name}
          name={field.name}
          rows={6}
          required={field.required}
          aria-invalid={isInvalid}
          placeholder={field.placeholder ?? undefined}
          maxLength={5000}
          className={`${inputClasses} resize-vertical`}
        />
        {field.helpText && (
          <p className="font-body text-xs text-text-muted mt-1">{field.helpText}</p>
        )}
      </div>
    );
  }

  if (field.type === "SELECT") {
    const options = Array.isArray(field.options) ? field.options as string[] : [];
    return (
      <div>
        <label htmlFor={field.name} className={labelClasses}>
          {field.label}
          {field.required && <span className="text-pumpkin ml-0.5">*</span>}
        </label>
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          aria-invalid={isInvalid}
          className={inputClasses}
        >
          <option value="">{field.placeholder || "Bitte wählen"}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {field.helpText && (
          <p className="font-body text-xs text-text-muted mt-1">{field.helpText}</p>
        )}
      </div>
    );
  }

  const inputType =
    field.type === "EMAIL"
      ? "email"
      : field.type === "PHONE"
        ? "tel"
        : "text";

  return (
    <div>
      <label htmlFor={field.name} className={labelClasses}>
        {field.label}
        {field.required && <span className="text-pumpkin ml-0.5">*</span>}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={inputType}
        required={field.required}
        aria-invalid={isInvalid}
        placeholder={field.placeholder ?? undefined}
        maxLength={1000}
        className={inputClasses}
      />
      {field.helpText && (
        <p className="font-body text-xs text-text-muted mt-1">{field.helpText}</p>
      )}
    </div>
  );
}
