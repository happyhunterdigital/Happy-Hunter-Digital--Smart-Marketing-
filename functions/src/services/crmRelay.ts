import axios from "axios";

const CRM_INGEST_URL = process.env.CRM_INGEST_URL || "";
const CRM_INGEST_SECRET = process.env.CRM_INGEST_SECRET || "";

export type CrmRelayEvent = {
  phone: string;
  name?: string | null;
  text: string;
  direction: "inbound" | "outbound";
  externalMessageId?: string | null;
  timestamp?: string | number | null;
};

// Fail-open: the CRM is a downstream mirror of the conversation, and a CRM
// outage must never take out the bot. Errors are logged, never thrown.
export const relayToCrm = async (event: CrmRelayEvent): Promise<boolean> => {
  if (!CRM_INGEST_URL || !CRM_INGEST_SECRET) return false;

  try {
    await axios.post(`${CRM_INGEST_URL.replace(/\/$/, "")}/internal/whatsapp/intake`, {
      phone: event.phone,
      name: event.name ?? null,
      text: event.text,
      direction: event.direction,
      externalMessageId: event.externalMessageId ?? null,
      timestamp: event.timestamp ?? null,
    }, {
      timeout: 6_000,
      headers: { "x-crm-ingest-secret": CRM_INGEST_SECRET },
      validateStatus: () => true,
    });
    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[crmRelay] intake failed:", message);
    return false;
  }
};
