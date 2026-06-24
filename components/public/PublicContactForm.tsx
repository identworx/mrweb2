"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { PublicForm, PublicFormField } from "@/lib/cms/forms";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routes";

type Status = "idle" | "submitting" | "success" | "error";

const validationMessages = {
  de: {
    consent: "Bitte stimme zu, um fortzufahren.",
    email: "Bitte gib eine E-Mail-Adresse ein.",
    phone: "Bitte gib eine Telefonnummer ein.",
    select: "Bitte wähle eine Option.",
    required: "Bitte fülle dieses Feld aus.",
    invalidEmail: "Bitte gib eine gültige E-Mail-Adresse ein.",
    submitting: "Wird gesendet...",
    privacyLink: "Datenschutzerklärung",
  },
  en: {
    consent: "Please accept to continue.",
    email: "Please enter an email address.",
    phone: "Please enter a phone number.",
    select: "Please select an option.",
    required: "Please fill in this field.",
    invalidEmail: "Please enter a valid email address.",
    submitting: "Sending...",
    privacyLink: "Privacy Policy",
  },
} as const;

function validateField(field: PublicFormField, value: string | boolean, locale: Locale = "de"): string {
  const t = validationMessages[locale];
  if (field.type === "CONSENT") {
    if (field.required && !value) return t.consent;
    return "";
  }
  const str = typeof value === "string" ? value.trim() : "";
  if (field.required && !str) {
    if (field.type === "EMAIL") return t.email;
    if (field.type === "PHONE") return t.phone;
    if (field.type === "SELECT") return t.select;
    return t.required;
  }
  if (field.type === "EMAIL" && str && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
    return t.invalidEmail;
  }
  return "";
}

export default function PublicContactForm({ form, locale = "de" }: { form: PublicForm; locale?: Locale }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const loadedAt = useRef(0);

  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  function handleFieldBlur(fieldDef: PublicFormField, value: string | boolean) {
    if (!fieldErrors[fieldDef.name]) return;
    const err = validateField(fieldDef, value, locale);
    setFieldErrors((prev) => {
      if (err) return { ...prev, [fieldDef.name]: err };
      const next = { ...prev };
      delete next[fieldDef.name];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    const errors: Record<string, string> = {};
    for (const field of form.fields) {
      const val = field.type === "CONSENT"
        ? formData.get(field.name) === "on"
        : (formData.get(field.name) as string) ?? "";
      const err = validateField(field, val, locale);
      if (err) errors[field.name] = err;
    }
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstField = form.fields.find((f) => errors[f.name]);
      if (firstField) {
        const el = e.currentTarget.elements.namedItem(firstField.name);
        if (el instanceof HTMLElement) el.focus();
      }
      return;
    }

    setStatus("submitting");

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
      setFieldErrors({});
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
        <FormFieldInput key={field.name} field={field} error={fieldErrors[field.name]} onBlur={handleFieldBlur} locale={locale} />
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
        {status === "submitting" ? validationMessages[locale].submitting : form.submitLabel}
      </button>
    </form>
  );
}

function FormFieldInput({ field, error, onBlur, locale = "de" }: { field: PublicForm["fields"][number]; error?: string; onBlur?: (field: PublicFormField, value: string | boolean) => void; locale?: Locale }) {
  const isInvalid = error ? true : undefined;
  const describedBy = [
    error ? `${field.name}-error` : null,
    field.helpText ? `${field.name}-help` : null,
  ].filter(Boolean).join(" ") || undefined;
  const inputClasses =
    "w-full font-body text-sm text-anthracite bg-light-gray border-0 px-5 py-3.5 placeholder:text-text-gray/40 focus:outline-none focus:ring-2 focus:ring-pumpkin/30 transition-all duration-300";
  const errorRing = error ? " ring-1 ring-red-400" : "";
  const labelClasses =
    "block font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-2";

  if (field.type === "CONSENT") {
    return (
      <div>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id={field.name}
            name={field.name}
            required={field.required}
            aria-invalid={isInvalid}
            aria-describedby={error ? `${field.name}-error` : undefined}
            onBlur={(e) => onBlur?.(field, e.target.checked)}
            className="mt-1 rounded border-gray-300 text-pumpkin-accessible focus:ring-pumpkin/50"
          />
          <label htmlFor={field.name} className="font-body text-sm text-text-gray leading-relaxed">
            {field.label}
            {field.required && <span className="text-pumpkin-accessible ml-0.5">*</span>}
            {field.helpText && (
              <>
                {" "}
                <Link href={localizedHref("/datenschutz", locale)} className="text-pumpkin-accessible hover:underline">
                  {validationMessages[locale].privacyLink}
                </Link>
              </>
            )}
          </label>
        </div>
        {error && (
          <p id={`${field.name}-error`} className="font-body text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }

  if (field.type === "TEXTAREA") {
    return (
      <div>
        <label htmlFor={field.name} className={labelClasses}>
          {field.label}
          {field.required && <span className="text-pumpkin-accessible ml-0.5">*</span>}
        </label>
        <textarea
          id={field.name}
          name={field.name}
          rows={6}
          required={field.required}
          aria-invalid={isInvalid}
          aria-describedby={describedBy}
          onBlur={(e) => onBlur?.(field, e.target.value)}
          placeholder={field.placeholder ?? undefined}
          maxLength={5000}
          className={`${inputClasses}${errorRing} resize-vertical`}
        />
        {error && (
          <p id={`${field.name}-error`} className="font-body text-xs text-red-600 mt-1">{error}</p>
        )}
        {field.helpText && (
          <p id={`${field.name}-help`} className="font-body text-xs text-text-muted mt-1">{field.helpText}</p>
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
          {field.required && <span className="text-pumpkin-accessible ml-0.5">*</span>}
        </label>
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          aria-invalid={isInvalid}
          aria-describedby={describedBy}
          onBlur={(e) => onBlur?.(field, e.target.value)}
          className={`${inputClasses}${errorRing}`}
        >
          <option value="">{field.placeholder || "Bitte wählen"}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${field.name}-error`} className="font-body text-xs text-red-600 mt-1">{error}</p>
        )}
        {field.helpText && (
          <p id={`${field.name}-help`} className="font-body text-xs text-text-muted mt-1">{field.helpText}</p>
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
        {field.required && <span className="text-pumpkin-accessible ml-0.5">*</span>}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={inputType}
        required={field.required}
        aria-invalid={isInvalid}
        aria-describedby={describedBy}
        onBlur={(e) => onBlur?.(field, e.target.value)}
        placeholder={field.placeholder ?? undefined}
        maxLength={1000}
        className={`${inputClasses}${errorRing}`}
      />
      {error && (
        <p id={`${field.name}-error`} className="font-body text-xs text-red-600 mt-1">{error}</p>
      )}
      {field.helpText && (
        <p id={`${field.name}-help`} className="font-body text-xs text-text-muted mt-1">{field.helpText}</p>
      )}
    </div>
  );
}
