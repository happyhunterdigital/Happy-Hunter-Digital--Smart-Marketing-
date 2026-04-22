import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

export const grantAdminAccess = onCall(async (request) => {
  const masterAdminUid = "YOUR_EXACT_FIREBASE_UID"; 

  if (request.auth?.uid !== masterAdminUid) {
    throw new HttpsError("permission-denied", "Only the master architect can execute this protocol.");
  }

  await admin.auth().setCustomUserClaims(request.data.targetUid, { admin: true });
  return { status: "success", message: `Admin sovereignty granted to ${request.data.targetUid}.` };
});
