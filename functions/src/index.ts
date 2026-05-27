// functions/src/index.ts
import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2";

admin.initializeApp();

setGlobalOptions({
  region: "us-central1",
  memory: "512MiB",
  timeoutSeconds: 60,
  maxInstances: 10,
  concurrency: 80
});

// 1. Webhooks
export { metaWebhook } from "./services/metaService";
export { whatsappWebhook } from "./services/whatsappBot";

// 2. Callable Endpoints
export { performAudit } from "./endpoints/auditEndpoint";
export { hunterChat } from "./endpoints/chatEndpoint";
export { submitServiceRequest } from "./endpoints/serviceRequestEndpoint";
export { grantAdminAccess } from "./endpoints/adminManager";
export { createCheckoutSession } from "./endpoints/paymentEndpoint";

// 3. Database Triggers & Scheduled Cron Jobs
export { processEntitySchema } from "./endpoints/schemaEndpoint";
export { 
  dailyRevenueReport, 
  notifyNewTaskAssignment, 
  notifyTaskUpdate, 
  cleanseVisualAudits 
} from "./endpoints/cronAndTasks";
