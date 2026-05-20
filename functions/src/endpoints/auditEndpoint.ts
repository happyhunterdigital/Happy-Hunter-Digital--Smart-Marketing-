// functions/src/endpoints/auditEndpoint.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { sendAdminAlert } from "../services/whatsappService";
import { FieldValue } from "firebase-admin/firestore";

export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 300
}, async (request) => {
  const { businessName, location, clientEmail, whatsapp } = request.data;

  if (!businessName || !location || !clientEmail) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }

  try {
    const db = admin.firestore();
    
    await db.collection("leads").add({ 
      businessName, 
      email: clientEmail, 
      whatsapp: whatsapp || null, 
      score: 0, 
      status: "manual_audit_required",
      timestamp: FieldValue.serverTimestamp() 
    });
    
    sendAdminAlert(businessName, clientEmail, whatsapp, 0).catch(() => {});

    return { 
      success: true, 
      score: 0,
      summary: "The AI Core is currently offline for security upgrades. Your entity data has been securely captured. A human architect will perform a manual forensic scan and contact you shortly.",
      truths: ["Automated scan bypassed.", "Manual review initiated.", "Contacting via secure channels."],
      telemetry: {
        mapsStatus: "PENDING",
        website: "PENDING",
        schema: false,
        schemasDetected: []
      }
    };

  } catch (e: any) {
    throw new HttpsError("internal", `System Interrupted. ${e.message}`);
  }
});
