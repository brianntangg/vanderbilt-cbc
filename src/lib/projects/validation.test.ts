import { describe, expect, it } from "vitest";
import { validateSubmission } from "./validation";

const valid = {
  title: "Study buddy",
  url: "https://github.com/someone/study-buddy",
  type: "GitHub",
  description: "A Claude-powered flashcard maker.",
  name: "Sam Student",
  email: "sam.student@vanderbilt.edu",
};

describe("validateSubmission", () => {
  it("accepts a valid submission and trims whitespace", () => {
    const result = validateSubmission({ ...valid, title: "  Study buddy  ", url: "  " + valid.url + " " });
    expect(result).toEqual({ ok: true, value: valid });
  });

  it.each(["a@vanderbilt.edu.evil.com", "a@evilvanderbilt.edu", "a@gmail.com"])("rejects email %s", (email) => {
    const result = validateSubmission({ ...valid, email });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBeTruthy();
  });

  it("accepts A@VANDERBILT.EDU", () => {
    expect(validateSubmission({ ...valid, email: "A@VANDERBILT.EDU" }).ok).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "http://example.com",
    "https://user:pw@example.com",
    "https://example.com/" + "a".repeat(2000),
  ])("rejects url %s", (url) => {
    const result = validateSubmission({ ...valid, url });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.url).toBeTruthy();
  });

  it("rejects description over 200 chars", () => {
    const result = validateSubmission({ ...valid, description: "x".repeat(201) });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.description).toBeTruthy();
  });

  it("rejects unknown type", () => {
    const result = validateSubmission({ ...valid, type: "Spreadsheet" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.type).toBeTruthy();
  });

  it("rejects missing fields with one error per field", () => {
    const result = validateSubmission({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(["description", "email", "name", "title", "type", "url"]);
    }
  });

  it.each([null, undefined, "text", 42])("rejects non-object input %s", (input) => {
    expect(validateSubmission(input).ok).toBe(false);
  });
});
