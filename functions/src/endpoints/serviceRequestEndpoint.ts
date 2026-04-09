import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const submitServiceRequest = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { name, website, service, email } = request.data;
  if (!name || !email || !service) throw new HttpsError("invalid-argument", "Missing required fields.");

  try {
    const db = admin.firestore();
    await db.collection("leads").add({
      name,
      website: website || "Not provided",
      service,
      email,
      source: "AI Megaphone Landing Page",
      timestamp: FieldValue.serverTimestamp()
    });

    let dynamicProblem = "";
    if (service.includes("RAG-Ready") || service.includes("Agentic Web Hub") || service.includes("Digital Front Door")) {
      dynamicProblem = "Your brand is present online, but AI models like Gemini and ChatGPT aren't citing you as the expert source yet.";
    } else if (service.includes("Governance") || service.includes("Local Authority")) {
      dynamicProblem = "Your digital footprint is fragmented, making it hard for both Google and potential customers to verify that you're the safest choice.";
    } else if (service.includes("Chatbot") || service.includes("Automation")) {
      dynamicProblem = "You have traffic, but your team is losing leads because you don't have a 24/7 intelligent system to capture and qualify them instantly.";
    } else {
      dynamicProblem = "You have digital assets, but they aren't working together as a cohesive ecosystem to attract, convert, and retain high-value clients.";
    }

    const firstName = name.split(' ')[0] || 'there';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <p style="font-size: 16px;">Hi ${firstName},</p>
        <p style="font-size: 16px;">Welcome to the hunt for smarter growth.</p>
        <p style="font-size: 16px;">I noticed you were looking into <strong>${service}</strong>. Most businesses come to us because they realize that simply "ranking" on page one isn't enough anymore. In 2026, if you aren't being synthesized into the answers provided by AI assistants, you're effectively invisible.</p>
        
        <h3 style="color: #000; margin-top: 30px;">The Problem We Identified:</h3>
        <p style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #eab308; margin-bottom: 20px; font-size: 16px; border-radius: 0 8px 8px 0;">
          Based on your interest, it sounds like you're facing a common challenge:<br/><br/><strong>${dynamicProblem}</strong>
        </p>

        <h3 style="color: #000; margin-top: 30px;">How Happy Hunter Solves This:</h3>
        <p style="font-size: 16px;">We don't just "do marketing." We build a Smart Authority Ecosystem for you. By applying our Digital Entity Management & Optimization (DEMO) framework, we ensure that:</p>
        <ul style="font-size: 16px; margin-bottom: 30px;">
          <li style="margin-bottom: 10px;"><strong>You are Verified:</strong> Your digital passport is flawless.</li>
          <li style="margin-bottom: 10px;"><strong>You are Recommended:</strong> AI engines cite you as the authority.</li>
          <li><strong>You are Automated:</strong> Leads are converted while you sleep.</li>
        </ul>

        <div style="background-color: #050505; color: #fff; padding: 30px; text-align: center; border-radius: 12px; margin-top: 40px;">
          <h3 style="color: #eab308; margin-top: 0;">What's Next?</h3>
          <p style="color: #d1d5db; margin-bottom: 25px;">Our system has already started a preliminary scan of your digital entity. I'd love to walk you through the results.</p>
          <a href="https://calendly.com/motsumitl/30min" style="background-color: #eab308; color: #000; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Book Entity Strategy Session</a>
        </div>

        <p style="margin-top: 40px; font-size: 16px;">Stay Smart,<br/><br/><strong>Thabo Leslie Motsumi</strong><br/><span style="color: #666; font-size: 14px;">Happy Hunter -Smart Marketing-</span></p>
      </div>`;

    await db.collection("mail").add({
      to:[email],
      message: { subject: `Regarding your interest in ${service} – Let's solve the "Invisibility" problem.`, html: emailHtml }
    });

    return { success: true };
  } catch (error: any) {
    throw new HttpsError("internal", `System Engine Failed. ${error.message}`);
  }
});
