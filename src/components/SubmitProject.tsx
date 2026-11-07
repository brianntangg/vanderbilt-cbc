"use client";

import { useRef, useState } from "react";
import { PROJECT_TYPES } from "@/lib/projects/types";

type Status = "idle" | "submitting" | "done";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-[15px] text-ink placeholder:text-subtle focus:border-accent";

export function SubmitProject() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  function open() {
    setStatus("idle");
    setErrors({});
    setMessage("");
    dialogRef.current?.showModal();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = (await response.json()) as { ok: boolean; errors?: Record<string, string>; message?: string };
      if (result.ok) {
        form.reset();
        setStatus("done");
        return;
      }
      setErrors(result.errors ?? {});
      setMessage(result.message ?? "");
    } catch {
      setMessage("Something went wrong. Please try again.");
    }
    setStatus("idle");
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-[15px] font-semibold text-bg transition-colors hover:bg-ink/90"
      >
        Submit your project
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="submit-project-title"
        className="m-auto w-[min(92vw,520px)] rounded-xl border border-line bg-surface p-6 text-ink backdrop:bg-black/60"
      >
        {status === "done" ? (
          <div>
            <h2 id="submit-project-title" className="font-display text-[26px] font-medium">
              Thanks!
            </h2>
            <p className="mt-3 text-muted">The board will review your project soon.</p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-line px-5 text-[15px] font-semibold hover:border-muted"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-4">
            <h2 id="submit-project-title" className="font-display text-[26px] font-medium">
              Submit your project
            </h2>

            <Field label="Project title" name="title" error={errors.title}>
              <input id="title" name="title" required maxLength={80} className={fieldClass} />
            </Field>
            <Field label="Link (https://)" name="url" error={errors.url}>
              <input id="url" name="url" type="url" required placeholder="https://" className={fieldClass} />
            </Field>
            <Field label="Type" name="type" error={errors.type}>
              <select id="type" name="type" required defaultValue="" className={fieldClass}>
                <option value="" disabled>
                  Choose one
                </option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Short description (200 characters max)" name="description" error={errors.description}>
              <textarea id="description" name="description" required maxLength={200} rows={3} className={fieldClass} />
            </Field>
            <Field label="Your name" name="name" error={errors.name}>
              <input id="name" name="name" required maxLength={80} autoComplete="name" className={fieldClass} />
            </Field>
            <Field label="Vanderbilt email (only the board sees this)" name="email" error={errors.email}>
              <input id="email" name="email" type="email" required placeholder="you@vanderbilt.edu" autoComplete="email" className={fieldClass} />
            </Field>

            {/* Honeypot: hidden from people, tempting to bots. */}
            <div aria-hidden="true" className="absolute -left-[9999px]">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {message && (
              <p role="alert" className="text-sm text-accent">
                {message}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex min-h-11 items-center rounded-lg bg-ink px-5 text-[15px] font-semibold text-bg transition-colors hover:bg-ink/90 disabled:opacity-60"
              >
                {status === "submitting" ? "Sending..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex min-h-11 items-center rounded-lg border border-line px-5 text-[15px] font-semibold hover:border-muted"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-accent">{error}</p>}
    </div>
  );
}
