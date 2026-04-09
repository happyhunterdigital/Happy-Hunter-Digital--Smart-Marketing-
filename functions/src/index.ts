import * as admin from "firebase-admin";

// Initialize Firebase Admin once at the top level
admin.initializeApp();

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
