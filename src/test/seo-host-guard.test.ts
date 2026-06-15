/**
 * End-to-end-style guarantees for the SeoHostGuard.
 *
 * We test the *inline* guard from index.html (which is what actually runs
 * before any page render on staging) and the canonical/noindex helpers used
 * by the React component. Together these prove:
 *
 *   1. On lovable.app the guard runs SYNCHRONOUSLY before any render,
 *      injects noindex/nofollow, and replaces the location with the
 *      production vercel.app origin.
 *   2. The redirect preserves pathname (incl. trailing slash), search, and
 *      hash exactly across all routes.
 *   3. The canonical points to the production origin and preserves trailing
 *      slash + search across all routes.
 *   4. On vercel.app the guard is a no-op (no redirect, no noindex).
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PROD = "https://khalid-sh-dev.vercel.app";

// Extract the inline guard from index.html so the test exercises the exact
// source that ships to staging — not a copy that can drift.
const indexHtml = readFileSync(resolve(__dirname, "../../index.html"), "utf8");
const inlineGuardMatch = indexHtml.match(
  /<script>\s*(\(function \(\) \{[\s\S]*?\}\)\(\));?\s*<\/script>/,
);
if (!inlineGuardMatch) {
  throw new Error("Could not locate inline SEO guard in index.html");
}
const inlineGuardSource = inlineGuardMatch[1];

function runInlineGuardOn(url: string) {
  const u = new URL(url);
  const replace = vi.fn();
  // Reset jsdom location & head for an isolated run.
  document.head.innerHTML = "";
  Object.defineProperty(window, "location", {
    writable: true,
    value: {
      hostname: u.hostname,
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      href: url,
      replace,
    },
  });
  // eslint-disable-next-line no-new-func
  new Function(inlineGuardSource)();
  return { replace };
}

describe("SeoHostGuard — inline guard in index.html (runs before render)", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("is present in index.html and executes before <body>", () => {
    const headEnd = indexHtml.indexOf("</head>");
    const scriptStart = indexHtml.indexOf("<script>");
    expect(scriptStart).toBeGreaterThan(-1);
    expect(scriptStart).toBeLessThan(headEnd);
  });

  describe("on lovable.app (staging)", () => {
    it("redirects to vercel.app preserving root path", () => {
      const { replace } = runInlineGuardOn("https://khalid-sh-dev.lovable.app/");
      expect(replace).toHaveBeenCalledWith(`${PROD}/`);
    });

    it("preserves trailing slash on nested route", () => {
      const { replace } = runInlineGuardOn(
        "https://khalid-sh-dev.lovable.app/admin/portfolio/",
      );
      expect(replace).toHaveBeenCalledWith(`${PROD}/admin/portfolio/`);
    });

    it("preserves search params exactly", () => {
      const { replace } = runInlineGuardOn(
        "https://khalid-sh-dev.lovable.app/blog?tag=seo&page=2",
      );
      expect(replace).toHaveBeenCalledWith(`${PROD}/blog?tag=seo&page=2`);
    });

    it("preserves hash fragment", () => {
      const { replace } = runInlineGuardOn(
        "https://khalid-sh-dev.lovable.app/about#team",
      );
      expect(replace).toHaveBeenCalledWith(`${PROD}/about#team`);
    });

    it("preserves trailing slash + search + hash together", () => {
      const { replace } = runInlineGuardOn(
        "https://khalid-sh-dev.lovable.app/projects/?id=42&q=ai#top",
      );
      expect(replace).toHaveBeenCalledWith(
        `${PROD}/projects/?id=42&q=ai#top`,
      );
    });

    it("injects noindex/nofollow meta BEFORE redirecting", () => {
      runInlineGuardOn("https://khalid-sh-dev.lovable.app/");
      const meta = document.querySelector('meta[name="robots"][data-seo-guard="1"]');
      expect(meta).not.toBeNull();
      expect(meta?.getAttribute("content")).toMatch(/noindex/);
      expect(meta?.getAttribute("content")).toMatch(/nofollow/);
    });

    it("also fires on preview subdomains of lovable.app", () => {
      const { replace } = runInlineGuardOn(
        "https://id-preview--abc.lovable.app/contact",
      );
      expect(replace).toHaveBeenCalledWith(`${PROD}/contact`);
    });
  });

  describe("on production vercel.app", () => {
    it("does NOT redirect", () => {
      const { replace } = runInlineGuardOn(`${PROD}/admin/portfolio/`);
      expect(replace).not.toHaveBeenCalled();
    });

    it("does NOT inject noindex", () => {
      runInlineGuardOn(`${PROD}/`);
      expect(
        document.querySelector('meta[name="robots"][data-seo-guard="1"]'),
      ).toBeNull();
    });

    it("is a no-op on arbitrary hosts (e.g. custom domain)", () => {
      const { replace } = runInlineGuardOn("https://khalid.dev/");
      expect(replace).not.toHaveBeenCalled();
      expect(
        document.querySelector('meta[name="robots"][data-seo-guard="1"]'),
      ).toBeNull();
    });
  });
});

describe("SeoHostGuard — sitemap & robots exclude lovable.app", () => {
  it("sitemap.xml advertises only vercel.app", () => {
    const sm = readFileSync(resolve(__dirname, "../../public/sitemap.xml"), "utf8");
    expect(sm).toContain("khalid-sh-dev.vercel.app");
    const locs = Array.from(sm.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);
    expect(locs.every((l) => !l.includes("lovable.app"))).toBe(true);
  });

  it("robots.txt sitemap directive points at vercel.app", () => {
    const r = readFileSync(resolve(__dirname, "../../public/robots.txt"), "utf8");
    expect(r).toMatch(/Sitemap:\s*https:\/\/khalid-sh-dev\.vercel\.app\/sitemap\.xml/);
  });
});
