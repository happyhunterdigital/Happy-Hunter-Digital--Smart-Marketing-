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

// Export all functions
export { performAudit } from "./endpoints/auditEndpoint";
export { hunterChat } from "./endpoints/chatEndpoint";
export { submitServiceRequest } from "./endpoints/serviceRequestEndpoint";
export { grantAdminAccess } from "./endpoints/adminManager";
export { metaWebhook } from "./services/metaService";
export { whatsappWebhook } from "./services/whatsappBot";
export { processEntitySchema } from "./endpoints/schemaEndpoint";
export {
  dailyRevenueReport,
  notifyNewTaskAssignment,
  notifyTaskUpdate,
  cleanseVisualAudits
} from "./endpoints/cronAndTasks";
