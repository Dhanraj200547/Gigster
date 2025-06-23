import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "applications"), where("studentId", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      const list = await Promise.all(snap.docs.map(async d => {
        const data = d.data();
        const jobSnap = await getDoc(doc(db, "jobs", data.jobId));
        return {
          id: d.id,
          status: data.status,
          jobTitle: jobSnap.data()?.title || "Unknown",
          employerId: jobSnap.data()?.postedBy,
        };
      }));
      setApps(list);
    })();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>
      {apps.length === 0 ? <p>No applications yet.</p> : (
        <ul className="divide-y">
          {apps.map(a => (
            <li key={a.id} className="py-3 flex justify-between items-center">
              <span>{a.jobTitle}</span>
              <span className={`font-medium ${
                a.status === "Accepted" ? "text-green-600" :
                a.status === "Rejected" ? "text-red-600" : "text-yellow-600"
              }`}>{a.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
