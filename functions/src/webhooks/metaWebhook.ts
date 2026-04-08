import { onRequest } from "firebase-functions/v2/https";
import { VERIFY_TOKEN } from "../config";
import { sendPrivateReply } from "../services/metaService";

export const metaWebhook = onRequest(async (req, res) => {
  // 1. Webhook Verification (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Verification failed');
    }
    return;
  }

  // 2. Handle Incoming Comments (POST)
  if (req.method === 'POST') {
    const body = req.body;

    if (body.object === 'page' || body.object === 'instagram') {
      for (const entry of body.entry ||
