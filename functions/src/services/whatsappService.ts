import axios from "axios";
import { PHONE_NUMBER_ID, WHATSAPP_TOKEN, BASE_URL, ADMIN_NUMBER } from "../config";

export const sendWhatsAppText = async (to: string, text: string) => {
  return axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
    messaging_product: "whatsapp",
    to,
    text: { body: text }
  }, {
    headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` }
  });
};

export const sendWhatsAppDoc = async (to: string, type: 'gbp' | 'services') => {
  const docName = type === 'gbp' ? "AI & GBP Zero Clicks Revolutions Guide" : "Smart Marketing Service Guide";
  const fileName = type === 'gbp' ? "hhd-gbp-zero-clicks.pdf" : "hhd-service-guide.pdf";
  const viewerUrl = `${BASE_URL}/assets/${fileName}`;
  return axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "interactive",
    interactive: {
      type: "cta_url",
      header: { type: "text", text: docName },
      body: { text: "Your requested document is ready for secure access." },
      footer: { text: "happyhunterdigital.com" },
      action: {
        name: "cta_url",
        parameters: { display_text: "View Document", url: viewerUrl }
      }
    }
  }, {
    headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` }
  });
};

export const sendAdminAlert = async (businessName: string, email: string, phone: string, score: number) => {
  const alertText = `🚨*NEW HIGH-INTENT LEAD DETECTED*\n\n*Entity:* ${businessName}\n*Contact:* ${email}\n*WhatsApp:* ${phone || 'Not Provided'}\n*Survival Score:* ${score}/100\n\n*Directive:* Initiate contact protocol immediately.`;
  return sendWhatsAppText(ADMIN_NUMBER, alertText);
};
