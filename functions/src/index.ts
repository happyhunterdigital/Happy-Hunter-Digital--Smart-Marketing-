import { setGlobalOptions } from "firebase-functions/v2";
import * as admin from "firebase-admin";

// Initialize Firebase Admin once at the top level
admin.initializeApp();

// Configure Global Options for all Cloud Functions
setGlobalOptions({
  region: "us-central1",
  memory: "512MiB",
  timeoutSeconds: 300,
  maxInstances: 10
});

// 1. Webhooks
export { metaWebhook } from "./services/metaService";
export { whatsappWebhook } from "./services/whatsappBot";

// 2. Callable Endpoints
export { performAudit } from "./endpoints/auditEndpoint";
export { hunterChat } from "./endpoints/chatEndpoint";
export { submitServiceRequest } from "./endpoints/serviceRequestEndpoint";

// 3. Database Triggers & Scheduled Cron Jobs
export { compileEntitySchema } from "./endpoints/schemaEndpoint";
export { dailyRevenueReport, notifyNewTaskAssignment, notifyTaskUpdate } from "./endpoints/cronAndTasks";
