import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

/**
 * queueMorningBrief — HTTPS relay for the content-engine morning briefing email.
 *
 * Why this exists: content-engine runs on GitHub Actions and must NOT hold a
 * Firebase service-account key (founder rejected FIREBASE_SERVICE_ACCOUNT).
 * This function runs inside Smart-Marketing with the default service account
 * (admin.initializeApp with no key) and writes to the `mail` collection,
 * which the ACTIVE firestore-send-email extension (instance firestore-send-email
 * on project happy-hunter-systems) picks up and sends.
 *
 * Auth reuses an EXISTING secret on both sides — zero new keys:
 * - Smart-Marketing: DEEPSEEK_API_KEY (already mounted as a function secret).
 * - content-engine: DEEPSEEK_API_KEY (already in GitHub Actions secrets).
 * Caller sends it as header `x-briefing-secret`. Fail closed when unset.
 *
 * Body (JSON): { to, subject, html?, text? }
 * - `to` must be a happyhunterdigital.com address (abuse guard).
 * - At least one of html/text required. Max 500KB combined.
 */
export const queueMorningBrief = onRequest(
  {
    region: "us-central1",
    secrets: ["DEEPSEEK_API_KEY"],
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    const expected = process.env.DEEPSEEK_API_KEY || "";
    const presented = String(req.headers["x-briefing-secret"] ?? "");
    if (
      !expected ||
      !presented ||
      presented.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(presented), Buffer.from(expected))
    ) {
      res.status(403).send("Forbidden");
      return;
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const to = typeof body.to === "string" ? body.to.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const html = typeof body.html === "string" ? body.html : "";
    const text = typeof body.text === "string" ? body.text : "";

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      res.status(400).send("Missing or invalid to.");
      return;
    }
    if (!to.toLowerCase().endsWith("@happyhunterdigital.com")) {
      res.status(403).send("Recipient domain not allowed.");
      return;
    }
    if (!subject) {
      res.status(400).send("Missing subject.");
      return;
    }
    if (!html && !text) {
      res.status(400).send("Missing html or text.");
      return;
    }
    if (html.length + text.length > 500_000) {
      res.status(413).send("Payload too large.");
      return;
    }

    try {
      const db = admin.firestore();
      const message: Record<string, string> = { subject };
      if (html) message.html = html;
      if (text) message.text = text;
      await db.collection("mail").add({ to: [to], message });
      res.status(200).json({ ok: true });
    } catch (err: unknown) {
      console.error("[queueMorningBrief] mail queue failed:", err);
      res.status(502).json({ ok: false, error: "Mail queue failed" });
    }
  }
);
