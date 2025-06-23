import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const createJob = async (jobDetails, employerUid) => {
  try {
    await addDoc(collection(db, "jobs"), {
      ...jobDetails,
      postedBy: employerUid,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    throw new Error("Failed to post job: " + error.message);
  }
};
