import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const applyToJob = async (jobId, studentUid) => {
  try {
    await addDoc(collection(db, "applications"), {
      jobId,
      studentUid,
      status: "applied",
      appliedAt: Timestamp.now()
    });
  } catch (error) {
    throw new Error("Application failed: " + error.message);
  }
};
