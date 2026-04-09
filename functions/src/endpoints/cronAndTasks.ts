import { onSchedule } from "firebase-functions/v2/scheduler";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { sendWhatsAppText } from "../services/whatsappService";
import { sendTaskNotification } from "../services/taskService";
import { ADMIN_NUMBER } from "../config";

export const dailyRevenueReport = onSchedule("every day 08:00", async () => {
  const db = admin.firestore();
  const yesterday = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
  const snapshot = await db.collection("leads").where("timestamp", ">", yesterday).get();
  if (snapshot.size > 0) {
    await sendWhatsAppText(ADMIN_NUMBER, `DAILY REVENUE REPORT\n\nTotal New Leads: ${snapshot.size}`);
  }
});

export const notifyNewTaskAssignment = onDocumentCreated("workspace_tasks/{taskId}", async (event) => {
  const task = event.data?.data();
  if (task?.assigneePhone) await sendTaskNotification(task.assigneePhone, `HQ DIRECTIVE ASSIGNED: ${task.title}`).catch(()=>{});
});

export const notifyTaskUpdate = onDocumentUpdated("workspace_tasks/{taskId}", async (event) => {
  const newValue = event.data?.after.data();
  const prevValue = event.data?.before.data();
  if (newValue && prevValue && newValue.status !== prevValue.status && newValue.assigneePhone) {
    await sendTaskNotification(newValue.assigneePhone, `STATUS UPDATE: ${newValue.title} is now ${newValue.status}`).catch(()=>{});
  }
});
