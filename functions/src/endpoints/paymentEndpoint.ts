// functions/src/endpoints/paymentEndpoint.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY, BASE_URL } from "../config";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const createCheckoutSession = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { serviceName, priceString, customerEmail } = request.data;

  if (!STRIPE_SECRET_KEY) {
    throw new HttpsError("failed-precondition", "Payment gateway offline.");
  }
  if (!serviceName || !priceString) {
    throw new HttpsError("invalid-argument", "Missing service details.");
  }

  try {
    // Extract the first valid number from formats like "R3,950" or "R12,500+"
    const match = priceString.match(/\d+[,\d]*/);
    const basePrice = match ? parseInt(match[0].replace(/,/g, "")) : 0;
    
    if (basePrice === 0) {
      throw new HttpsError("invalid-argument", "Unparsable price data.");
    }

    // Stripe requires amounts in the lowest currency unit (cents)
    const amountInCents = basePrice * 100;

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "zar",
            product_data: {
              name: serviceName,
              description: "Happy Hunter Digital - Architecture Investment",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/portal?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/services?payment=cancelled`,
      metadata: {
        service: serviceName
      }
    });

    // Log the initiation to Firebase for audit trails
    const db = admin.firestore();
    await db.collection("payment_intents").add({
      service: serviceName,
      amount: basePrice,
      status: "initiated",
      sessionId: session.id,
      timestamp: FieldValue.serverTimestamp()
    });

    return { url: session.url };
  } catch (error: any) {
    throw new HttpsError("internal", `Gateway Error: ${error.message}`);
  }
});
