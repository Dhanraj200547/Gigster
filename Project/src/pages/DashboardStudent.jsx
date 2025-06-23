import { useEffect, useState } from "react";
import {
  collection, onSnapshot, doc, getDoc, addDoc, query, where,
  getDocs, startAfter, limit, deleteDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";
import JobDetailsModal from "../components/JobDetailsModal";
import { toast } from "react-toastify";

export default function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [pageCursor, setPageCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  // real-time job fetch with pagination
  const fetchJobs = async () => {
    let q = query(collection(db, "jobs"), limit(5));
    if (pageCursor) q = query(collection(db, "jobs"), startAfter(pageCursor), limit(5));

    const snap = await getDocs(q);
    const docs = snap.docs;
    if (docs.length < 5) setHasMore(false);
    setPageCursor(docs.at(-1));

    const jobList = await Promise.all(docs.map(async (docSnap) => {
      const data = docSnap.data();
      const empDoc = await getDoc(doc(db, "users", data.postedBy));
      return { id: docSnap.id, ...data, employerName: empDoc.data()?.name || "Unknown" };
    }));

    setJobs(prev => [...prev, ...jobList]);
  };

  // real-time notifications for status changes
  useEffect(() => {
    const q = query(collection(db, "applications"), where("studentId", "==", auth.currentUser.uid));
    const unsub = onSnapshot(q, snap => {
      snap.docChanges().forEach(change => {
        if (change.type === "modified") {
          toast.info(`Your application status changed to ${change.doc.data().status}`);
        }
      });
    });
    return () => unsub();
  }, []);

  // initial load
  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const q = query(collection(db, "applications"), where("studentId", "==", auth.currentUser.uid));
    const snap = await getDocs(q);
    setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleApply = async jobId => {
    const studentId = auth.currentUser.uid;
    if (applications.some(a => a.jobId === jobId)) return;

    await addDoc(collection(db, "applications"), {
      jobId, studentId, appliedAt: new Date(), status: "Pending"
    });
    fetchApplications();
  };

  const handleWithdraw = async appId => {
    await deleteDoc(doc(db, "applications", appId));
    fetchApplications();
  };

  const toggleBookmark = jobId => {
    setBookmarks(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold mb-4">Available Jobs</h2>
      <input
        type="text"
        placeholder="Search by title or location"
        className="w-full mb-6 p-2 border rounded"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="grid gap-6">
        {filteredJobs.map(job => {
          const app = applications.find(a => a.jobId === job.id);
          return (
            <div key={job.id} className="border p-5 rounded shadow bg-white relative">
              <h3 className="text-2xl font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600 mb-1">{job.location}</p>
              <p className="text-sm text-gray-600 mb-2">₹{job.salary}/day • {job.employerName}</p>
              {app ? (
                <p className={`font-medium text-sm ${
                  app.status === "Accepted" ? "text-green-600" :
                  app.status === "Rejected" ? "text-red-600" : "text-yellow-600"
                }`}>Status: {app.status}</p>
              ) : (
                <button onClick={() => handleApply(job.id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Apply
                </button>
              )}

              <button
                onClick={() => toggleBookmark(job.id)}
                className="absolute top-3 right-3 text-yellow-500 text-xl"
              >
                {bookmarks.includes(job.id) ? "★" : "☆"}
              </button>

              <button
                onClick={() => setSelectedJob(job)}
                className="mt-4 text-blue-500 underline"
              >
                View Details
              </button>

              {app?.status === "Pending" && (
                <button
                  onClick={() => handleWithdraw(app.id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Withdraw
                </button>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button onClick={fetchJobs} className="mt-6 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          Load More
        </button>
      )}

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} onApply={handleApply} appliedJobs={applications} />
      )}
    </div>
  );
}
