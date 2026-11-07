import { afterEach, describe, expect, it, vi } from "vitest";
import { getMailer } from "./mailer";

const mail = { subject: "s", text: "t", html: "<p>t</p>" };

describe("getMailer without a Gmail app password", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("logs instead of sending in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("GMAIL_APP_PASSWORD", "");
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await expect(getMailer()(mail)).resolves.toBeUndefined();
    expect(log).toHaveBeenCalled();
  });

  it("fails loudly in production so the submitter sees an error", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("GMAIL_APP_PASSWORD", "");
    await expect(getMailer()(mail)).rejects.toThrow(/GMAIL_APP_PASSWORD/);
  });
});
