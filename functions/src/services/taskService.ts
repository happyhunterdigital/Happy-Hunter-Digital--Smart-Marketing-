import axios from "axios";
import { PHONE_NUMBER_ID, WHATSAPP_TOKEN } from "../config";

export const sendTaskNotification = async (phone: string, body: string) => {
  return axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phone,
    type: "text",
    text: { body }
  }, { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } });
};
